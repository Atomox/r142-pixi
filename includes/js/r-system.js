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
				x2: Track.getLength(),
				y2: Track.getHeight()
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
				x2: Station.getLength(),
				y2: Station.getHeight()
			}
		};
	}


	System.prototype.addTrain = function addTrain(track, position, Train) {
		console.log('Adding train to track:', track, 'at position: ', position, this.tracks[track].track, Train);
		if (typeof this.tracks[track].track === 'undefined') {
			throw new Error('Track ' + track + ' must be initialized before adding a train.');
		}
		this.tracks[track].track.setTrackTrain(position, Train);
	}


	System.prototype.state = function state() {

/**
		// East-bound:
		if (station.trackStatus(0) == true && typeof trains_east[east_bound] !== 'undefined') {
			console.log('Scheduling train');

		  // Schedule a train.
		  station.scheduleTrain(0, trains_east[east_bound]);
			east_bound++;
		}
		else if (station.trackStatus(0) == true) {
			console.log('Track 0 is free');
		}

		// West-bound:
		if (station.trackStatus(1) == true && typeof trains_west[west_bound] !== 'undefined') {
			console.log('Scheduling train');

		  // Schedule a train.
		  station.scheduleTrain(1, trains_west[west_bound]);
			west_bound++;
		}
		else if (station.trackStatus(1) == true) {
			console.log('Track 1 is free');
		}


		if (typeof trains_east[east_bound-1] !== 'undefined') {
			trains_east[east_bound-1].update();
		}
		if (typeof trains_west[west_bound-1] !== 'undefined') {
			trains_west[west_bound-1].update();
		}
*/

	  return true;
	}

	System.prototype.assembleFrame = function render(x1,y1, width, height) {

		if (width <= 0 || height <= 0) {
			throw new Error('viewport width/height must be positive integers.');
		}

		var x2 = x1 + width,
				y2 = y1 + height;

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

		console.log('Found', my_tracks.length, 'tracks to render.');

		// Assemble all tracks, and gather the containers for each track.
		// Each container will include all track segments
		// that fall within our viewport.
		for (var i = 0; i < my_tracks.length; i++) {
			var my_track = this.tracks[my_tracks[i]];

			// Render the container with normal coordinates, offset by the difference
			// between track starting x,y and 
			// 

			// Offset coordinates for the track's starting position.
			var my_track_container = my_track.track.render(
				x1-my_track.position.x1,
				x2-my_track.position.x1,
				y1-my_track.position.y1,
				y2-my_track.position.y1
			);

			console.log('Moving Track container to coords:',x1 + my_track.position.x1,x1 + my_track.position.x1);

			my_track_container.x = x1 + my_track.position.x1;
			my_track_container.y = y1 + my_track.position.y1;

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