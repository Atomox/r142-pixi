var type = "WebGL",
  stage, renderer,
  state = play;




initPixi();
initPixiRenderer();


var car = [],
	train_4_car = null;

loadTexture(null, "images/R142.png")
.then(function(url) {
  console.log('Calling setup for', url);
  train_4_car = r142.setupTrain(url);

  /**
   

    @TODO
      


   */
  train_4_car.setSchedule([
    {velocity: [20,0]},
    {decel: [0, .1]},
    {unload: [10, .05]},
    {acel: [20, .05]}
  ]);

}).then(() => {

    var message = new PIXI.Text("R142.", {fontFamily: "Helevetica", fontSize: 64, fill: "gray"});
    message.position.set(256, 0);
    stage.addChild(message);

    gameLoop();
});




function play() {

  // get status.
  if (train_4_car.status == 'waiting') {
    train_4_car.velocity(20,0);
    train_4_car.decel(0, .1);
  }
  else if (train_4_car.status == 'decel') {
    if (train_4_car.continue() === false) {
      // start next action.
      train_4_car.unload(10, .05);
    }
  }
  else if (train_4_car.status == 'unload') {
    if (train_4_car.continue() === false) {
      // start next action.
      train_4_car.acel(20, .05);
    }
  }
  else if (train_4_car.status == 'acel') {
    if (train_4_car.continue() === false) {
      // start next action.
      console.log('See ya.');
    }
  }
  else {
    // do nothing?
  }

  return true;
}





function initPixi() {
  if (!PIXI.utils.isWebGLSupported()){ type = "canvas" }
  PIXI.utils.sayHello(type)  
}

function initPixiRenderer() {
  // Create a container object called the `stage`, and a renderer.
  stage = new PIXI.Container();
  renderer = PIXI.autoDetectRenderer(512, 256,
    {antialias: false, transparent: false, resolution: 1}
  );

  // Style and resize.
  renderer.view.style.border = "1px dashed black";
  renderer.backgroundColor = 0xFFFFFF;
  renderer.autoResize = true;
  renderer.resize(1392, 512);

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

