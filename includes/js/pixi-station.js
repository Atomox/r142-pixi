'use strict';

var rstation = (function stationFactory() {

	function Station(name, track_count) {
		this.container = new PIXI.Container();
		this.name = name;
		this.tracks = initTracks.call(this, track_count);
	}

	function initTracks(count) {
		/**
		 
		  @todo 
		 
		 	Need a buffer distance for green vs yellow vs red signal.

		 	When a train hits a yellow signal, track is available at SLOW speeds. Open track.

		 	When a train hits a green signal, track is available at NORMAL speeds. Open track.
		 
		 */


		var results = [];
		for(var i = 0; i < count; i++) {
			results[i] = {
				id: i,
				direction: 'e',
				x: 0,
				y: 0,
				occupied: false,
				stopmarker: {}
			}
		}

		return results;
	}

	Station.prototype.getTrackSpeed = function(id, position) {

		/**
		   
		   @TODO
			Get speed by position. Tracks should be split to segments.
		 */
		
		return this.tracks[id].speed;
	}

	Station.prototype.add = function(item) {
		this.container.addChild(item);
	}

	Station.prototype.initPlatform = function(url, x1, x2, y1, y2) {

		// Our Wall tiles.
		var wall_tex = PIXI.utils.TextureCache["white_tile_wall.png"];
		var my_station_wall = new PIXI.extras.TilingSprite(wall_tex, x2-x1, y2);
		my_station_wall.position.x = x1;
		my_station_wall.position.y = 0;
		this.add(my_station_wall);

		// Our station edge tiles.
		var edge_tex = PIXI.utils.TextureCache["yellow_edge.png"];
		var my_platform_edge = new PIXI.extras.TilingSprite(edge_tex, x2-x1, 16);
		my_platform_edge.position.x = x1;
		my_platform_edge.position.y = y1;
		this.add(my_platform_edge);

		// Our station edge tiles.
		var edge_2_tex = PIXI.utils.TextureCache["yellow_edge.png"];
		var my_platform_edge_2 = new PIXI.extras.TilingSprite(edge_2_tex, x2-x1, 16);
		my_platform_edge_2.position.x = x1;
		my_platform_edge_2.position.y = y2;
		this.add(my_platform_edge_2);

		// Platform floor
		var plat_tex = PIXI.utils.TextureCache["tile_floor_gray.png"];
		var my_platform = new PIXI.extras.TilingSprite(plat_tex, x2-x1, (y2-y1)-16);
		my_platform.position.x = x1;
		my_platform.position.y = y1+16;
		this.add(my_platform);
	}

	Station.prototype.open = function openStation() {
		 stage.addChild(this.container);
	}

	Station.prototype.setTrack = function setTrack(id, direction, speed, x, spawn_pos, signal) {

		direction = direction.toLowerCase();
		if (['n', 's', 'e', 'w'].indexOf(direction) === -1) {
			console.warn('Invalid track direction:', direction);
			direction = null;
		}

		if (typeof this.tracks[id] === 'undefined') {
			console.warn('Track with id: ', id, 'does not exists for this station.');
			return;
		}

		if (direction) { this.tracks[id].direction = direction; }
		this.tracks[id].speed = (typeof speed === 'number') ? speed : 20;

		if (direction == 'e' || direction == 'w') {
			this.tracks[id].x = 0;
			this.tracks[id].y = x;
			this.tracks[id].spawn_x = spawn_pos;
			this.tracks[id].spawn_y = 0;			
		}
		else {
			this.tracks[id].x = x;
			this.tracks[id].y = 0;
			this.tracks[id].spawn_x = 0;
			this.tracks[id].spawn_y = spawn_pos;			
		}

	}

	/**
	 * Set the forward stop marker for trains arriving on this platform/track.
	 * 
	 * @param {int} id
	 *   Track number.
	 * @param {int} train_num
	 *   Number of cars, like 10, 8, 6, 4.
	 * @param {int} x
	 *   The track position where this marker lives.
	 */
	Station.prototype.setTrackStopMarker = function(id, train_num, x) {

		if (typeof train_num !== 'object' && typeof train_num === 'number') {
			train_num = [train_num];
		}

		for (var i = 0; i < train_num.length; i++) {
			this.tracks[id].stopmarker[train_num[i]] = x;

			// Platform floor
		    var stop_tex = PIXI.utils.TextureCache["stopmarker" + train_num[i] + ".png"];
    		var my_stop = new PIXI.Sprite(stop_tex);
			my_stop.position.x = x;
			my_stop.position.y = this.tracks[id].y-70 - my_stop.height;

			this.add(my_stop);
		}
	}

	/**
	 * Set the buffer before the station where signal buffer triggers begin.
	 * 
	 * @param {int} id
	 *   Track number.
	 * @param {int} yellow 
	 *   Distance before platform where signal turns from green to yellow.
	 * @param {int} red    
	 *   Distance before platform where signal turns from yellow to red.
	 */
	Station.prototype.setTrackArrivalZone = function setTrackArriveZone(id, yellow, red) {
		this.tracks[id].arrive = {
			yellow: yellow,
			red: red
		};
	}

	/**
	 * Set the buffer after the station where signal buffer triggers begin.
	 * 
	 * @param {int} id
	 *   Track number.
	 * @param {int} yellow 
	 *   Distance from platform where signal changes from red to yellow.
	 * @param {int} red    
	 *   Distance from platform where signal starts at red.
	 */
	Station.prototype.setTrackDepartureZone = function setTrackDepartZone(id, yellow, red) {
		this.tracks[id].depart = {
			yellow: yellow,
			red: red
		};	
	}

	Station.prototype.scheduleTrain = function(track, train) {
		if (typeof this.tracks[track] === undefined) {
			console.warn(track, 'does not exist at station', this.name);
			return false;
		}

		if (this.tracks[track].occupied == false) {
			this.tracks[track].occupied = train;
		}

		train.setDirection(this.tracks[track].direction);


		// station.setTrackStopMarker(0, [10,8,6,4], 256);
		//train.setSchedule();

		// 1. Determine spawn point & starting velocity.
		// 2. Determine current speed limit.
		// 3. Determine distance to decrease velocity from current to 0.
		// 4. Determine distance from platform stop marker

		// When east-bound, start the train west of the x spawn point.
		if (this.tracks[track].direction == 'e') {
			train.setPosition(this.tracks[track].spawn_x, this.tracks[track].y, true, true);
		}
		else {
			train.setPosition(this.tracks[track].spawn_x, this.tracks[track].y, true);
		}
		
	}

	Station.prototype.trackStatus = function(track) {
		if (typeof this.tracks[track] === undefined) {
			console.warn(track, 'does not exist at station', this.name);
			return false;
		}

		if (this.tracks[track].occupied == false) {
			return true;
		}

		return false;
	}

	return {
		Station: Station
	};
})();