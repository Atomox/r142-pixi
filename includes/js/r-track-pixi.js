var rtrackpixi = (function() {

	function renderStopMarker(cars, x, y) {

		// Platform floor
	  var stop_tex = PIXI.utils.TextureCache["stopmarker" + cars + ".png"];
  	var my_stop = new PIXI.Sprite(stop_tex);
		my_stop.position.x = x;

		/**
		 
		 @TODO


		 */
		my_stop.position.y = y; // - my_stop.height; // y - 70 - my_stop.height

		my_stop.scale.y = .35;
		my_stop.scale.x = .35;

		return my_stop;
	}

	return {
		stopMarker: renderStopMarker
	};
})();