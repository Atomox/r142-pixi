var rstation = (function stationFactory() {
	function Station(id, platforms, x1, y1, x2, y2) {
		this.id = id;
		this.platforms = [];
		this.tracks = [];
		this.location = {
			x1: x1,
			x2: x2,
			y1: y1,
			y2: y2
		};
	}

	Station.prototype.checkBounds = function (x1, x2, y1, y2) {

		var checks = [
			[[x1,x2],[this.location.x2,this.location.x2]],
			[[y1,y2],[this.location.y1,this.location.y2]]
		];

		for (var i = 0; i < checks.length; i++) {
			for (var j = 0; j < 2; j++) {
				// Make sure x1, x2 and y1, y2 fall within the bounds of the station's coords.
				if (checks[i][0][j] < checks[i][1][0] || checks[i][0][j] > checks[i][1][1]) {
					return false;
				}
			}
		}

		return true;
	}

	Station.prototype.addPlatform = function addPlatform(id, type, x1,y1,x2,y2) {

		if (this.checkBounds(x1,y1,x2,y2) === false) {
			throw new Error('Platform cannot fall outside of station bounds.');
		}

		this.platforms[id] = {
			type: type,
			location: {
				x1: x1,
				x2: x2,
				y1: y1,
				y2: y2
			}
		};
	}

	/**
	 * Get the entire length of the station.
	 *
	 * @return {int}
	 *   The length.
	 */
	Station.prototype.length = function length() {
		var len = 0;

		return this.location.x2-this.location.x1;
	}

	return {
		Station: Station
	};
})();