'use strict';

var rsystem = (function() {
	function System(width, height, debug) {
		this.tracks = [];
		this.stations = [];
		this.trains = [];
		this.debug = false;
		this.width = width;
		this.height = height;

		if (typeof debug !== 'undefined' && debug === true) {
			this.debug = true;
		}
	}


	/**
	 * Initialize visual renderer.
	 */
	System.prototype.initRenderer = function initRenderer() {
		// Init our Pixi renderer, and viewport.
		this.initPixiRenderer(this.width, this.height);

		// Create a container object called the `stage`, and a renderer.
		this.stage = new PIXI.Container();
	}


	/**
	 * Initialize the PIXI renderer suite.
	 */
	function initPixi() {
		var type = "WebGL";
	  if (!PIXI.utils.isWebGLSupported()){ type = "canvas" }
	  PIXI.utils.sayHello(type);
	}


	/**
	 * Initialize the PIXI graphics engine, and setup the system window/screen.
	 */
	System.prototype.initPixiRenderer = function initPixiRenderer(width, height) {
	  initPixi();

	  this.renderer = PIXI.autoDetectRenderer(width, height,
	    {antialias: false, transparent: false, resolution: 1}
	  );

	  // Style and resize.
	  this.renderer.view.style.border = "1px dashed #bbb";
	  this.renderer.backgroundColor = 0xFFFFFF;
	  this.renderer.autoResize = true;

	  // Add the canvas to the HTML document
	  document.body.appendChild(this.renderer.view);
	}


	/**
	 * Add a track object to the system.
	 * @param {string/int} id
	 *   ID of the system.
	 * @param {int} x
	 *   Origin (left) position within the system where this track start.
	 * @param {int} y
	 *   Origin (top) position within the system where this track starts.
	 * @param {object} Track
	 *   An already initialized track object.
	 */
	System.prototype.addTrack = function addTrack(id, x,y, Track) {
		this.tracks[id] = {
			id: id,
			track: Track,
			position: {
				x1: x,
				y1: y,
				x2: Track.getLength(),
				y2: Track.getHeight()
			}
		};
	}


	/**

	 			@todo

	 */
	System.prototype.addStation = function addStation(id, x,y, Station){
		this.station[id] = {
			id: id,
			station: Station,
			position: {
				x1: x,
				y1: y,
				x2: Station.getLength(),
				y2: Station.getHeight()
			}
		};
	}


	System.prototype.addTrain = function addTrain(track, position, Train) {
		console.log('Adding train to track:', track, 'at position: ', position);
		if (typeof this.tracks[track].track === 'undefined') {
			throw new Error('Track ' + track + ' must be initialized before adding a train.');
		}
		this.tracks[track].track.setTrackTrain(position, Train);
	}


	/**
	 * Update the state for the current iteration.
	 *
	 * This is the "game loop" called once per cycle.
	 *
	 * this updates all asset objects attached to them, as well.
	 */
	System.prototype.state = function state() {

		// Update each track attached to our system.
		for (var i = 0; i < this.tracks.length; i++) {
			if (typeof this.tracks[i].track !== 'undefined') {
				this.tracks[i].track.state(this.debug);
			}
		}

	  return true;
	}


	/**
	 * Assemble the "stage", rendering each asset in the system. This is to
	 * initialize things which won't change unless the stage/screen moves.
	 *
	 * @param  {int} x1
	 *   The left-most position of the screen, relative to the left-most position
	 *   of the system. This is the offset from the left of the system to the
	 *   start of the screen.
	 * @param  {int} y1
	 *   The top-most position of the screen, relative to the top-most position of the system.
	 * @param  {[type]} width  [description]
	 * @param  {[type]} height [description]
	 * @return {[type]}        [description]
	 */
	System.prototype.assembleFrame = function render(x1,y1, width, height) {

		if (width <= 0 || height <= 0) {
			throw new Error('viewport width/height must be positive integers.');
		}

		console.log('Setting the stage.....');
		console.log('  - Original x/y:', system.stage.x, '/', system.stage.y);


		// Move the stage to our passed origin.
		system.stage.x -= x1;
		system.stage.y -= y1;

		console.log('  - Updated x/y:', system.stage.x, '/', system.stage.y);

		var x2 = x1 + width,
				y2 = y1 + height;

		console.log('  - Rendering Tracks x/y:', x1, '/', y1, ' -> ', x2, '/', y2);

		// Check for tracks at this position.
		// If tracks, get start location for this track, then offset to start of track in viewport.
		this.renderTracks(x1, x2, y1, y2);

		// Check for stations at this position.
		// If station, get start location for station, then offset to start of station in viewport.
		/**

		   @TODO

		 */
	};

	System.prototype.renderFrame = function renderFrame() {
		// Render frame in Pixi.
		this.renderer.render(this.stage);
	}


	/**
	 * Render all tracks within our viewport.
	 *
	 * @param  {int} x1,x2,y1,y2
	 *   The viewport coordinates.
	 */
	System.prototype.renderTracks = function(x1, x2, y1, y2) {

		// Find all tracks that overlap our viewport.
		var my_tracks = this.findTracks(x1, x2, y1, y2);

		console.log('  - Found', my_tracks.length, 'tracks to render, from: ', x1,'/',y1,'->',x2,'/',y2);

		// Assemble all tracks, and gather the containers for each track.
		// Each container will include all track segments
		// that fall within our viewport.
		for (var i = 0; i < my_tracks.length; i++) {
			var my_track = this.tracks[my_tracks[i]];

			// Render the container with normal coordinates, offset by the difference
			// between track starting x,y and our system origin.
			console.log('  - Render Track: ', my_track.id, '...')
			console.log('  		- Position: ', my_track.position.x1,'/',my_track.position.y1);


			// Offset coordinates for the track's starting position.
			var my_track_container = my_track.track.render(
				x1-my_track.position.x1,
				x2-my_track.position.x1,
				y1-my_track.position.y1,
				y2-my_track.position.y1
			);

			my_track_container.x = my_track.position.x1;
			my_track_container.y = my_track.position.y1;

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

		for (var i = 0; i < this.tracks.length; i++) {
			if (rutils.boxIntersection(
				this.tracks[i].position.x1,
				this.tracks[i].position.x2,
				this.tracks[i].position.y1,
				this.tracks[i].position.y2,
				x1,x2,y1,y2) === true) {

				// Include this track.
				results.push(this.tracks[i].id);
			}
		}

		return results;
	}


	return {
		System: System
	};

})();


// If we're running under Node...
// (We do for running mocha tests, only)
if(typeof exports !== 'undefined') {
    module.exports = rsystem;
}