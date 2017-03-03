var type = "WebGL"

if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

PIXI.utils.sayHello(type)


//Create the renderer

//Create a container object called the `stage`, and a renderer.
var stage = new PIXI.Container(),
		renderer = PIXI.autoDetectRenderer(512, 256,
			{antialias: false, transparent: false, resolution: 1}
		);

// Style and resize.
renderer.view.style.border = "1px dashed black";
renderer.backgroundColor = 0xFFFFFF;
renderer.autoResize = true;
renderer.resize(1024, 512);

// Add the canvas to the HTML document
document.body.appendChild(renderer.view);

var r142 = [],
		train_4_car = null;

// Load an image.
PIXI.loader
  .add("images/R142.png")
  .load(setup);

function setup() {

	train_4_car = new PIXI.Container();

	for (i = 0; i < 4; i++) {
  	//This code will run when the loader has finished loading the image.
  	r142.push(setupCar("images/R142.png", i+1, 32, 64));
  	train_4_car.addChild(r142[i]);
	}

  var message = new PIXI.Text(
	  "Hello Pixi!",
	  {fontFamily: "Helevetica", fontSize: 64, fill: "gray"}
	);
	message.position.set(256, 64);
	stage.addChild(message);


  stage.addChild(train_4_car);

  gameLoop();
}

function setupCar(url, car_num, x, y) {
	var my_car = new PIXI.Sprite(
    PIXI.loader.resources[url].texture
  );

  //  r142[1].visible = true;

	// Scaling.
	//	r142.width = 320;
	//	r142.height = 64;
	my_car.scale.x = 0.85;
	my_car.scale.y = 0.85;

  x = ((i * my_car.width) + x);

  // Positioning.
  my_car.position.set(x,y);
	//  my_car.x = 96;
	//  my_car.y = 64;


	my_car.vx = 0;
	my_car.vy = 0;

	return my_car;
}

var state = play;

function gameLoop() {
	requestAnimationFrame(gameLoop);

	state();

	renderer.render(stage);
}

function play() {
	train_4_car.vx = 1;
	train_4_car.vy = 0;

	train_4_car.x += train_4_car.vx;
	train_4_car.y += train_4_car.vy;
}



