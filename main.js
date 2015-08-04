
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

function Scene(
	scName,
	scDesc
) {
	this.name = scName;
	this.desc = scDesc;
}

Scene.prototype = {
	printDescription: function () {
		display(this.desc);
	}
};

// jquery(document).ready(...
$(document).ready(function () {

	$('#commandForm').on('submit', function (evt) {
		evt.preventDefault();

		var existingText = $('#outputFld').val();
		var cmd = $('#commandFld').val();
		var newline = null;

		if (existingText === '') {
			newline = '';
		} else {
			newline = '\n';
		}

		$('#outputFld').val(existingText + newline + cmd);
		scrollToBottom('#outputFld');

		$('#commandFld').val('');
	});

	scene = new Scene('A Name', 'This is the description');

	console.log(scene);

	scene.printDescription();

});