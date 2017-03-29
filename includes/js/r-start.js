var system = null,
	trains_east = [],
	trains_west = [],
	stations = [],
	tracks = [],
  screen = {
  	width: 8092,
  	height: 384
  };


document.addEventListener("DOMContentLoaded",function() {

	// Create a train system, and init Pixi.
	system = new rsystem.System(screen.width, screen.height);

	loadTexture(null, "images/station_basic.json")
	.then(function(url) {
		return Promise.all([url, loadTexture(null, "images/train_basic.json")]);
	})
	.then(function(urls) {
		return Promise.all([urls[0], urls[1], loadTexture(null, "images/track_basic.json")]);
	})
	.then(function allThen(urls) {
		var direction = ['e','w'];
		// Create some tracks.
		for (var i = 0; i < 2; i++) {
			var my_y = (i === 0) ? 64 : 256;

			initTracks(i, direction[(i%2)]);

			// Add track to the system.
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
		system.assembleFrame(tracks[0].getDistanceToSegment(13),0, screen.width, screen.height);

		// Init train 0.
		trains_east[0] = new rtrain.Train(0, 'R142-left.png', 'R142-right.png', 8);
		trains_east[1] = new rtrain.Train(1, 'R142-left.png', 'R142-right.png', 8);
		trains_east[2] = new rtrain.Train(2, 'R142-left.png', 'R142-right.png', 8);

		// Add trains to track 0, at various positions.
		system.addTrain(0, 35000,trains_east[0]);
		system.addTrain(0, 50000,trains_east[1]);
		system.addTrain(0, 65000,trains_east[2]);


		trains_west[0] = new rtrain.Train(0, 'R142-left.png', 'R142-right.png', 8);
		trains_west[1] = new rtrain.Train(1, 'R142-left.png', 'R142-right.png', 8);
		trains_west[2] = new rtrain.Train(2, 'R142-left.png', 'R142-right.png', 8);

		// Add trains to track 0, at various positions.
		system.addTrain(1, 35000,trains_west[0]);
		system.addTrain(1, 50000,trains_west[1]);
		system.addTrain(1, 65000,trains_west[2]);



		// Scale, when necessary.
		// Mostly used for zooming out when debugging.
		system.stage.scale.x = 1;
		system.stage.scale.y = 1;

		gameLoop();
	});
});


function gameLoop() {
  requestAnimationFrame(gameLoop);

  if (!system.state()) {
    return false;
  }

  system.renderFrame();
}


function initTracks(id, direction) {
	var min_length = 6000,
		min_station_length = 8000,
		min_station_third = Math.floor(min_station_length/3);
	// Init track 0.
	tracks[id] = new rtrack.Track(id, direction, 108);
	tracks[id].setTrackSegments([
		{speed: 5, length: min_length},
		{speed: 5, length: min_length},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
		},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[10,8],64]]
		},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[6,4], 64]]
		},
		{speed: 5, length: min_length},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
		},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[10,8],64]]
		},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[6,4], 64]]
		},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
		},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[10,8],64]]
		},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [[[6,4], 64]]
		},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 10, length: min_station_length,
			station: {id: 1, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 1560]
			]},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 10, length: min_length},
		{speed: 5, length: min_length},
		{speed: 5, length: min_length},
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