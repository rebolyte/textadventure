
function scrollToBottom(elStr) {
  // $(elStr).scrollTop( $(elStr)[0].scrollHeight ); // jquery
  $(elStr).scrollTop( $(elStr).dom[0].scrollHeight ); // sprint.js
}

function display (val) {
	var existingText = $('#outputFld').val();
	var newline = (existingText === '') ? '' : '\n';

	$('#outputFld').val(existingText + newline + val);
	scrollToBottom('#outputFld');

	$('#commandFld').val('');
}

var Scene = {
	name: 'An as-of-yet unnamed scene', 
	desc: 'Uh-oh! This scene has no description yet.',
	printDescription: function printDescription() {
		display(this.desc);
	},
	enter: function enter() {
		this.printDescription();
		return this.next;
	}
};

var finished = Object.assign(Object.create(Scene), {
	name: 'Completed',
	desc: 'You won! Good job.'
})

var death = Object.assign(Object.create(Scene), {
	name: 'Death',
	desc: 'Too bad, you died.',
	next: 'finished'
});

var centralCorridor = Object.assign(Object.create(Scene), {
	name: 'The central corridor',
	desc: 'You are standing in a long, dimly-lit hallway...',
	next: 'armory'
});

var armory = Object.assign(Object.create(Scene), {
	name: 'The armory',
	desc: 'You are surrounded by futuristic-looking weapons...',
	next: 'death'
});

var Engine = {
	start: function start(sceneMap) {
		this.sceneMap = sceneMap;
	},
	play: function play() {
		var currentScene = this.sceneMap.openingScene();
		var lastScene = this.sceneMap.getScene('finished');
		var nextSceneName = null;

		while (currentScene !== lastScene) {
			nextSceneName = currentScene.enter();
			currentScene = this.sceneMap.getScene(nextSceneName);
		}

		// Print out the description of the last scene.
		currentScene.enter();
	}
};

var Map = {
	scenes: {
		finished: finished,
		death: death, 
		centralCorridor: centralCorridor,
		armory: armory
	},
	setOpening: function opening(startScene) {
		this.startScene = startScene;
	},
	getScene: function getScene(sceneName) {
		return this.scenes[sceneName];
	},
	openingScene: function openingScene() {
		return this.getScene(this.startScene);
	}
};

$(document).ready(function () {

	$('#commandForm').on('submit', function (evt) {
		evt.preventDefault();

		display($('#commandFld').val());
	});

	Map.setOpening('centralCorridor');
	Engine.start(Map);
	Engine.play();

});