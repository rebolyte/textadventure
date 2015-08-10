
function scrollToBottom(elStr) {
  $(elStr).scrollTop( $(elStr)[0].scrollHeight );
}

function display (val) {
	var existingText = $('#outputFld').val();
	var newline = null;

	if (existingText === '') {
		newline = '';
	} else {
		newline = '\n';
	}

	$('#outputFld').val(existingText + newline + val);
	scrollToBottom('#outputFld');

	$('#commandFld').val('');
}


// * Map
//   - next_scene
//   - opening_scene
// * Engine
//   - play
// * Scene
//   - enter
//   * Death
//   * Central Corridor
//   * Laser Weapon Armory
//   * The Bridge

var Scene = {
	printDescription: function printDescription() {
		display(this.desc);
	}
};

// death(scene)
var death = Object.assign(Object.create(Scene), {
	name: "Death",
	desc: "Too bad, you died."
});

// centralCorridor(scene)
var centralCorridor = Object.assign(Object.create(Scene), {
	name: "The central corridor",
	desc: "You are standing in a long, dimly-lit hallway..."
});

// jquery(document).ready(...
$(document).ready(function () {

	$('#commandForm').on('submit', function (evt) {
		evt.preventDefault();

		display($('#commandFld').val());
	});

	console.log(centralCorridor);

	centralCorridor.printDescription();

});