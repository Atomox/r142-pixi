var assert = require('assert');

var rutils = require('../includes/js/r-utils.js');

describe('Utilities', function() {

	describe('checkForIntersection()', function() {

		it ('Should detect coordinates completely contained.', function() {
			assert.equal(true, rutils.intersection(2, 9, 0, 10));
		});
		it ('Should detect coordinates overlapping left.', function() {
			assert.equal(true, rutils.intersection(2, 9, 5, 12));
		});
		it ('Should detect coordinates overlapping right.', function() {
			assert.equal(true, rutils.intersection(5, 12, 9, 18));
		});
		it ('Should detect coordinates touching left.', function() {
			assert.equal(true, rutils.intersection(5, 12, 1, 5));
		});
		it ('Should detect coordinates touching right.', function() {
			assert.equal(true, rutils.intersection(5, 12, 12, 18));
		});
		it ('Should not detect coordinates to outside, to the left.', function() {
			assert.equal(false, rutils.intersection(0, 5, 9, 18));
		});
		it ('Should not detect coordinates to outside, to the right.', function() {
			assert.equal(false, rutils.intersection(9, 18, 3, 6));
		});
	});

});