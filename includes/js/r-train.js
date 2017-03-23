'use strict';

var rtrain = (function rTrainFactory() {

  function Train(left, right, car_count) {
    this.container = new PIXI.Container();
    this.status = 'waiting';
    this.direction = 'e';
  
    this.images = {};
    this.images.left = left;
    this.images.right = right;
    this.car_count = car_count;
  }

  Train.prototype.add = function(item) {
    this.container.addChild(item);
  }

  Train.prototype.container = function() {
    return this.container;
  }

  Train.prototype.setDirection = function(direction) {
    direction = direction.toLowerCase();
    if (['n', 's', 'e', 'w'].indexOf(direction) === -1) {
      console.warn('Invalid direction:', direction);
      return false;
    }

    this.direction = direction;
  }

  Train.prototype.setPosition = function(x,y, y_start_bottom, x_start_right) {
    // Offset y by the height of the container.
    if (typeof y_start_bottom !== 'undefined' && y_start_bottom === true) {
      y = y-this.container.height;
    }

    if (typeof x_start_right !== 'undefined' && x_start_right === true) {
      x = x-this.container.width;
    }

    this.container.position.set(x,y);
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
        for (var i in this.schedule[this.scheduled_action]) {
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
    this.container.x += (this.direction == 'w') ? -this.container.vx : this.container.vx;
    this.container.y += this.container.vy;

    return (this.status === 'idle') ? false : true;
  }

  Train.prototype.update = function() {

    /**
     * Stopping:
     * 1. Where is our next stop?
     * 2. Check the current speed limit.
     * 3. Given our speed, how long will it take to stop?
     * 4. Proceed until we should begin stopping.
     *
     * Starting:
     * 1. When is our next stop, if any?
     * 2. Check the current speed limit.
     * 3. Begin acceleration to speed limit.
     *
     * Continuing:
     * 1. Check the current speed limit.
     * 2. Adjust our current speed to accomodate for speed limit.
     */


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

	function setupCar(file_name, car_num) {

    // Our train png.
    var car_tex = PIXI.utils.TextureCache[file_name];
    var my_car = new PIXI.Sprite(car_tex);

    var x = 0;

    x = (((car_num-1) * my_car.width) + x);

    // Positioning.
    my_car.position.set(x,0);

		my_car.vx = 0;
		my_car.vy = 0;

		return my_car;
	}

  Train.prototype.render = function render(position) {

    var car = [];

    for (var i = 0; i < this.car_count; i++) {
        var car_img = (i >= (this.car_count/2)) ? this.images.right : this.images.left;

        //This code will run when the loader has finished loading the image.
        car.push(setupCar.call(this, car_img, i+1));
        this.add(car[i]);
    }

    this.container.x = position;

    return this.container;
  }

  return {
    Train: Train
  };
})();