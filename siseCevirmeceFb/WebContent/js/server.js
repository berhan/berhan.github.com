//server object class
//this is a prototype and includes some extra functions to simulate server
//ajax request can be written here
function Server(){
	this.gameList = {
		index: [123, 124, 125, 126, 127],
		"123": {name : "Oyun 1", lastUpdate: 0, state : "readyToRotate", owner: "1183491185", capacity : 4, players: ["550410621", "558707356", "567978009"], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		"124": {name : "Oyun 2", lastUpdate: 0, state : "wfo", owner: "550410621", capacity : 8, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		"125": {name : "Oyun 3", lastUpdate: 0, state : "wfo", owner: "550410621", capacity : 6, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		"126": {name : "Oyun 4", lastUpdate: 0, state : "wfo", owner: "550410621", capacity : 8, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		"127": {name : "Oyun 5", lastUpdate: 0, state : "wfo", owner: "550410621", capacity : 6, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""}
	};
	this.inviteList =  {};

	this.updated = function(gameId){
		var date = new Date();
		var curTime = date.getMilliseconds() + 1000 * date.getSeconds() + 1000 * 60 * date.getMinutes() + 1000 * 60 * 60 * date.getHours();
		this.gameList[gameId].lastUpdate = curTime;
	}

	this.addGame = function(gameName, gameCapacity, ownerId){
		var newId = this.gameList.index[this.gameList.index.length-1] + 1;
		this.gameList.index.push(newId);
		newId = "g"+newId;
		this.gameList[newId] = {id: newId, name: gameName, lastUpdate: 0, state: "waitingForOthers", owner: ownerId, capacity: gameCapacity, players: [ownerId], rotationAngle: 0, velocity: 3, rotater: "", pointed: ""};
		this.updated(newId);
		console.log("game added");
		return newId;
	}

	//adds a player to a game.
	this.addPlayer = function(gameId, playerId){
		if(this.getPlayerCount(gameId) < this.gameList[gameId].capacity){
			this.gameList[gameId].players.push(playerId);
			this.updated(gameId);
			return true;
		}
		else{
			return false;
		}
	}

	//removes a player from a game.
	this.removePlayer = function(gameId, playerId){
		var oldArr = this.gameList[gameId].players;
		var newArr = [];
		for(var i=0; i<oldArr.length; i++){
			if(oldArr[i] !== playerId){
				newArr.push(oldArr[i]);
			}
		}
		this.gameList[gameId].players = newArr;
	}

	//create an invitation in the JSON form. 
	//Object's name is the gameId, invited players is its fields and the the values of this fields are the inviters
	this.addInvitation = function(invitedId, inviterId, gameId) {
		if(this.inviteList[gameId] === undefined){
			this.inviteList[gameId] = {};
		}
		this.inviteList[gameId][invitedId] = inviterId;
	}

	//checks whether a player invited to a particular game according to above model
	this.isInvited = function(invitedId, gameId){
		if(this.gameList[gameId] !== undefined && this.inviteList[gameId] !== undefined){
			if(this.inviteList[gameId][invitedId] !== undefined){
				return this.inviteList[gameId][invitedId];
			}else{
				return 0;
			}
			// var gameId = this.inviteList[invitedId].inviterId;
			// if(gameId !== undefined){
			// 	if(this.gameList[gameId] !== undefined){
			// 		return gameId;
			// 	}else{
			// 		removeInvitation(invitedId, inviterId);
			// 		return 0;
			// 	}
			// }
		}else{
			return 0;
		}
	}

	//remove an invitation from the list
	this.removeInvitation = function(invitedId,gameId){
		delete this.inviteList[gameId][invitedId];
		if(this.inviteList[gameId] === undefined){
			delete this.inviteList[gameId];
		}
	}

	//updates any attributes of a game in server and changes last update time accordingly. 
	this.updateAttr = function (gameId, attrName, value){
		this.gameList[gameId][attrName] = value;
		this.updated(gameId);
	}

	//returns the last update time of the game whose id is given
	this.getLastUpdate = function(gameId){
		return this.gameList[gameId].lastUpdate;
	}

	//returns the state of the game whose id is given
	this.getState = function(id){
		if(id === undefined || id === ""){
			return ""; //no game
		}else{
			return this.gameList[id].state;
		}
		//return this.state;
	}

	//returns the name of the game whose id is given
	this.getName = function(id){
		return this.gameList[id].name;
	}

	//returns the player count of the game whose id is given
	this.getPlayerCount = function(id){
		return this.gameList[id].players.length;
	}

	//returns an array which keeps every game id, name, capacity and how many people are playing
	//used when showing game list to enter
	this.getGameList = function(){
		var gameListArr = [];
		var gameListJson;
		
		$.getJSON('/siseCevirmeceFb/GameServlet?action=0', function(response){
			gameListJson = response;
			
			console.log(gameListJson);
			
			for (var g in gameListJson) {
			    if (gameListJson.hasOwnProperty(g)){
			    	console.log(gameListJson[g]);
			    	gameListArr.push(gameListJson[g].id);				//id
			        gameListArr.push(gameListJson[g].name);				//name
			        gameListArr.push(gameListJson[g].capacity);			//capacity
			        gameListArr.push(gameListJson[g].playerCount);		//player count
			    }
			}
			
			if($('#handler').)
			
			$('#handler').trigger({
				type:"gameListGet", 
				list: gameListArr});
		});

		
	}

	//returns the rotation angle of the game whose id is given
	this.getRotationAngle = function(id){
		return this.gameList[id].rotationAngle;
	}

	//returns the velocity of bottle of the game whose id is given
	this.getVelocity = function(id){
		return this.gameList[id].velocity;
	}

}