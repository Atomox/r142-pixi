function debugSystemUI(track) {
		var dir = {};
		dir['e'] = 'east';
		dir['w'] = 'west';
		dir['n'] = 'north';
		dir['s'] = 'south';

		var my_ui_parent = document.getElementById('debugUI'),
				my_div_id = 'track' + track.id;

		var my_div = getDebugElement(my_div_id, my_ui_parent, 'col-12');

		var stuff = "<h3 style='display: inline-block; padding-right: 2em'>Track " + track.id + "</h2>";
		stuff += track.trains.length + " trains, "
			+ "heading " + dir[track.direction]
		  + " across " + track.segments.length + " segments.<br>";
		my_div.innerHTML = stuff;

		for (var i in track.trains) {
//			console.log('>>>', track.trains[i].container);
			var my_train_div = getDebugElement('t'+track.id+'-v'+track.trains[i].id, my_div, 'col-4');

			var my_content = '<h4>Train ' + track.trains[i].id + '</h4>';
			my_content += 'Bound <i>' + dir[track.trains[i].direction] + '</i> to: <b>' + track.trains[i].destination.type + '</b> @ x: ' + track.trains[i].destination.x + '' +'<br>';
			my_content += 'x/y:' + Math.floor(track.trains[i].container.x) + ' / ' + Math.floor(track.trains[i].container.y) + '<br>';
			my_content += 'Ac/St: ' + track.trains[i].action.type + ' / ' + track.trains[i].status + '<br>';
			my_content += 'vX:' + Math.floor(track.trains[i].container.vx) + ', vY:' + Math.floor(track.trains[i].container.vy) + ', ' +'<br>';

			my_train_div.innerHTML = my_content;
		}
}


function getDebugElement(id, parent, extra_class) {
	// check for a DIV with ID: track + this.id
	if (!document.getElementById(id)) {
		var my_div = document.createElement('div');
		my_div.setAttribute('id', id);
		my_div.setAttribute('class', extra_class);
		parent.appendChild(my_div);
	}

	return document.getElementById(id);
}