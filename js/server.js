//server object class
function Server(){
	this.gameList = {
		index: [123, 124, 125, 126, 127],
		g123: {id : "g123", name : "Oyun 1", lastUpdate: 0, state : "readyToRotate", owner: "1183491185", capacity : 4, players: ["550410621", "558707356", "567978009"], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		g124: {id : "g124", name : "Oyun 2", lastUpdate: 0, state : "wfo", owner: "550410621", capacity : 8, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		g125: {id : "g125", name : "Oyun 3", lastUpdate: 0, state : "wfo", owner: "550410621", capacity : 6, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		g126: {id : "g126", name : "Oyun 4", lastUpdate: 0, state : "wfo", owner: "550410621", capacity : 8, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		g127: {id : "g127", name : "Oyun 5", lastUpdate: 0, state : "wfo", owner: "550410621", capacity : 6, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""}
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

	this.addInvitation = function(invitedId, inviterId, gameId) {
		if(this.inviteList[gameId] === undefined){
			this.inviteList[gameId] = {};
		}
		this.inviteList[gameId][invitedId] = inviterId;
	}

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

	this.getLastUpdate = function(gameId){
		return this.gameList[gameId].lastUpdate;
	}

	this.getState = function(id){
		if(id === undefined || id === ""){
			return ""; //no game
		}else{
			return this.gameList[id].state;
		}
		//return this.state;
	}

	this.getName = function(id){
		return this.gameList[id].name;
	}

	this.getPlayerCount = function(id){
		return this.gameList[id].players.length;
	}

	this.getGameList = function(id){
		var gameListArr = [];
		for (var g in this.gameList) {
		    if (this.gameList.hasOwnProperty(g) && g !== "index" ){
		    	gameListArr.push(g);
		        gameListArr.push(this.gameList[g].name);
		        gameListArr.push(this.gameList[g].capacity);
		        gameListArr.push(this.getPlayerCount(g));
		    }
		}
		return gameListArr;
	}

	this.getRotationAngle = function(id){
		return this.gameList[id].rotationAngle;
	}

	this.getVelocity = function(id){
		return this.gameList[id].velocity;
	}

	this.getFriction = function(){
		return Math.random()* 0.001 + 0.008;
	}

}