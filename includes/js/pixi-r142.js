var r142 = (function r142Factory() {

  function Train() {
    this.container = new PIXI.Container();
    this.status = 'waiting';
    this.scheduled_action = null;
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

  Train.prototype.nextAction = function() {

    if (this.scheduled_action == null) {
      this.scheduled_action = 0;
    }
    else {
      this.scheduled_action++;
    }

    if (typeof this.schedule === 'object' && this.schedule !== null) {
      if (typeof this.schedule[this.scheduled_action] !== 'undefined') {
        for (i in this.schedule[this.scheduled_action]) {
          this.status = i;
          var args = this.schedule[this.scheduled_action][i];

          switch (this.status) {

            case 'velocity':
              this.velocity.apply(this, args);
              break;

            case 'unload':
              this.unload.apply(this, args);
              break;

            case 'load':
              this.load.apply(this, args);
              break;

            case 'decel':
              this.decel.apply(this, args);
              break;

            case 'acel':
              this.acel.apply(this, args);
              break;

            default:
              console.log('Unknown Action: ', i);
              this.status = false;
          }
          break;
        }
      }
    }
  }

  Train.prototype.status = function() {
    return this.status;
  }

  Train.prototype.velocity = function(x,y) {
    this.container.vx = x;
    this.container.vy = y;
    this.status = 'velocity';
  }

  Train.prototype.unload = function(final, step) {
    this.velocity(0,0);
    this.status = 'unload';
    this.action = {
      type: 'unload',
      final: final,
      step: step
    };
  }

  Train.prototype.load = function(final, step) {
    this.velocity(0,0);
    this.status = 'load';
    this.action = {
      type: 'load',
      final: final,
      step: step
    };
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
    else if (this.status == 'unload' || this.status == 'load') {
      if (this.action.final <= 0) {
        this.status = 'idle';
      }
      else {
        this.action.final -= this.action.step;
      }
    }
    else if (this.status == 'velocity'){
      this.status = 'idle';
    }
    else {
      console.log('Continue: Unknown action: ', this.status);
    }


    this.container.vy = 0;
    this.container.x += this.container.vx;
    this.container.y += this.container.vy;

    return (this.status === 'idle') ? false : true;
  }

  Train.prototype.update = function() {
    // get status.
    if (this.status == 'waiting' || this.status == 'idle') {
      this.nextAction();
    }
    else if (this.status !== false) {
      this.continue();
    }
    else {
      console.log('Nope.');
    }
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