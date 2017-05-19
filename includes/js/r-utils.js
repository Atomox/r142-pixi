
var rutils = (function() {
	/**
	 * Check two pairs of coordinates for any intersection. if at least 1 x/y pair
	 * falls within the box, return true;
	 *
	 * @param  {int} x1,x2,y1,y2
	 *  Object we're checking for.
	 * @param  {int} a1,a2,b1,b2
	 *  Bounding box that may overlap.
	 *
	 * @return {boolean}
	 *   TRUE if at least one pair falls on or within the borders
	 *   of the bounding box.
	 */
	function checkForBoxIntersection(x1, x2, y1, y2, a1, a2, b1, b2) {
		if (checkForIntersection(x1, x2, a1, a2) && checkForIntersection(y1, y2, b1, b2)) {
			return true;
		}

		return false;
	}


	/**
	 * Check if a pair of coordinates intersect a second pair of coordinates
	 * on a single axis.
	 *
	 * @param  {int} x1, x2
	 *   Two points on a single axis.
	 * @param  {int} a1, a2
	 *   A second set of points on a single axis.
	 *
	 * @return {boolean}
	 *   True if the sets of coordinates intersect in any way.
	 */
	function checkForIntersection(x1, x2, a1, a2) {

		// Determine if coordinates are in ascending order. If not, swap them.
		if (x2 < x1) {
			var temp_x = x2;
			x2 = x1;
			x1 = temp_x;
		}
		if (a2 < a1) {
			var temp_a = a2;
			a2 = a1;
			a1 = temp_a;
		}

		if ((x1 <= a1 && x2 >= a1)  		// Overlap Left
			|| (x1 <= a2 && x2 >= a2)  		// Overlap Right
			|| (x1 >= a1 && x2 <= a2)) { 	// Contained
			return true;
		}


		if (x1 < a1 && x2 < a1) { 	// left
			return false;
		}
		if (x1 >= a1 && x2 >= a2) { 	// Right
			return false;
		}

		return false;
	}

	function calculateStoppingDistance(velocity, decel_rate) {
		var distance = 0;

		if (velocity > 0) {
			while (velocity > 0) {
				distance += velocity;
				velocity -= decel_rate;
			}
		}

		return distance;
	}

	function passedDestination(dest_x, x, direction) {
		if (
			(['n', 'e'].indexOf(direction) >= 0 && dest_x >= x)
			|| (['s', 'w'].indexOf(direction) >= 0 && dest_x <= x)
			) {
			return true;
		}

		return false;
	}

	function roundCoord(direction, x) {
		switch (direction) {
			case 'w':
			case 'n':
				return Math.ceil(x);
				break;

			case 'e':
			case 's':
				return Math.floor(x);
				break;

			default:
				console.warn('Requesting rounding of coordinate, but direction does not match known list.');
		}

		return x;
	}

	function round(value, decimals) {
    return Number((value).toFixed(decimals));
//	  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	}

	return {
		intersection: checkForIntersection,
		boxIntersection: checkForBoxIntersection,
		calculateStoppingDistance: calculateStoppingDistance,
		passedDestination: passedDestination,
		roundCoord: roundCoord,
    round: round,
	};

})();

// If we're running under Node...
// (We do for running mocha tests, only)
if(typeof exports !== 'undefined') {
    module.exports = {
    	intersection: rutils.intersection,
			boxIntersection: rutils.boxIntersection,
			calculateStoppingDistance: rutils.calculateStoppingDistance,
			passedDestination: rutils.passedDestination,
			roundCoord: rutils.roundCoord,
      round: round
    }
}