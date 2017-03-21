var rstationpixi = (function() {

		function renderPlatform (type, x1, x2, y1, y2) {

		if (type == 'side_north') {
			// Our Wall tiles.
			var wall_tex = PIXI.utils.TextureCache["white_tile_wall.png"];
			var my_station_wall = new PIXI.extras.TilingSprite(wall_tex, x2-x1, y2);
			my_station_wall.position.x = x1;
			my_station_wall.position.y = 0;
			this.add(my_station_wall);

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

		if (type == 'island') {
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

		return {
			renderPlatform: renderPlatform
		};
	}
})();