var system = null,
	trains_east = [],
	trains_west = [],
	stations = [],
	tracks = [],
  screen = {
  	width: 16092,
  	height: 384
  };


document.addEventListener("DOMContentLoaded",function() {

	// Create a train system, and init Pixi.
	system = new rsystem.System(screen.width, screen.height);

	loadTexture(null, "images/station_basic.json")
	.then(function(url) {
		return Promise.all([url, loadTexture(null, "images/train_basic.json")]);
	})
	.then(function allThen(urls) {
		// Create some tracks.
		initTracks();

		// Add track 0 to the system.
		system.addTrack(0, 50, 64, tracks[0]);

		// Assemble the system.
		system.assembleFrame(0,0, screen.width, screen.height);

		// Init train 0.
		trains_east[0] = new rtrain.Train(0, 'R142-left.png', 'R142-right.png', 10);
		trains_east[1] = new rtrain.Train(1, 'R142-left.png', 'R142-right.png', 8);

		// Add train to 0, at position 0.
		system.addTrain(0, 20000, trains_east[0]);

		// Add train to track 0, at position 5000.
		system.addTrain(0, 35000,trains_east[1]);

		/**
		

		   @TODO
		

		 */
		system.stage.scale.x = .25;
		system.stage.scale.y = .25;

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
		{id: 0, speed: 5, length: 5000},
		{id: 1, speed: 5, length: 500},
		{id: 2, speed: 25, length: 3000},
		{id: 3, speed: 25, length: 1000},
		{id: 4, speed: 10, length: 4000,
			station: {id: 0, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 256]
			]},
		{id: 5, speed: 25, length: 1000},
		{id: 6, speed: 25, length: 5000},
		{id: 7, speed: 25, length: 1000},
		{id: 8, speed: 10, length: 4000,
			station: {id: 1, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 256]
			]},
		{id: 9, speed: 25, length: 1000},
		{id: 10, speed: 25, length: 3000},
		{id: 11, speed: 25, length: 5000},
		{id: 12, speed: 25, length: 5000},
		{id: 13, speed: 25, length: 1000},
		{id: 14, speed: 25, length: 5000},
		{id: 15, speed: 25, length: 1000},
		{id: 16, speed: 10, length: 4000,
			station: {id: 1, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 1560]
			]},
		{id: 17, speed: 25, length: 1000},
		{id: 18, speed: 10, length: 4000},
		{id: 19, speed: 5, length: 500},
		{id: 20, speed: 5, length: 500},
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