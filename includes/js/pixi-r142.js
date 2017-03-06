var r142 = (function r142Factory() {

  function Train() {
    this.container = new PIXI.Container();
    this.status = 'waiting';
  }

  Train.prototype.add = function(item) {
    this.container.addChild(item);
  }

  Train.prototype.container = function() {
    return this.container;
  }

  Train.prototype.setSchedule = function(schedule) {
    this.schedule = schedule;
  }

  Train.prototype.status = function() {
    return this.status;
  }

  Train.prototype.velocity = function(x,y) {
    this.container.vx = x;
    this.container.vy = y;
  }

  Train.prototype.unload = function(final, step) {
    this.status = 'unload';
    this.action = {
      type: 'unload',
      final: final,
      step: step
    };

    this.velocity(0,0);
  }

  Train.prototype.decel = function(final, step) {
    this.status = 'decel';
    this.action = {
      init: this.container.vx,
      type: 'decel',
      final: final,
      step: step
    };
  }

  Train.prototype.acel = function(final, step) {
    this.status = 'acel';
    this.action = {
      type: 'acel',
      init: this.container.vx,
      final: final,
      step: step
    };
  }

  Train.prototype.continue = function() {
    if (this.status == 'decel') {
      if (this.container.vx - this.action.step <= 0) {
        this.container.vx = 0;
        this.status = 'idle';
      }
      else {
        this.container.vx -= this.action.step;
      }
    }
    else if (this.status == 'acel') {
      if (this.container.vx + this.action.step >= this.action.final) {
        this.container.vx = this.action.final;
        this.status = 'idle';
      }
      else {
        this.container.vx += this.action.step;
      }
    }
    else if (this.status == 'unload') {
      if (this.action.final <= 0) {
        this.status = 'idle';
      }
      else {
        this.action.final -= this.action.step;
      }
    }

    this.container.vy = 0;
    this.container.x += this.container.vx;
    this.container.y += this.container.vy;

    return (this.status === 'idle') ? false : true;
  }

	function setupCar(url, car_num, x, y) {
		var my_car = new PIXI.Sprite(
	    PIXI.loader.resources[url].texture
	  );

	  //  r142[1].visible = true;

		// Scaling.
		//	r142.width = 320;
		//	r142.height = 64;
		my_car.scale.x = .85;
		my_car.scale.y = .85;

	  x = ((i * my_car.width) + x);

	  // Positioning.
	  my_car.position.set(x,y);
		//  my_car.x = 96;
		//  my_car.y = 64;


		my_car.vx = 0;
		my_car.vy = 0;

		return my_car;
	}

  function setupTrain(url) {

    console.log('Setup for', url);

    train_4_car = new Train();

    for (i = 0; i < 4; i++) {
        //This code will run when the loader has finished loading the image.
        car.push(r142.setupCar(url, i+1, -2048, 64));
        train_4_car.add(car[i]);
    }

    stage.addChild(train_4_car.container);

    return train_4_car;
  }

  return {
    setupCar: setupCar,
    setupTrain: setupTrain,
    Train: Train
  };
})();