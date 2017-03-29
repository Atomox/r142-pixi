var rtrackpixi = (function() {
	var textures = {
		signal: []
	},
			textures;

	function renderStopMarker(cars, x, y) {

		// Platform floor
	  var stop_tex = PIXI.utils.TextureCache["stopmarker" + cars + ".png"];
  	var my_stop = new PIXI.Sprite(stop_tex);
		my_stop.position.x = x;
		my_stop.position.y = y;

		my_stop.scale.y = .35;
		my_stop.scale.x = .35;

		return my_stop;
	}

	function getSignalTexture(status, direction) {
		if (typeof textures === 'undefined') {
//			textures = PIXI.loader.resources["/images/track_basic.json"].textures;
		}
		var type = (status === -1) ? 'r' : (status === 0) ? 'y' : 'g';
		var direction = (direction === 'e') ? 'e' : 'w';
		return PIXI.utils.TextureCache["signal_" + type + '_' + direction + ".png"];
//		return textures["signal_" + type + ".png"];
	}

	function renderSignal(status, x, y, direction) {
		var my_texture = getSignalTexture(status, direction);
  	var my_signal = new PIXI.Sprite(my_texture);
		my_signal.position.x = x;
		my_signal.position.y = y + my_signal.height / 5;
		my_signal.scale.x = .75;
		my_signal.scale.y = .75;

		console.log('Adding new signal ...', status, 'signal pos:', x, y);

    return my_signal;
	}

	return {
		stopMarker: renderStopMarker,
		signal: renderSignal,
		signalTexture: getSignalTexture
	};
})();