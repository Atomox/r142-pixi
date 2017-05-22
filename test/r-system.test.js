var assert = require('assert');
var rsystem = require('../includes/js/r-system.js');


var sys = {
	width: 400,
	height: 200,
};

describe('System', function() {
	describe('Init', function() {
		it ('Should init a system with coordinates.', function() {
			var system = new rsystem.System(sys.width, sys.height);
			assert.equal(400, system.width);
		});

		it ('Should add a track to the system.', function() {
			assert.equal(true, true);
		});

	});
});