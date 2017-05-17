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

	function renderSignalBox(status, x1, y1, x2, y2) {

		var my_signal = new PIXI.Graphics();

		// Set the position of this signal.
		my_signal.position.x = x1;
		my_signal.position.y = y1;

		console.log('Adding new signal ...', status, 'signal pos:', x1, y1);

		// Add a color and size. The rectangle is already placed on the map.
		// We just need to draw it starting at it's placement above, so we only need
		// length and width, hence only a single x and y.
    return updateSignalBox(my_signal, status, x2-x1, y2-y1);
	}

	/**
	 * Given a graphics item representing a signal rectangle, refresh it's status.
	 * @param  {[type]} item [description]
	 * @return {[type]}      [description]
	 */
	function updateSignalBox(item, status, x, y) {
		item.clear();
		var type = (status === -1)
			? '0xf45f42' 
			: (status === 0) 
			? '0xf4e841' 
			: '0x61f441';

		item.beginFill(type);
		// set the line style to have a width of 5 and set the color to red
		item.lineStyle(0, 0x000000);

		// draw a rectangle to 
		item.drawRect(0, 0, x, y);

		return item;
	}

	return {
		stopMarker: renderStopMarker,
		signal: renderSignal,
		signalBox: renderSignalBox,
		updateSignalBox: updateSignalBox,
		signalTexture: getSignalTexture
	};
})();