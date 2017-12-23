// Using ES5 for compatibility (read: I don't want to set up a build system)

// ---- UTILS ----

var cmdFld = $('#commandFld');

function scrollToBottom(elStr) {
  $(elStr).scrollTop( $(elStr)[0].scrollHeight ); // jquery / zepto
  // $(elStr).scrollTop( $(elStr).dom[0].scrollHeight ); // sprint.js
}

function display(val) {
	var existingText = $('#outputFld').val();
	var newline = (existingText === '') ? '' : '\n';

	$('#outputFld').val(existingText + newline + val);
	scrollToBottom('#outputFld');

	$('#commandFld').val('');
}

function getCommand() {
	return $('#commandFld').val();	
}

function isYes(str) {
	var agreements = ['yes', 'y', 'sure', 'ok', 'yep', 'confirm', 'accept'];
	return agreements.indexOf(str.toLowerCase()) > -1;
}

function isNo(str) {
	var disagreements = ['no', 'n', 'nope', 'no way', 'nyet', 'nein', 'deny'];
	return agreements.indexOf(str.toLowerCase()) > -1;
}

// ---- ENGINE / PROTOS ----

var Engine = {
	start: function start(sceneMap) {
		this.sceneMap = sceneMap;
	},
	play: function play() {
		var currentScene = this.sceneMap.openingScene();
		var lastScene = this.sceneMap.getScene('finished');
		var nextSceneName = null;
		var that = this;
		
		function next() {
			if (currentScene !== lastScene) {
				nextSceneName = currentScene.enter(next);
				currentScene = that.sceneMap.getScene(nextSceneName);
			} else {
				// Print out the description of the last scene.
				currentScene.enter(next);
			}
		}
		
		// Kick off the game by entering the first scene and passing in the cb
		// to be executed when that scene done.
		next();
	}
};

var Scene = {
	name: 'An as-of-yet unnamed scene',
	desc: 'Uh-oh! This scene has no description yet.',
	printDescription: function printDescription() {
		display(this.desc);
	},
	enter: function enter(done) {
		this.printDescription();
		if (typeof this.run === 'function') {
			this.run(done);
		}
		return this.next;
	}
};


// ---- SCENES ----

var sceneList = [
	Object.assign(Object.create(Scene), {
		id: 'centralCorridor',
		name: 'The central corridor',
		desc: 'You are standing in a long, dimly-lit hallway. Do you want to walk forward?',
		next: 'armory',
		run: function (done) {
			cmdFld.on('command', function (evt, cmd) {
				if (isYes(cmd)) {
					done();
				}
			});
		}
	}),
	Object.assign(Object.create(Scene), {
		id: 'armory',
		name: 'The armory',
		desc: 'You are surrounded by futuristic-looking weapons. How many would you like to pick up?',
		next: 'death',
		run: function (done) {
			cmdFld.on('command', function (evt, cmd) {
				if (cmd === '1' || cmd === '2') {
					display('You picked up ' + cmd + ' weaponz.');
					done();
				} else if (parseInt(cmd, 10) > 2) {
					display('That\'s too many guns for you to carry.');
				}
			});
		}
	}),
	Object.assign(Object.create(Scene), {
		id: 'death',
		name: 'Death',
		desc: 'Too bad, you died.',
		next: 'finished',
		run: function (done) {
			setTimeout(done, 1000);
		}
	}),
	Object.assign(Object.create(Scene), {
		id: 'finished',
		name: 'Completed',
		desc: 'You won! Good job.'
	})
];

// MAP / KICK-OFF

var Map = {
	scenes: sceneList.reduce(function (acc, cur) {
		acc[cur.id] = cur;
		return acc;
	}, {}),
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
		var cmd = cmdFld.val();

		display(cmd);
		cmdFld.trigger('command', [cmd]);
	});

	cmdFld.focus();

	Map.setOpening('centralCorridor');
	Engine.start(Map);
	Engine.play();

});
