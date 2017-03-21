'use strict';

var rsystem = (function() {
	function System(width, height) {
		this.tracks = [];
		this.stations = [];
		this.trains = [];

		// Create a container object called the `stage`, and a renderer.
		this.stage = new PIXI.Container();

		// Init our Pixi renderer, and viewport.
		this.initPixiRenderer(width, height);
	}

	function initPixi() {
		var type = "WebGL";
	  if (!PIXI.utils.isWebGLSupported()){ type = "canvas" }
	  PIXI.utils.sayHello(type);
	}

	System.prototype.initPixiRenderer = function initPixiRenderer(width, height) {
	  initPixi();

	  this.renderer = PIXI.autoDetectRenderer(width, height,
	    {antialias: false, transparent: false, resolution: 1}
	  );

	  // Style and resize.
	  this.renderer.view.style.border = "1px dashed black";
	  this.renderer.backgroundColor = 0xFFFFFF;
	  this.renderer.autoResize = true;
	//  this.renderer.resize(1392, 512);

	  // Add the canvas to the HTML document
	  document.body.appendChild(this.renderer.view);
	}

	System.prototype.addTrack = function addTrack(id, x,y, Track) {
		this.tracks[id] = {
			id: id,
			track: Track,
			position: {
				x1: x,
				y1: y,
				x2: Track.length,
				y2: Track.height
			}
		};
	}

	System.prototype.addStation = function addStation(id, x,y, Station){
		this.station[id] = {
			id: id,
			station: Station,
			position: {
				x1: x,
				y1: y,
				x2: Station.length,
				y2: Station.height
			}
		};
	}

	System.prototype.render = function render(x1,y1, width, height) {

		if (width <= 0 || height <= 0) {
			throw new Error('viewport width/height must be positive integers.');
		}

		x2 = x1 + width;
		y2 = y1 + height;

		// Check for tracks at this position.
		// If tracks, get start location for this track, then offset to start of track in viewport.
		this.renderTracks();

		// Check for stations at this position.
		// If station, get start location for station, then offset to start of station in viewport.
		/**

		   @TODO

		 */
	};


	/**
	 * Render all tracks within our viewport.
	 *
	 * @param  {int} x1,x2,y1,y2
	 *   The viewport coordinates.
	 */
	System.prototype.renderTracks = function(x1, x2, y1, y2) {

		// Find all tracks that overlap our viewport.
		var my_tracks = this.findTracks(x1, x2, y1, y2);

		// Assemble all tracks, and gather the containers for each track.
		// Each container will include all track segments
		// that fall within our viewport.
		for (var i = 0; i < my_tracks.length; i++) {
			var my_track = this.tracks[my_tracks[i]];

			// Offset coordinates for the track's starting position.
			var my_track_container = my_track.track.render(
				x1-my_track.position.x1,
				x2-my_track.position.x2,
				y1-my_track.position.y1,
				y2-my_track.position.y2
			);

			// Add the track container to the stage.
			this.stage.addChild(my_track_container);
		}
	}

	/**
	 * Find any tracks which intersect our bounding box.
	 * @param  {int} x1,x2,y1,y2
	 *
	 * @return {array(int)}
	 *   Array which the ID of each track in our bounding box.
	 */
	System.prototype.findTracks = function(x1,x2,y1,y2) {
		var results = [];

		for (var i =0; i < this.tracks.length; i++) {
			if (checkForIntersection(x1,x2,y1,y2, 
				this.tracks[i].position.x1,
				this.tracks[i].position.x2,
				this.tracks[i].position.y1,
				this.tracks[i].position.y2) === true) {

				// Include this track.
				results.push(this.tracks[i].id);
			}
		}

		return results;
	}

	/**
	 * Check two pairs of coordinates for any intersection. if at least 1 x/y pair
	 * falls within the box, return true;
	 *
	 * @param  {int} x1,x2,y1,y2
	 * @param  {int} a1,a2,b1,b2
	 *
	 * @return {boolean}
	 *   TRUE if at least one pair falls on or within the borders
	 *   of the bounding box.
	 */
	function checkForIntersection(x1, x2, y1, y2, a1, a2, b1, b2) {

		// x1 or x2 Greater than lowerbound, but not greater than upper bound.
		if (x1 >= a1 && x1 <= a2 || x2 >= a1 && x2 <= a2) {
			// y1 or y2 greater than lower bound, but not greater than upperbound.
			if (y1 >= b1 && y1 <= b2 || y2 >= b1 && y2 <= b2) {
				// We have at least overlap into our bounding box.
				return true;
			}
		}

		return false;
	}

})();