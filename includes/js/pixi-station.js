'use strict';

var rstation = (function stationFactory() {

	function Station(name, track_count) {
		this.container = new PIXI.Container();
		this.name = name;
		this.tracks = initTracks.call(this, track_count);
	}

	function initTracks(count) {
		var results = [];
		for(var i = 0; i < count; i++) {
			results[i] = {
				id: i,
				direction: 'e',
				x: 0,
				y: 0,
				occupied: false
			}
		}

		return results;
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

	Station.prototype.setTrack = function setTrack(id, direction, x, y, spawn_x, spawn_y) {

		console.log(this.tracks);

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
		this.tracks[id].x = x;
		this.tracks[id].y = y;
		this.tracks[id].spawn_x = spawn_x;
		this.tracks[id].spawn_y = spawn_y;
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
		train.setPosition(this.tracks[track].spawn_x, this.tracks[track].spawn_y, true);
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