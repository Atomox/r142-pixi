'use strict';

var system = null,
	trains_east = [],
	trains_west = [],
	stations = [],
	tracks = [],
  animate = true,
  debug = true,
  num_tracks = 1,
  screen = {
  	width: 8092, // 8092,
  	height: 384,
  	scale: .25,
  	segment_left: 0,
  },
  speed = {
		slow: 5,
		medium: 10,
		high: 15
	};


document.addEventListener("DOMContentLoaded",function() {

	// Create a train system, and init Pixi.
	system = new rsystem.System(screen.width, screen.height, debug);

	loadTexture(null, "images/station_basic.json")
	.then(function(url) {
		return Promise.all([url, loadTexture(null, "images/train_basic.json")]);
	})
	.then(function(urls) {
		return Promise.all([urls[0], urls[1], loadTexture(null, "images/track_basic.json")]);
	})
	.then(function allThen(urls) {
		var direction = ['e', 'w'];

		// Create some tracks, and add them to the system.
		for (var i = 0; i < num_tracks; i++) {
			var my_y = (i === 0) ? 64 : 256;

			initTracks(i, direction[(i%2)], speed, debug);
			system.addTrack(i, 0, my_y, tracks[i]);
		}

		// Add up to four tracks.
		// Layers: Background, platform, track, pillars, track, platform, pillars, platform, track foreground

		// All platforms have 2 layers: stairs/back, platform/front


		// 2 track island:
		

		// 2 track stream
		

		// 4 track island
		

		// 4 track island/stream


		// Assemble the system.
		var screen_x = tracks[0].getDistanceToSegment(screen.segment_left),
				screen_y = 0;
		console.log('Render screen from x/y: (', screen_x, ' / ', screen_y, ') -> (', screen.width, ' / ', screen.height, ')');
		console.log('===============================================================');
		console.log('');
		system.assembleFrame(screen_x, screen_y, screen.width, screen.height);

		// Init train 0.
		trains_east[0] = new rtrain.Train(200, 'R142-left.png', 'R142-right.png', 4, debug);
		trains_east[1] = new rtrain.Train(201, 'R142-left.png', 'R142-right.png', 4, debug);
		trains_east[2] = new rtrain.Train(202, 'R142-left.png', 'R142-right.png', 4, debug);

		// Add trains to track 0, at various positions.
		system.addTrain(0, tracks[0].getDistanceToSegment(4),trains_east[0]);
		system.addTrain(0, tracks[0].getDistanceToSegment(10),trains_east[1]);
		system.addTrain(0, tracks[0].getDistanceToSegment(15),trains_east[2]);
/**
		trains_west[0] = new rtrain.Train(999, 'R142-left.png', 'R142-right.png', 4, debug);
		trains_west[1] = new rtrain.Train(800, 'R142-left.png', 'R142-right.png', 4, debug);
		trains_west[2] = new rtrain.Train(801, 'R142-left.png', 'R142-right.png', 4, debug);
		trains_west[3] = new rtrain.Train(802, 'R142-left.png', 'R142-right.png', 4, debug);

		// Add trains to track 0, at various positions.
		system.addTrain(1, tracks[1].getDistanceToSegment(0),trains_west[0]);
		system.addTrain(1, tracks[1].getDistanceToSegment(3),trains_west[1]);
		system.addTrain(1, tracks[1].getDistanceToSegment(5),trains_west[2]);
		system.addTrain(1, tracks[1].getDistanceToSegment(10),trains_west[3]);
*/
		// Scale, when necessary.
		// Mostly used for zooming out when debugging.
		system.stage.scale.x = screen.scale;
		system.stage.scale.y = screen.scale;

		gameLoop();
	});
});


function gameLoop() {

	if (animate) {
	  requestAnimationFrame(gameLoop);
	}
	else {
	  requestAnimationFrame(function(){});
	}

  if (!system.state()) {
    return false;
  }

  system.renderFrame();
}


/**
 * [initTracks description]
 * @param  {[type]} id        [description]
 * @param  {[type]} direction [description]
 * @param  {object} speed
 *   Speed limits by type: slow, medium, high
 * @param  {[type]} debug     [description]
 * @return {[type]}           [description]
 */
function initTracks(id, direction, speed, debug) {
	var min_length = 500,
		min_station_length = 2000,
		min_station_third = Math.floor(min_station_length/3);
	// Init track 0.
	tracks[id] = new rtrack.Track(id, direction, 108);
	tracks[id].setDebug(debug);
	tracks[id].setTrackSegments([
		{speed: speed.slow, length: min_length},
		{speed: speed.slow, length: min_length},
		{speed: speed.medium, length: min_station_third,
			station: {id: 0, track: 0},
		},
		{speed: speed.medium, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [
				[[10,8],6,4]
			]
		},
		{speed: speed.medium, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [
				[[6,4], 6,4]
			]
		},
		{speed: speed.slow, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.medium, length: min_station_third,
			station: {id: 0, track: 0},
		},
		{speed: speed.medium, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[10,8],6,4]]
		},
		{speed: speed.medium, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[6,4], 6,4]]
		},
		{speed: speed.high, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.medium, length: min_station_third,
			station: {id: 0, track: 0},
		},
		{speed: speed.medium, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[10,8],6,4]]
		},
		{speed: speed.medium, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[6,4], 6,4]]
		},
		{speed: speed.high, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.medium, length: min_station_length,
			station: {id: 1, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 1560]
			]},
		{speed: speed.high, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.high, length: min_length},
		{speed: speed.medium, length: min_length},
		{speed: speed.slow, length: min_length},
		{speed: speed.slow, length: min_length},
	]);
}


function loadTexture(name, url) {
  return new Promise(function(resolve, reject) {
    // Load an image.
    PIXI.loader.add(url).load(function(){ 
      console.log(url, 'loaded');
      resolve(url);
    });

    /**
       @TODO
         reject()?
     */
  });
}