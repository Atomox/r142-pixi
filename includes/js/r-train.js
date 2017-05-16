'use strict';

var rtrain = (function rTrainFactory() {

  function Train(id, left, right, car_count) {
    this.id = id;
    this.container = new PIXI.Container();
    this.status = 'waiting';
    this.direction = 'e';

    this.images = {};
    this.images.left = left;
    this.images.right = right;
    this.car_count = car_count;

    this.container.vx = 0;
    this.container.vy = 0;

    this.decel_step = {
      normal: .1,
      medium: .2,
      high: .3
    };
  }


  Train.prototype.getPosition = function getPosition() {
    return this.container.x;
  }


  Train.prototype.getLength = function() {
    if (typeof this.container !== 'undefined') {
      return this.container.width;
    }
    return 0;
  }

  Train.prototype.getHeight = function() {
    if (typeof this.container !== 'undefined') {
      return this.container.height;
    }
    return 0;
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
  }

  Train.prototype.waiting = function() {
    this.velocity(0,0);
    this.status = 'waiting';
    this.action = {
      type: 'waiting'
    };
  }

  Train.prototype.unload = function(final, step) {
    console.log('Unloading');
    this.velocity(0,0);
    this.status = 'unload';
    this.action = {
      type: 'unload',
      final: final,
      step: step
    };
  }

  Train.prototype.doors_open = function(final, step) {
    console.log('Doors Opening');
    this.velocity(0,0);
    this.status = 'doors_open';
    this.action = {
      type: 'unload',
      final: final,
      step: step
    };
  }

  Train.prototype.doors_close = function(final, step) {
    console.log('Doors Closing');
    this.velocity(0,0);
    this.status = 'doors_close';
    this.action = {
      type: 'load',
      final: final,
      step: step
    };
  }

  Train.prototype.load = function(final, step) {
    console.log('Loading');
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

  Train.prototype.maintain = function(speed) {
    this.status = 'maintain';
    this.action = {
      type: 'maintain',
      init: this.container.vx,
      step: speed
    };
  }


  /**
   * Determine if velocity should be negative or positive, depending upon direction.
   * @param  {[type]} direction [description]
   * @param  {[type]} acel      [description]
   * @param  {[type]} step      [description]
   * @return {[type]}           [description]
   */
  Train.prototype.step = function step(acel, counter, step, limit) {
    if (counter < 0) {
      console.warn(counter, ' is below zero');
    }

    if (acel == true) {
      counter += step;
      if (counter >= limit) { counter = limit; }
    }
    else {
      counter -= step;
      if (counter <= limit) { counter = limit; }
    }

    return counter;
  }


  Train.prototype.continue = function() {
    if (['decel', 'acel'].indexOf(this.status) >= 0) {
      // Increment by the step.
      this.container.vx = (this.status == 'acel')
        ? this.step(true, this.container.vx, this.action.step, this.action.final)
        : this.step(false, this.container.vx, this.action.step, this.action.final);

      // When we meet or surpass our limit, end this status.
      if (this.container.vx === this.action.final) {
        this.container.vx = this.action.final;
        console.log(this.id, ':', 'Reached final', this.status, 'of',this.action.final,'.');

        if (this.action.final === 0) {
          console.log(this.id, ':', 'Setting to idle.');
          this.status = 'idle';
        }
        else {
          console.log(this.id, ':', this.action.final, 'reached. Setting to maintain.');
          this.maintain(this.action.final);
        }
      }
    }
    else if (this.status == 'maintain') {
      this.container.vx = this.action.step;
    }
    else if (this.status == 'unload' || this.status == 'load'
      || this.status == 'doors_open' || this.status == 'doors_close') {
      if (this.action.final <= 0) {
        switch (this.status) {
          case 'doors_open': this.unload(10, .05); break;
          case 'unload': this.load(10, .05); break;
          case 'load': this.doors_close(5, .05); break;
          case 'doors_close':
          default: this.status = 'departure';
        }
      }
      else {
        this.action.final -= this.action.step;
      }
    }
    else if (this.status == 'velocity'){
      this.status = 'idle';
    }
    else if (this.status == 'waiting') {
      this.status = 'waiting';
    }
    else {
      //console.log('Continue: Unknown action: ', this.status);
    }


    this.container.vy = 0;
    this.container.x += (this.direction == 'e') ? -this.container.vx : this.container.vx;
    this.container.y += this.container.vy;

    if (this.container.x < 0) {
      this.container.x = 0;
    }
    else if (this.container.x > this.container.length) {
      this.container.x = this.container.length;
    }

    return (this.status === 'idle') ? false : true;
  }


  /**
   * State update step to update the train in each step of the game loop.
   *
   * @param  {Track} track
   *   The track object this train lives in. Used to get track info,
   *   such as signals, speed, stop markers, etc.
   */
  Train.prototype.state = function state(track) {

    // 1. Boarding sequence continues without this function.
    if (['load', 'unload', 'doors_open', 'doors_close'].indexOf(this.status) >= 0) {
      return this.continue();
    }

    // 2. Check destination.
    // Did we reach or pass our destination?
    if (typeof this.destination !== 'undefined'
      && rutils.passedDestination(this.destination.x,this.container.x,this.direction)) {

      // If arrival procedure complete, find next destination.
      if (this.status == 'departure') {
        // Get next destination.
        this.destination = track.getTrainDestination(this.id, this.car_count, this.container.x, true);
        console.log('DEPARTURE:', this.destination, this.container.x);
      }
      // If arrival, begin unboarding procedure.
      else if (this.destination.type == 'stop_marker') {
        if (['idle', 'waiting'].indexOf(this.status) >= 0) { console.log(this.id, '(', this.status, '): Arrival'); }
        console.log('Stop Marker...');
        this.doors_open(5, .05);
        return this.continue();
      }
      else if (this.destination.type == 'eol') {
        if (['idle', 'waiting'].indexOf(this.status) < 0) { console.log(this.id, '(', this.status, '): End of Line'); }
      }
      // In all other cases, get the next destination.
      else {
        console.warn('Past destination, but did not match scenarios.');
        this.destination = null;
      }
    }

    // If no destination, get one.
    if (typeof this.destination === 'undefined' || this.destination === null) {
      this.destination = track.getTrainDestination(this.id, this.car_count, this.container.x);
      console.log(this.id, ': New Destination: ', this.destination);
    }


    // 3. Does signal traffic override our destination?
    // Is there a red signal? If so, stop, but don't change destination.
    var signal_status = track.getSignalDestination(this.id, this.car_count, this.container.x);
    var destination = (signal_status !== false) ? signal_status : this.destination;

    if (signal_status !== false) {
//      console.log(this.id, 'RED SIGNAL in segment: ', signal_status.segment);
    }


    // 4. Get speed, distance to destination, and stopping distance.

    // Get speed of current segment.
    var speed = track.getSpeedLimit(null, this.container.x, this.id);

    // How far away are we?
    var distance_remaining = (this.direction == 'e')
      ? this.container.x - destination.x
      : destination.x - this.container.x;

    // At the current speed, what distance will it take to stop at our destination?
    var my_stop_distance = rutils.calculateStoppingDistance(this.container.vx, this.decel_step.normal);



    // 5. Determine if we should change actions.

    /**
       @TODO
         Check if this is aggressive enough, or if we should reduce faster.
     */
    // Close to target. Stop now.
    if (my_stop_distance > 0 && my_stop_distance >= distance_remaining) {
      if (this.status !== 'decel') { console.log(this.id, '(', this.status, '): Decel to stop...'); }
      // Stop / Decel
      this.decel(0, this.decel_step.normal);
    }

    /**
       @TODO

         Handle stopping for signals vs stopping for stop_markers vs eol.

         How do we re-accel once we're arrived, and just changed to the next destination.
     */
    // If arrival. // && this.container.x <= destination.distance
    else if (my_stop_distance <= 0 && distance_remaining <= 0
      && ['stop_marker', 'eol'].indexOf(destination.type) < 0) {
      if (this.status !== 'waiting') {
        console.log(this.id, '(', this.status, '): Waiting... for ', destination.type);
        console.log(this.id, "Waiting for ...", destination.type,
          ' -- My stop dist:', my_stop_distance,
          ', My destination dist:', destination.x,
          ', My distance remaining:', distance_remaining,
          ' My pos:', this.container.x);
      }
      this.waiting();
    }

    /**
       @TODO
         If we're close to our stopping distance, reduce to caution speed.
     */
    // Far from target. Speed up.
    else if (my_stop_distance < (distance_remaining * 0.5)) {
      if (this.container.vx < speed) {
        if (this.status !== 'acel') { console.log(this.id, this.status, ': Accel... from', this.container.vx, 'to ', speed); }
        // Accelerate to speed.
        this.acel(speed, this.decel_step.normal);
      }
      else if (this.container.vx > speed) {
        if (this.status !== 'decel') { console.log(this.id, ': Decel...'); }
        // Decel to speed.
        this.decel(speed, this.decel_step.normal);
      }
      else {
        if (this.status !== 'maintain') { console.log(this.id, ': Maintain...', speed, destination); }
        // Continue unchanged.
        this.maintain(speed);
      }
    }
    else {
      if (this.status == 'idle' && destination.type == "stop_marker") {
        console.log(this.id, ': Stop Marker...');
      }
    }

    // Perform the update.
    this.continue();
  }


  /**
   * Add a single car to the train, including graphics.
   *
   * @param  {string} file_name
   *   File name of existing textureCache for the train car.
   * @param  {int} car_num
   *   The car number from the front of the train.
   *
   * @return {Pixi Item}
   *   Car pixi item to be added to the train container.
   */
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


  /**
   * Assemble a train container, with cars and images specified in constructor.
   *
   * @param  {int} position
   *   Position on the track where train should be set.
   *
   * @return {PIXI Container}
   *   Complete train to be added as a container/child of the track.
   */
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