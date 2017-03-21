var system = null,
	trains_east = [],
	trains_west = [],
	stations = [],
	tracks = [],
	state = play,
  screen = {
  	width: 8092,
  	height: 384
  };


document.addEventListener("DOMContentLoaded",function() {

	// Create a train system, and init Pixi.
	system = new rsystem(screen.width, screen.height);

	var station_img = loadTexture(null, "images/station_basic.json"),
			train_img = loadTexture(null, "images/train_basic.json");

	Promise.all([station_img,train_img]).then(function(){
		// Create some tracks.
		initTracks();

		// Add track 0 to the system.
		system.addTrack(0, 5, 64, tracks[0]);

		// Render the system.
		system.render(0,0, 8092,512);

		/**
		// Bind tracks to system.


		// Init train 0.
		trains_east[0] = new rtrain.Train(4);
		trains_east[1] = new rtrain.Train(4);

		// Add train to segment 4 of track 0.
		track[0].setTrackTrain(4,0,trains_east[0]);

		// Add train to segment 6 of track 0.
		track[0].setTrackTrain(8,0,trains_east[1]);
		*/

		/**

		   @TODO
		     How do we rendered  portion of the system?

		     How do we tie tracks to coordinates on the screen?
		 */
	});
}


function initTracks() {
	// Init track 0.
	track[0] = new rtrack.Track(0, 'e', 0, 128);
	track[0].addSections([
		{id: 0, speed: 25, length: 3000},
		{id: 1, speed: 25, length: 1000},
		{id: 2, speed: 10, length: 4000,
			station: {id: 0, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 256]
			]},
		{id: 3, speed: 25, length: 1000},
		{id: 4, speed: 25, length: 3000},
		{id: 5, speed: 25, length: 1000},
		{id: 6, speed: 10, length: 4000,
			station: {id: 1, track: 0},
			stop: [
				[[10,8],1560],
				[[6,4], 256]
			]},
		{id: 7, speed: 25, length: 1000},
		{id: 8, speed: 25, length: 3000},
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

function gameLoop() {
  requestAnimationFrame(gameLoop);

  if (!state()) {
    return false;
  }

  renderer.render(stage);
}