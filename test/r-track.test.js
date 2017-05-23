var assert = require('assert');

var rtrack = require('../includes/js/r-track.js'),
		rutils = require('../includes/js/r-utils.js');

describe('Track', function() {
	describe('Basic', function() {
		// Create a track.
		var tracks = initTracks(0, 'e', false);

		// Create 2 trains.

	});
});

var sys = {
	width: 400,
	height: 200,
	track: {
		height: 108,
		direction: 'e'
	}
};

describe('Track', function() {
	describe('Init', function() {
		it ('Should init a track with an id, height, and direction.', function() {
			var t = new rtrack.Track(0, sys.track.direction, sys.track.height);
			assert.equal(0, t.id);
			assert.equal(sys.track.direction, t.direction);
			assert.equal(sys.track.height, t.height);
		});
	});

	describe('Segments', function() {
		it ('Should add a single segment to the track.', function() {
			var t = new rtrack.Track(0, sys.track.direction, sys.track.height);
			t.setTrackSegment(10, {speed: 5, length: 500});
			assert.equal(10, t.segments[10].id);
			assert.equal(500, t.segments[10].length);
			assert.equal(5, t.segments[10].speed);
		});

		it ('Should add a segment, marked as unoccupied.', function() {
			var t = new rtrack.Track(0, sys.track.direction, sys.track.height);
			t.setTrackSegment(0, {speed: 5, length: 500});
			assert.equal(false, t.segments[0].occupied);
		});

		it ('Should add signals to the track.', function() {
			var t = new rtrack.Track(0, sys.track.direction, sys.track.height);
			t.setTrackSegment(0, {speed: 5, length: 500});
			assert.equal('object', typeof t.segments[0].signals);
			assert.notEqual(null, t.segments[0].signals);
		});

		it ('Should add stop markers to the track.', function() {
			var t = new rtrack.Track(0, sys.track.direction, sys.track.height);
			t.setTrackSegment(0, {
				speed: 10,
				length: 500,
				station: {id: 0, track: 0},
				stop: [
						[[10,8],6],
						[[6,4],24],
						[2, 22]
				]
			});
			assert.equal(10, t.segments[0].stopmarker[0].cars);
			assert.equal(6, t.segments[0].stopmarker[0].x);
		});

		it ('Should add multiple stop markers to the track.', function() {
			var t = new rtrack.Track(0, sys.track.direction, sys.track.height);
			t.setTrackSegment(0, {
				speed: 10,
				length: 500,
				station: {id: 0, track: 0},
				stop: [
						[[10,8],6],
						[[6,4],24],
						[2, 22]
				]
			});
			assert.equal(10, t.segments[0].stopmarker[0].cars);
			assert.equal(6, t.segments[0].stopmarker[0].x);
			assert.equal(8, t.segments[0].stopmarker[1].cars);
			assert.equal(6, t.segments[0].stopmarker[1].x);
			assert.equal(6, t.segments[0].stopmarker[2].cars);
			assert.equal(24, t.segments[0].stopmarker[2].x);
			assert.equal(4, t.segments[0].stopmarker[3].cars);
			assert.equal(24, t.segments[0].stopmarker[3].x);
			assert.equal(2, t.segments[0].stopmarker[4].cars);
			assert.equal(22, t.segments[0].stopmarker[4].x);
		});
	});

	describe('Track Trains', function() {

	});

	describe('Signals', function() {

		it ('Should be empty/clear by default.', function() {
			var track = initTracks(0, 'e', false);
			assert.equal(false, track.segments[0].occupied);
			assert.equal(false, track.segmentOccupied(0, 1234));
		});

		it ('Should be occupied when set as occupied.', function () {
			var track = initTracks(0, 'e', false);
			track.setSegmentOccupied(0, 1234);
			assert.equal(1234, track.segments[0].occupied);
			assert.equal(true, track.segmentOccupied(0, 0));
		});

		it ('Should not appear occupied when our train occupies this segment.', function () {
			var track = initTracks(0, 'e', false);
			track.setSegmentOccupied(0, 1234);
			assert.equal(1234, track.segments[0].occupied);
			assert.equal(false, track.segmentOccupied(0, 1234));
		});

		it ('Should appear red when the segment is occupied.', function() {
			var track = initTracks(0, 'e', false);
			track.setSegmentOccupied(0, 1234);
			assert.equal(-2, track.getSignalStatus(111,0));
		});

		it ('Should appear red when the next segment is occupied.', function() {
			var track = initTracks(0, 'e', false);
			track.setSegmentOccupied(0, 1234);
			assert.equal(-1, track.getSignalStatus(111,1));
		});

		it ('Should appear yellow when the next segment is red.', function() {
			var track = initTracks(0, 'e', false);
			track.setSegmentOccupied(0, 1234);
			assert.equal(0, track.getSignalStatus(111,2));
		});

		it ('Should appear green when the next segment is not red.', function() {
			var track = initTracks(0, 'e', false);
			track.setSegmentOccupied(0, 1234);
			assert.equal(1, track.getSignalStatus(111,3));
		});

		it ('Should update signals correctly when we refresh signals.');

		it ('Should not lose trains when we refresh signals.');

		it ('Should not allow us to occupy the signal space if another train already occupies this space.', function() {
			var track = initTracks(0, 'e', false);
			track.setSegmentOccupied(0, 1234);
			assert.equal(-2, track.getSignalStatus(111,0));
			track.setSegmentOccupied(0, 2234);
			assert.equal(false, track.segmentOccupied(0, 1234))
			assert.equal(true, track.segmentOccupied(0, 2234))
		});

	});

	describe('Destinations', function() {});


	describe('Helper Functions', function() {
		describe('getDistanceToSegment()', function() {
			it ('Should get the distance to segment 0.', function() {
				var track = initTracks(0, 'e', false);
				assert.equal(0,track.getDistanceToSegment(0));
			});
			it ('Should get distance to a later segment.', function() {
				var track = initTracks(0, 'e', false);
				assert.equal(4000,track.getDistanceToSegment(2));
			});
		});
		describe('getSegmentsByBounds()', function() {
			//var track = initTracks(0, 'e', false);
			//console.log(track.getSegmentsByBounds(0,2000));
		});
	});
});



function initTracks(id, direction) {
	var min_length = 2000,
		min_station_length = 4000,
		min_station_third = Math.floor(min_station_length/3),
		tracks = new rtrack.Track(id, direction, 108);

	tracks.setTrackSegments([
		{speed: 5, length: min_length},
		{speed: 5, length: min_length},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
		},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [
				[[10,8],6,4]
			]
		},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
			stop: [
				[[6,4], 6,4]
			]
		},
		{speed: 5, length: min_length},
		{speed: 25, length: min_length},
		{speed: 25, length: min_length},
		{speed: 10, length: min_station_third,
			station: {id: 0, track: 0},
		},
	]);

	return tracks;
}