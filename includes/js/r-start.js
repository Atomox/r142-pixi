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
		return Promise.all([urls, loadTexture(null, "images/track_basic.json")]);
	})
	.then(function allThen(urls) {
		// Create some tracks.
		initTracks();

		// Add track 0 to the system.
		system.addTrack(0, 50, 64, tracks[0]);

		// Assemble the system.
		system.assembleFrame(37000,0, screen.width, screen.height);

		// Init train 0.
		trains_east[0] = new rtrain.Train(0, 'R142-left.png', 'R142-right.png', 6);
		trains_east[1] = new rtrain.Train(1, 'R142-left.png', 'R142-right.png', 6);
		trains_east[2] = new rtrain.Train(2, 'R142-left.png', 'R142-right.png', 6);

		// Add trains to track 0, at various positions.
		system.addTrain(0, 35000, trains_east[0]);
		system.addTrain(0, 50000,trains_east[1]);
		system.addTrain(0, 65000,trains_east[2]);


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


function initTracks() {
	var min_length = 6000,
		min_station_length = 8000;
	// Init track 0.
	tracks[0] = new rtrack.Track(0, 'e', 108);
	tracks[0].setTrackSegments([
		{speed: 5, length: min_length},
		{speed: 5, length: min_length},
		{speed: 10, length: min_station_length,
			station: {id: 0, track: 0},
			stop: [
				[[10,8],64],
				[[6,4], 1560]
			]},
		{speed: 5, length: min_length},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 10, length: min_station_length,
			station: {id: 0, track: 0},
			stop: [
				[[10,8],256],
				[[6,4], 1560]
			]},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 10, length: min_station_length,
			station: {id: 1, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 256]
			]},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
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