//game object class
function Game(id){
	this.id;
	this.name;
	this.lastUpdate;	//when games fields uptadated last time
	this.state;			//game state, all list can be found at /js/definitions.js > states
	this.owner;			//player who created the game
	this.capacity;		//player limit of the game
	this.players;		//array of player's ids.
	this.rotationAngle;	//which angle that bottle points. This variable is also used to share starting point of rotation to other players.
	this.velocity;		//how many angles the bottle passes per refresh
	this.rotater;		//id of the player who's the rotater of that particular turn.
	this.pointed;		//id of the player who's pointerd in that particular turn.

	//construction of the game object
	if(id !== "" && id !== undefined){
		syncGameFields();
	}else{
		this.id = "";
		this.name = "";
		this.lastUpdate = 0;
		this.state = "main";
		this.owner = "";
		this.capacity = "";
		this.players = [];
		this.rotationAngle = 0;
		this.velocity = 0;
		this.rotater = "";
		this.pointed = "";
	}

	//syncs game fields according to server's values.
	this.syncGameFields = function(){
		var isChanged = false;
		for (var field in server.gameList[this.id]) {
			if (server.gameList[this.id].hasOwnProperty(field)) {
				this[field] = server.gameList[this.id][field];
				isChanged = true;
			}
		}
		return isChanged;
	}

	//sets states and updates player view. This function is used when client doesn't synced with server, such as traversing menus.
	this.setState = function (newState){
		if(newState !== game.state){
			this.state = newState;
			updateView();
		}
	}

	//returns how many players are present in the game
	this.getPlayerCount = function(){
		return this.players.length;
	}

	//calculates where the bottle pointing according to rotation angle
	this.getPointedPlayer = function(){
		//initially canvas draws it at +90 degree position
		var rotationResult = (game.rotationAngle - 90) % 360;
		if(rotationResult < 0){		//to handle reverse direction.
			rotationResult += 360;
		}

		//(360/game.capacity) is how many angle every player gets in the chart
		return game.players[Math.floor(rotationResult / (360 / game.capacity))]; 
	}

	//checks the given id is present in the game
	this.isPlaying = function(id){
		if(this.players !== undefined){
			for( var ply in this.players){
				if(this.players[ply] === id){
					return true;
				}
			}
		}
		return false;
	}
}
