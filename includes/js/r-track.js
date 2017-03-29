'use strict';

var rtrack = (function() {

	/**
	 * Init new tracks.
	 *
	 * @param {int} id
	 *   Track number. Must be unique.
	 * @param {string} direction
	 *   Direction of tracks.
	 * @param {int} height
	 *   Fixed height of this track.
	 */
	function Track(id, direction, height) {
		this.direction = direction.toLowerCase();
		if (['n', 's', 'e', 'w'].indexOf(direction) === -1) {
			console.warn('Invalid track direction:', direction);
			this.direction = null;
		}

		this.id = id;
		this.height = height;
		this.segments = [];
		this.trains = [];
	}


	Track.prototype.initRenderer = function() {
		this.container = new PIXI.Container();
		this.renderer = rtrackpixi;
	}


	Track.prototype.setTrackSegments = function setSegments(settings) {
		if (typeof settings === 'object' && settings !== null) {
			for (var i = 0; i < settings.length; i++) {
				this.setTrackSegment(i, settings[i]);
			}
		}
	}


	Track.prototype.setTrackSegment = function setSegment(id, settings) {

		if (typeof settings !== 'object' || settings === null) {
			throw new Error('setTrackSegment expects settings object, but', typeof settings, 'found.');
		}
		else if (typeof id === 'undefined' || typeof id !== 'number') {
			throw new Error('setTrackSegment expects an ID, but none given.');
		}
		else if (typeof settings.length === 'undefined' || typeof settings.length !== 'number' || settings.length <= 0) {
			throw new Error('setTrackSegment expects a positive length.');
		}

		if (typeof this.segments[id] === 'undefined') {
			this.segments[id] = {};
		}

		// Add stop markers.
		if (typeof settings.stop !== 'undefined') {
			for (var i = 0; i < settings.stop.length; i++) {
				this.setTrackStopMarker(id, settings.stop[i][0],settings.stop[i][1]);
			}
		}

		this.segments[id].id = id;
		this.segments[id].length = settings.length;
		this.segments[id].direction = settings.direction;
		this.segments[id].speed = (typeof settings.speed === 'number') ? settings.speed : 20;
		this.segments[id].occupied = false;
		this.segments[id].signals = {};

		// Set a signal at the entry to every segment.
		var signal_pos = (['n','e'].indexOf(settings.direction) >= 0) ? settings.length - 5 : 5;
		this.addSignal(id, signal_pos);
	}


	Track.prototype.addSignal = function addSignal(sid, offset) {
		if (typeof this.segments[sid].signals[offset] === 'undefined') {
			this.segments[sid].signals[offset] = {
				position: offset
			};
		}
	}


	/**
	 * Assign a train to a position.
	 *
	 * @param {int} position
	 *   A coordinate position on the track. Relative to the track.
	 * @param {Train} train
	 *   The train object being added.
	 */
	Track.prototype.setTrackTrain = function setTrain(position, train) {

		// Render the train container, and add it.
		var my_train_container = train.render(position);

		console.log(' > Request to add train', train.id, 'to track', this.id, 'at range:', position, position + train.getLength());

		// Get all segments this train would occupy.
		var my_segments = this.getSegmentsByBounds(position, position + train.getLength());

		console.log('   -> Segments train would occupy:', my_segments);

		// Check each segment, and make sure the entire space is unoccupied.
		if (this.segmentsOccupied(my_segments,null) === true) {
			console.warn('Train cannot be added, as location is already occupied.');
			return false;
		}

		console.log('   -> Location available. Adding train.');
		this.container.addChild(my_train_container);

		// Add the train to this track.
		this.trains.push(train);

		console.log('   -> Train added. Setting segments as occupied.');

		// Assign the train to these track segments.
		this.setSegmentOccupied(my_segments, this.trains.length-1);

		console.log('   -> Segments marked occupied:', my_segments);

		// Set the train direction.
		train.setDirection(this.direction);

		// Set the train position.
		if (this.direction == 'e') {
			train.setPosition(position, this.height, true, false);
		}
		else {
			train.setPosition(position, this.height, true, true);
		}
	}


	/**
	 * Set 1 or more segments as occupied by a train.
	 *
	 * @param {array[objects]} id
	 *   One or more objects, with segment ID in id[n].id.
	 * @param {int} train_id
	 *   The ID of the train which is occupying the space.
	 */
	Track.prototype.setSegmentOccupied = function setSegmentOccupied(id, train_id) {
		if (typeof id === 'number') { id = [id]; }

		for (var i = 0; i < id.length; i++) {
			this.segments[id[i].id].occupied = train_id;
		}
	}


	/**
	 * Reset a given segment to unoccupied.
	 *
	 * @param  {array[obj]} id
	 *   One or more segment IDs.
	 */
	Track.prototype.resetSegmentOccupied = function resetSegmentOccupied(id) {
		if (typeof id === 'number') {	id = [{id: id}]; }

		for (var i = 0; i < id.length; i++) {
			this.segments[id[i].id].occupied = false;
		}
	}


	Track.prototype.setTrackStation = function setStation() {}


	/**
	 * Set the forward stop marker for trains arriving on this platform/track.
	 *
	 * @param {int} id
	 *   Track number.
	 * @param {int} train_num
	 *   Number of cars, like 10, 8, 6, 4.
	 * @param {int} x
	 *   The track position where this marker lives.
	 */
	Track.prototype.setTrackStopMarker = function(id, train_num, x) {

		if (typeof train_num !== 'object' && typeof train_num === 'number') {
			train_num = [train_num];
		}

		for (var i = 0; i < train_num.length; i++) {
			if (typeof this.segments[id].stopmarker === 'undefined') { this.segments[id].stopmarker = []; }
			this.segments[id].stopmarker.push({
				cars: train_num[i],
				x: x
			});
		}
	}


	/**
	 * Given a position, find the next stopping point for a train.
	 *
	 * Check for red signals, stop markers, or end of line.
	 *
	 * @param {int} train_id
	 *   The ID of the train requesting this, so we know if an occupied track is
	 *   us or someone else.
	 * @param  {int} num_cars
	 *   Number of cars in a train. Used to determine relevant stop markers.
	 * @param  {int} x
	 *   Current position on the track.
	 *
	 * @return {int}
	 *   The location of the next stopping point.
	 */
	Track.prototype.getTrainDestination = function getTrainDestination(train_id, num_cars, x, get_next) {

		if (get_next === true) { console.log('get Next');}

		// If we're inside the track bounds, check segments.
		if (this.inTrackBounds(x)) {

			// Get train front location.
			var my_segments = this.getSegmentsByBounds(x, x+1);
			if (typeof my_segments !== 'object' || my_segments === null || my_segments.length <= 0) {
				throw new Error('Train Destination cannot calculate due to missing segments.');
			}

			// Otherwise, check for track stop marker.
			for (var i = my_segments[0].id; i >= 0; i--) {
				if (typeof this.segments[i] === 'undefined'
					|| typeof this.segments[i].stopmarker === 'undefined') {
					continue;
				}

				// Check for a stop marker matching our car number.
				for (var n = 0; n < this.segments[i].stopmarker.length; n++) {
					if (this.segments[i].stopmarker[n].cars == num_cars) {
						var my_distance = this.getDistanceToSegment(i) + this.segments[i].stopmarker[n].x;

						// Return any markers we have not already passed.
						if (get_next === true) {
							if ((['n', 'e'].indexOf(this.direction) >= 0 && my_distance <= x)
								|| (['s', 'w'].indexOf(this.direction) >= 0 && my_distance >= x)) {
								return {
									x: my_distance,
									type: 'stop_marker'
								}
							}
						}
						else {
							return {
									x: my_distance,
									type: 'stop_marker'
								}
						}
					}
				}
			}
		}

		// Otherwise check for end of track.
		return {
			x: (['n','e'].indexOf(this.direction) >= 0) ? 0 : this.getLength(),
			type: 'eol'
		}
	}


	Track.prototype.getSignalDestination = function getSignalDestination(train_id, num_cars, x) {
		if (this.inTrackBounds(x)) {

			// Get train front location.
			var my_segments = this.getSegmentsByBounds(x, x+1);
			if (typeof my_segments !== 'object' || my_segments === null || my_segments.length <= 0) {
				throw new Error('Train Destination cannot calculate due to missing segments.');
			}

			// Check signal. If red, stop in this segment,
			// as next segment will be occupied.
			if (this.getSignalStatus(train_id, my_segments[0].id) === -1) {

				// Distance to start for n/e, otherwise distance to end of segment.
				return {
					x: this.getDistanceToSegment(my_segments[0].id) + (['n','e'].indexOf(this.direction) >= 0) 
						? my_segments[0].distance : 0,
					type: 'signal',
					segment: my_segments[0].id,
				}
			}
		}
		else {
			console.warn('Not in track.', x);
		}

		return false;
	}


	/**
	 * Check if a position was within the track.
	 * 
	 * @param  {int} x
	 *   A point on the track.
	 * 
	 * @return {boolean}
	 *   True if within bound. Otherwose, FALSE.
	 */
	Track.prototype.inTrackBounds = function inTrackBounds(x) {
		if (x >= 0 && x <= this.getLength()) {
			return true;
		}
		return false;
	}


	/**
	 * Get the speed limit for the current position, based upon signal.
	 *
	 * @param  {int} sid
	 *   (optional) The segment ID.
	 * @param  {int} x
	 *   (required unless sid is not passed) Current forward position,
	 *   which we use to determine where the train is.
	 * @param  {int} train_id
	 *   The ID of this train, which we use to determine if a red signal
	 *   is a result of our train or someone else.
	 *
	 * @return {int}
	 *   A number representing the max speed allowed in our current segment.
	 */
	Track.prototype.getSpeedLimit = function speedLimit(sid, x, train_id) {

		if (sid || this.inTrackBounds(x)) {
			if (typeof sid !== 'number' || sid < 0) {
				var my_seg = this.getSegmentsByBounds(x, x+1);
				if (typeof my_seg[0] !== 'undefined') { sid = my_seg[0].id; }
			}

			if (typeof this.segments[sid] !== 'undefined') {
				// Get the signal here.
				var my_status = this.getSignalStatus(train_id, sid);

				if (my_status < 0) {
					return 0;
				}
				else if (my_status === 0) {
					return 10;
				}
				else {
					return this.segments[sid].speed;
				}
			}
			else {
				console.warn('Cannot find segment for ', train_id, 'at position: ', x);
			}
		}

		return 0;
	}


	/**
	 * Get the signal of our current segment.
	 *
	 * @param  {int} train_id
	 *   The ID of the train requesting the signal. This will help ignore
	 *   reporting red when we're the occupying train.
	 * @param  {int} sid
	 *   The ID of the segment being checked.
	 *
	 * @return {int}
	 *   -1 for red, 0 for caution, 1 for clear.
	 */
	Track.prototype.getSignalStatus = function getSignalStatus(train_id, sid) {
		var next_sid = sid+1,
				two_sid = sid+2;

		if (['n','e'].indexOf(this.direction) >= 0) {
			next_sid = sid - 1;
			two_sid = sid - 2;
		}
		if (typeof this.segments[sid] === 'undefined') { return -1; }
		else if (typeof this.segments[next_sid] === 'undefined') { return 0; }
		else if (typeof this.segments[two_sid] === 'undefined') { return 0; }

		// If we're in an occupied segment, or the next segment is occupied,
		// then red signal.
		if (this.segmentOccupied(sid, train_id) === true
			|| this.segmentOccupied(next_sid, train_id) === true) {
			return -1;
		}
		// If the two segments away is occupied, then yellow signal.
		else if (this.segmentOccupied(two_sid, train_id) === true) {
			return 0;
		}

		// If the two segments in front are clear,
		// then full steam ahead. (green signal)
		return 1;
	}


	/**
	 * Is a particular segment occupied?
	 *
	 * @param  {int} sid
	 *   The ID of the segment we should check.
	 * @param {int} train_id
	 *   The ID of the train requesting this check. If occupied,
	 *   but with this train_id, we'll count it as unoccupied.
	 *
	 * @return {boolean}
	 *   True if occupied by *another* train. Otherwise, false.
	 */
	Track.prototype.segmentOccupied = function segmentOccupied(sid, train_id) {
		if (typeof this.segments[sid] === 'undefined') {
			console.warn('Attempting to check if an undefined segment is occupied.');
		}
		else if (this.segments[sid].occupied !== false) {
			if (this.segments[sid].occupied !== train_id) {
				return true;
			}
		}

		return false;
	}


	/**
	 * Plural of segmentOccupied.
	 */
	Track.prototype.segmentsOccupied = function segmentsOccupied(sids, train_id) {
		for (var i = 0; i < sids.length; i++) {
			if (this.segmentOccupied(sids[i].id, train_id) === true) {
				return true;
			}
		}
		return false;
	}


	/**
	 * Get the entire length of the track segments.
	 *
	 * @return {int}
	 *   The length.
	 */
	Track.prototype.getLength = function length() {
		var len = 0;
		for (var i = 0; i < this.segments.length; i++) {
			len += this.segments[i].length;
		}

		return len;
	}

	Track.prototype.getHeight = function height() {
		return this.height;
	}

	Track.prototype.getTrackSpeedLimit = function speedLimit() {}
	Track.prototype.getTrackSignal = function signal() {}
	Track.prototype.getTrackOccupied = function occupied() {}
	Track.prototype.getStopMarker = function stopMarker(id) {
		if (typeof this.segments[id] !== 'undefined'
			&& typeof this.segments[id].stopmarker !== 'undefined') {
			return this.segments[id].stopmarker;
		}
		return false;
	}
	Track.prototype.getSignals = function getSignals(id) {
		if (typeof this.segments[id].signals !== 'undefined') {
			return this.segments[id].signals;
		}
	}
	Track.prototype.getTrackDirection = function direction() {	return this.direction; }

	Track.prototype.state = function state() {

		if (typeof this.state_counter === 'undefined') { this.state_counter = 0; }

		// Update trains.
		for (var i = 0; i < this.trains.length; i++) {
			if (typeof this.trains[i] !== 'undefined') {
				this.trains[i].state(this);
			}
		}

		if (this.state_counter == 10) {

//			console.log('Updating platforms and signal Visuals.');

			// Update signals.
			this.refreshSignals();
			this.refreshSignalUi();

			// Update platforms.


			// Reset count to zero.
			this.state_counter = 0;
		}
		else {
			this.state_counter++;
		}

		/**

		   @TODO

		    SLOW DOWN TIME SO WE CAN SEE WHAT'S HAPPENING.

		 */
		// Wait 1000 miliseconds before continueing.
//		var dt = new Date();
//		while ((new Date()) - dt <= 5000) { /* Do nothing */ }

		return true;
	}


	/**
	 * Update all signals in the system.
	 */
	Track.prototype.refreshSignals = function refreshSignals() {
		var occupied_segments = [];

		for (var i = 0; i < this.trains.length; i++) {
			if (typeof this.trains[i] !== 'undefined') {
				var position = this.trains[i].getPosition();

				// Get all segments this train would occupy.
				var my_segments = this.getSegmentsByBounds(position, position + this.trains[i].getLength());
				for (var j = 0; j < my_segments.length; j++) {
					occupied_segments.push(my_segments[j].id);
				}

				// Assign the train to these track segments.
				this.setSegmentOccupied(my_segments, i);
			}
		}

		// Reset all segment signals not in our updated occupied list.
		for (var j = 0; j < this.segments.length; j++) {
			if (occupied_segments.indexOf(j) < 0) {
				this.resetSegmentOccupied(j);
			}
		}
	}


	Track.prototype.refreshSignalUi = function refreshSignalUi() {
		for (var sid = 0; sid < this.segments.length; sid++) {
			// Fetch and render all signals.
			for (var j in this.segments[sid].signals) {
				this.renderSignal(sid, j);
			}
		}
	}


	/**
	 * Render the track.
	 *
	 * Only need to call once, unless the viewport is moving.
	 *
	 * @param  {int} x1, x2, y1, y2
	 *   Coordinates where the viewport is placed, relative to this
	 *   track's placement in the system. Use this to determine which segments
	 *   should be rendered, but not for coordinates within those segments.
	 *
	 * @return {PIXI Container}
	 *   The track container, to be added to the system's container.
	 */
	Track.prototype.render = function(x1,x2,y1,y2) {
		// Make sure we've initialized our renderer.
		if (typeof this.container === 'undefined') { this.initRenderer(); }

		console.log('Rendering tracks from: ', x1, x2);

		// Horizontal ruler.
		for (var a = x1; a < x2; a += 100) {
	    var message = new PIXI.Text(a, {fontFamily: "Helvetica", fontSize: 12, fill: "gray"});
	    message.position.set(a, this.height - message.height);
			this.container.addChild(message);
		}

		// Vertical rules.
		for (var b = 0; b < this.height; b += 20) {
	    var message = new PIXI.Text((y1+b) + ', ' + b, {fontFamily: "Helvetica", fontSize: 12, fill: "gray"});
	    message.position.set(0, b-message.height);
			this.container.addChild(message);
		}

		// Detemrine which segments fall within our view port.
		var my_segments = this.getSegmentsByBounds(x1,x2);

		// Render each segment, accounting for offsets.
		for (var i = 0; i < my_segments.length; i++) {
			console.log('adjusting coords to local: ', x1, my_segments[i].distance, 'y:', y1);
			var offset_x = my_segments[i].distance;
			this.renderSegment(my_segments[i].id,offset_x,0);
		}

		return this.container;
	}

	/**
	 * Render a single segment of the track.
	 *
	 * @param  {int} id
	 *   The segment ID.
	 * @param  {int} offset_x, offset_y
	 *   Coordinate offsets.
	 * @return {[type]}          [description]
	 */
	Track.prototype.renderSegment = function renderSegment(id, offset_x, offset_y) {

    // Marker for start of track segment.
    var message = new PIXI.Text(id, {fontFamily: "Helevetica", fontSize: 32, fill: "gray"});
    message.position.set(offset_x, offset_y);
    this.container.addChild(message);

		// Fetch and render all stop markers.
		var markers = this.getStopMarker(id);
		for (var i = 0; i < markers.length; i++) {
			var marker = this.renderer.stopMarker(markers[i].cars, markers[i].x + offset_x, offset_y);
			this.container.addChild(marker);
		}


		var signals = this.getSignals(id);

		// Fetch and render all signals.
		for (var i in signals) {
			this.renderSignal(id, i, offset_x, offset_y);
		}

		// Fetch and render all tracks.
		/**

		   @TODO


		 */

	}


	Track.prototype.renderSignal = function renderSignal (sid, signal_id, offset_x, offset_y) {
		if (typeof this.segments[sid].signals[signal_id] === 'undefined') {
			return;
		}
		// Create new pixi item.
		else if (typeof this.segments[sid].signals[signal_id].item === 'undefined') {
			var x = this.segments[sid].signals[signal_id].position + offset_x;
			var signal = this.renderer.signal(1, x, offset_y);
			this.segments[sid].signals[signal_id].item = signal;
			this.container.addChild(signal);
		}
		// Just update the texture.
		else {
			// Get signal status.
			var status = this.getSignalStatus(null, sid);

			// Update sprite.
			this.segments[sid].signals[signal_id].item.texture = this.renderer.signalTexture(status);
		}
	}


	/**
	 * Get the distance from the start of the track to
	 * the start of a requested segment.
	 *
	 * @param  {int} id
	 *   The ID of a segment who's distance we are looking for.
	 *
	 * @return {int | boolean}
	 *   The distance, if found. Otherwise, FALSE.
	 */
	Track.prototype.getDistanceToSegment = function distanceToSegment(id) {
		var length = 0,
				results = [],
				distance = 0;
		for (var i = 0; i < this.segments.length; i++) {
			if (i === id ) {	return distance; }
			distance += this.segments[i].length;
		}

		return false;
	}


	Track.prototype.getSegmentsByBounds = function segmentByBounds(x1,x2) {
		var length = 0,
				results = [];

		for (var i = 0; i < this.segments.length; i++) {
			if (rutils.intersection(length, (length+this.segments[i].length), x1, x2)) {
				results.push({
					id: this.segments[i].id,
					distance: length
				});
			}
			else if (length > x2) { break; }

			length += this.segments[i].length;
		}

		return results;
	}

	return {
		Track: Track
	};
})();