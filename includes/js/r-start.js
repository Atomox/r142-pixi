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
		system.assembleFrame(4000,0, screen.width, screen.height);

		// Init train 0.
		trains_east[0] = new rtrain.Train(0, 'R142-left.png', 'R142-right.png', 4);
		trains_east[1] = new rtrain.Train(1, 'R142-left.png', 'R142-right.png', 4);
		trains_east[2] = new rtrain.Train(2, 'R142-left.png', 'R142-right.png', 4);

		// Add trains to track 0, at various positions.
		system.addTrain(0, 4800, trains_east[0]);
		system.addTrain(0, 10000,trains_east[1]);
		system.addTrain(0, 15000,trains_east[2]);

		/**
		

		   @TODO
		

		 */
		system.stage.scale.x = 1
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
	// Init track 0.
	tracks[0] = new rtrack.Track(0, 'e', 108);
	tracks[0].setTrackSegments([
		{speed: 5, length: 2000},
		{speed: 5, length: 2000},
		{speed: 10, length: 3000,
			station: {id: 0, track: 0},
			stop: [
				[[10,8],64],
				[[6,4], 1560]
			]},
		{speed: 5, length: 1000},
		{speed: 25, length: 2000},
		{speed: 25, length: 2000},
		{speed: 10, length: 3000,
			station: {id: 0, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 256]
			]},
		{speed: 25, length: 2000},
		{speed: 25, length: 2000},
		{speed: 25, length: 2000},
		{speed: 10, length: 3000,
			station: {id: 1, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 256]
			]},
		{speed: 25, length: 2000},
		{speed: 25, length: 2000},
		{speed: 25, length: 2000},
		{speed: 25, length: 2000},
		{speed: 25, length: 2000},
		{speed: 25, length: 2000},
		{speed: 25, length: 2000},
		{speed: 10, length: 3000,
			station: {id: 1, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 1560]
			]},
		{speed: 25, length: 1000},
		{speed: 10, length: 2000},
		{speed: 5, length: 500},
		{speed: 5, length: 500},
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