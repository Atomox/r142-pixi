'use strict';

var type = "WebGL",
  stage, renderer,
  state = play,
  screen = {
  	width: 8092,
  	height: 384
  };

var schedule = {
	normal: [
    {	velocity: [25,0]	},
    {	decel: [0, .1]		},
    {	unload: [10, .05]	},
    {	load: [10, .05]		},
    {	acel: [25, .05]		}
  ],
};

// Init Pixi.
initPixi();
initPixiRenderer(screen.width, screen.height);


var car = [],
	train_4_car = null,
	trains_east = [],
	trains_west = [],
	east_bound = 0,
	west_bound = 0,
	station = null;


document.addEventListener("DOMContentLoaded",function() {

	station = new rstation.Station('R142', 2);

	loadTexture(null, "images/station_basic.json")   //tile_floor.png")
	.then((url) => {
		station.initPlatform(url,0,screen.width, 156,256);

    station.setTrack(0,'w',20, 156, 1560);
    station.setTrackStopMarker(0, [10,8], 1560);
    station.setTrackStopMarker(0, [6,4], 256);
  //  station.setTrackArrivalZone(0, )
  //  station.setTrackDepartureZone(0, )
    station.setTrack(1,'e',25, 275, -1500);
    station.setTrackStopMarker(1, [10,8], 4096);
    station.setTrackStopMarker(1, [6], 3092);
    station.setTrackStopMarker(1, [4], 2048);

		station.open();
	})
	.then(() => {
		loadTexture(null, "images/train_basic.json")
		.then(function(url) {

		  for (var i = 0; i < 1; i++) {
		  	trains_east[i] = new r142.Train(url, 'R142-left.png', 'R142-right.png', 4);
		  	trains_east[i].setSchedule(schedule.normal);
		  }

		  for (var i = 0; i < 1; i++) {
		  	trains_west[i] = new r142.Train(url, 'r42-left.png', 'r42-right.png', 6);
		  	trains_west[i].setSchedule(schedule.normal);
		  }

		}).then(() => {

		    var message = new PIXI.Text("R142.", {fontFamily: "Helevetica", fontSize: 64, fill: "gray"});
		    message.position.set(256, 0);
		    stage.addChild(message);

		    gameLoop();
		});
	});
});




function play() {

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

  return true;
}





function initPixi() {
  if (!PIXI.utils.isWebGLSupported()){ type = "canvas" }
  PIXI.utils.sayHello(type);
}

function initPixiRenderer(width, height) {
  // Create a container object called the `stage`, and a renderer.
  stage = new PIXI.Container();
  renderer = PIXI.autoDetectRenderer(width, height,
    {antialias: false, transparent: false, resolution: 1}
  );

  // Style and resize.
  renderer.view.style.border = "1px dashed black";
  renderer.backgroundColor = 0xFFFFFF;
  renderer.autoResize = true;
//  renderer.resize(1392, 512);

  // Add the canvas to the HTML document
  document.body.appendChild(renderer.view);
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

