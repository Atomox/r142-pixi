'use strict';

var rtrack = (function() {

	/**
	 * Init new tracks.
	 *
	 * @param {int} id
	 *   Track number. Must be unique.
	 * @param {string} direction
	 *   Direction of tracks.
	 * @param {int} x
	 *   Position of beginning of track at segment 0.
	 * @param {int} y
	 *   Position of beginning of track at segment 0.
	 */
	function Track(id, direction, x, y) {
		this.direction = direction.toLowerCase();
		if (['n', 's', 'e', 'w'].indexOf(direction) === -1) {
			console.warn('Invalid track direction:', direction);
			this.direction = null;
		}

		this.id = id;
		this.segments = [];
		this.position.x = x;
		this.position.y = y;
	}


	Track.prototype.initRenderer = function() {
		this.container = new PIXI.Container();
		this.renderer = rtrackpixi;
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

		this.segments[id].length = settings.length;
		this.segments[id].direction = settings.direction;
		this.segments[id].speed = (typeof settings.speed === 'number') ? settings.speed : 20;
	}

	Track.prototype.setTrackTrain = function setTrain(segment, position, ) {}
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
			this.tracks[id].stopmarker.push({
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
	Track.prototype.length = function length() {
		var len = 0;
		for (var i = 0; i < this.segments.length; i++) {
			len += this.segments[i].length;
		}

		return len;
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

		// Detemrine which segments fall within our view port.
		var my_segments = this.getSegmentsByBounds(x1,x2,y1,y2);

		// Render each segment, accounting for offsets.
		for (var i = 0; i < my_segments.length; i++) {
			this.renderSegment(my_segments[i].id,x1-my_segments[i].distance,y1);
		}

		return this.container;
	}

	Track.prototype.renderSegment = function renderSegment(id, offset_x, offset_y) {

    // Marker for start of track segment.
    var message = new PIXI.Text(id, {fontFamily: "Helevetica", fontSize: 64, fill: "gray"});
    message.position.set(offset_x, offset_y);
    this.container.addChild(message);

		// Fetch and render all stop markers.
		var markers = this.getStopMarker(id);
		for (var i = 0; i < markers.length; i++) {
			this.container.addChild(this.renderer.stopMarker(markers[i].cars, markers[i].x + offset_x, offset_y));
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

	Track.prototype.getSegmentsByBounds = function segmentByBounds(x1,x2,y1,y2) {
		var length = 0,
				results = [];

		for (var i = 0; i < this.segments.length; i++) {
			if (length >= x1 && length <= x2) {
				results.push({
					id: this.segments[i].id,
					distance: length
				});
				length += this.segments[i].length;
			}
			else if (length > x2) { break; }
		}

		return results;
	}

	return {
		Track: Track
	};
})();