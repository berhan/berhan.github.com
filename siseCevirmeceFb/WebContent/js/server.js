//server object class
//this is a prototype and includes some extra functions to simulate server
//ajax request can be written here
function Server(){
	this.inviteList =  {};

	this.updated = function(gameId){
		var date = new Date();
		var curTime = date.getMilliseconds() + 1000 * date.getSeconds() + 1000 * 60 * date.getMinutes() + 1000 * 60 * 60 * date.getHours();
		this.gameList[gameId].lastUpdate = curTime;
	}
	
	this.getGame = function(gameId){
		if(gameId > 0){
			$.getJSON('/siseCevirmeceFb/GameServlet?action=1&gameId='+game.id, function(response){
				console.log("server side game:" + response);
				$('#event-handler').trigger({
					type:"getGame", 
					game: response});
			});
		}
	}

	this.addGame = function(name, capacity, ownerId){
		if(capacity <= 0 || capacity > game_capacity_limit){
			capacity = game_capacity_limit;
		}
		
		if(name == ""){
			return false;
		}
		
		
		$.getJSON('/siseCevirmeceFb/GameServlet?action=2&name='+name+'&capacity='+capacity+'&owner='+ownerId, function(response){
			
			$('#event-handler').trigger({
				type:"createGame", 
				id: response.id});
		});		
	}

	//adds a player to a game.
	this.addPlayerToGame = function(gameId, playerId){
		
		$.getJSON('/siseCevirmeceFb/GameServlet?action=3&gameId='+gameId+'&playerId='+playerId, function(response){
			
			$('#event-handler').trigger({
				type:"addPlayerToGame", 
				player: response});
		});
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
		$.getJSON('/siseCevirmeceFb/PlayerServlet?action=3&invitedId='+ invitedId + '&inviterId=' + inviterId + '&gameId=' + gameId, function(response){
			invitation = response;
			
			console.log(invitation);

			
			$('#event-handler').trigger({
				type:"inviteAdded", 
				invitation: invitation});
		});
	}

	//checks whether a player invited to a particular game according to above model
	this.isInvited = function(invitedId, gameId){
		$.getJSON('/siseCevirmeceFb/PlayerServlet?action=2&invitedId='+ invitedId + '&gameId=' + gameId, function(response){
			invitation = response;
			
			console.log(invitation);

			
			$('#event-handler').trigger({
				type:"isInvited", 
				inviterId: invitation.inviterId});
		});
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
		$.getJSON('/siseCevirmeceFb/GameServlet?action=5&attr='+ attrName + '&gameId=' + gameId + '&value=' + value, function(response){
		});
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

			
			$('#event-handler').trigger({
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