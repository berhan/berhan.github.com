//game object class
function Game(id){
	this.id;
	this.name;
	this.lastUpdate;	//when games fields updated last time
	this.state;			//game state, all list can be found at /js/definitions.js > states
	this.owner;			//player who created the game
	this.capacity;		//player limit of the game
	this.players;		//array of player's ids.
	this.rotationAngle;	//which angle that bottle points. This variable is also used to share starting point of rotation to other players.
	this.velocity;		//how many angles the bottle passes per refresh
	this.rotator;		//id of the player who's the rotator of that particular turn.
	this.pointed;		//id of the player who's pointerd in that particular turn.
	this.type;			//"gercek" or "cesaret"
	this.action;		//action or question of rotator
	this.answer;		//answer of pointed player
	
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
		this.rotator = "";
		this.pointed = "";
	}

	//synchronizes game fields according to server's values.
	this.syncGameFields = function(){
		var isChanged = false;
		$('#event-handler').on("getGame", function(response){
			console.log("sync to this game: " + response.game);
			serverSideGame =  response.game;
			if(serverSideGame.lastUpdate > game.lastUpdate){
				for (var field in serverSideGame) {
					if (serverSideGame.hasOwnProperty(field)) {
						if(game[field] != serverSideGame[field]){
							game[field] = serverSideGame[field]; //scope changed here. Now, "this" refers to the "event-handler", so use "game" variable
							isChanged = true;
						}					
					}
				}
			}
			
			$('#event-handler').trigger({
				type: "gameUpdate",
				isChanged: isChanged
			});
			
			$('#event-handler').off("getGame");
		});
		server.getGame(this.id);

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
