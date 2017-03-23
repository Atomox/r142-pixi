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
				this.setTrackSegment(settings[i]);
			}
		}
	}


	Track.prototype.setTrackSegment = function setSegment(settings) {

		if (typeof settings !== 'object' || settings === null) {
			throw new Error('setTrackSegment expects settings object, but', typeof settings, 'found.');
		}
		else if (typeof settings.id === 'undefined' || typeof settings.id !== 'number') {
			throw new Error('setTrackSegment expects an ID, but none given.');
		}
		else if (typeof settings.length === 'undefined' || typeof settings.length !== 'number' || settings.length <= 0) {
			throw new Error('setTrackSegment expects a positive length.');
		}

		var id = settings.id;

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
	}


	/**
	 * Assign a train to a position.
	 *
	 * @param {[type]} segment_id [description]
	 * @param {[type]} position   [description]
	 */
	Track.prototype.setTrackTrain = function setTrain(position, train) {

		// Render the train container, and add it.
		var my_train_container = train.render(position);
		this.container.addChild(my_train_container);

		// Add the train to this track.
		this.trains.push(train);

		// Get all segments this train would occupy.
		var my_segments = this.getSegmentsByBounds(position, train.length);

		// Check each segment, and make sure the entire space is unoccupied.
		if (this.segmentOccupied(my_segments) === true) {
			return false;
		}

		// Assign the train to these track segments.
		this.setSegmentOccupied(my_segments, this.trains.length-1);

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


	Track.prototype.setSegmentOccupied = function setSegmentOccupied(id, train_id) {
		if (typeof id === 'number') {
			id = [id];
		}

		/**
		  


		  @TODO



		 */
		for (var i =0; i < id.length; i++) {
			// Set segment .occupied = id[i];
		}
	}

	Track.prototype.resetSegmentOccupied = function resetSegmentOccupiedt(id) {
		if (typeof id === 'number') {
			id = [id];
		}

		/**
		  


		  @TODO



		 */
		for (var i =0; i < id.length; i++) {
			// Set segment .occupied = false;
		}
	}


	/**
	 * Is a particular segment occupied?
	 *
	 * @param  {[type]} segments [description]
	 * @return {[type]}          [description]
	 */
	Track.prototype.segmentOccupied = function segmentOccupied(segments) {
		for (var i = 0; i < segments.length; i++) {
			console.log('Segments to check:', segments);
			if (segments[i].occupied !== false) {
				return true;
			}
		}

		return false;
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
	Track.prototype.getTrackDirection = function direction() {}
	Track.prototype.getTrackStation = function station() {}


	Track.prototype.render = function(x1,x2,y1,y2) {
		// Make sure we've initialized our renderer.
		if (typeof this.container === 'undefined') { this.initRenderer(); }

		console.log('Rendering tracks from: ', x1, x2);

		for (var a = x1; a < x2; a += 100) {
			// Ruler.
	    var message = new PIXI.Text(a, {fontFamily: "Helvetica", fontSize: 12, fill: "gray"});
	    message.position.set(a, this.height - message.height);
			this.container.addChild(message);
		}
		for (var b = 0; b < this.height; b += 20) {
			// Ruler.
	    var message = new PIXI.Text((y1+b) + ', ' + b, {fontFamily: "Helvetica", fontSize: 12, fill: "gray"});
	    message.position.set(0, b-message.height);
			this.container.addChild(message);
		}

		// Detemrine which segments fall within our view port.
		var my_segments = this.getSegmentsByBounds(x1,x2);

		console.log('Segments within bounds of', x1,x2,y1,y2, ': ', my_segments);

		// Render each segment, accounting for offsets.
		for (var i = 0; i < my_segments.length; i++) {
			console.log('adjusting coords to local: ', x1, my_segments[i].distance, 'y:', y1);
			var offset_x = my_segments[i].distance;
			this.renderSegment(my_segments[i].id,offset_x,0);
		}

		/**
		   @TODO

		     Set this.container to x1,x2
		 */

		return this.container;
	}

	Track.prototype.renderSegment = function renderSegment(id, offset_x, offset_y) {

		console.log('Renderinging track segment', id, ' with offsets:',offset_x,offset_y);

    // Marker for start of track segment.
    var message = new PIXI.Text(id, {fontFamily: "Helevetica", fontSize: 64, fill: "gray"});

    message.position.set(offset_x, offset_y);
    this.container.addChild(message);

		// Fetch and render all stop markers.
		var markers = this.getStopMarker(id);
		for (var i = 0; i < markers.length; i++) {
			var marker = this.renderer.stopMarker(markers[i].cars, markers[i].x + offset_x, offset_y);
			this.container.addChild(marker);
			console.log('Adding marker in segment', id, marker);
		}

		// Fetch and render all signals.
		/**


		   @TODO


		 */



		// Fetch and render all tracks.
		/**

		   @TODO


		 */

	}

	Track.prototype.getSegmentsByBounds = function segmentByBounds(x1,x2) {
		var length = 0,
				results = [];

		for (var i = 0; i < this.segments.length; i++) {
			if (rutils.intersection(length, (length+this.segments[i].length), x1, x2)) {
				console.log('Bounding segment: ', this.segments[i]);
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