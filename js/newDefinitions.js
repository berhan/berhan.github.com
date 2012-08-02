var server;
var fb; //faux facebook integration
var game;
var player;

var serverStateSync; //updateState interval variable
var animationRefresh; //rotating interval variable

var canvas;
var ctx;

var centerX;
var centerY;

var envFriction;
var envStopThreshold;
var envMinSpeed;

var mouseMovement = 0;

var colorPalette = ["#DF0101", "#FF8000", "#298A08", "#01A9DB", "#A901DB", "#0404B4", "#86B404", "#FFFF00", "#F5A9F2", "#81F7D8", "#8181F7"]; //will be grown

//object which keeps state functions
var states = {
	//auth: function(){ auth(); },
	main: function(){ mainMenu(); },
	chooseGame: function(){ chooseGame(); },
	enterGame: function(){ enterGame("g123"); },
	createGame: function(){ createGame(); },
	waitingForOthers: function(){ waitForOthers(); },
	chooseFirstPlayer: function(){ chooseFirstPlayer(); },
	newTurn: function(){ newTurn(); },
	readyToRotate: function(){ readyToRotate(); },
	rotating: function(){ rotating(); },
	//stopped: function(){ stopped();},
	selectionOfType: function(){ selectionOfType(); },
	decideAction: function(){ decideAction(); },
	takeAction: function(){ takeAction(); },
	evaluateAction: function(){ evaluateAction(); },
	successEnd: function(){ successEnd(); },
	failureEnd: function(){ failureEnd(); },
	wfo: function(){ console.log("bey");}
};

//server object class
function Server(){
	this.gameList = {
		index: [123, 124, 125, 126, 127],
		g123: {id : "g123", name : "Oyun 1", lastUpdate: 0, state : "readyToRotate", owner: "p123", capacity : 4, players: ["p124", "p125", "p126"], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		g124: {id : "g124", name : "Oyun 2", lastUpdate: 0, state : "wfo", owner: "p124", capacity : 8, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		g125: {id : "g125", name : "Oyun 3", lastUpdate: 0, state : "wfo", owner: "p124", capacity : 6, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		g126: {id : "g126", name : "Oyun 4", lastUpdate: 0, state : "wfo", owner: "p124", capacity : 8, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""},
		g127: {id : "g127", name : "Oyun 5", lastUpdate: 0, state : "wfo", owner: "p124", capacity : 6, players: [], rotationAngle: 0, velocity: 3, rotater:"" , pointed: ""}
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
		        gameListArr.push(this.gameList[g].name);
		        gameListArr.push(this.gameList[g].capacity);
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

	// this.state = "main"; 
	//this.rotationAngle = 0;
}

//virtual, basic facebook integration class
function FbObj(){
	this.userList = {
		p123: {id : "p123", name : "Ali", surname :	"Yilmaz", gender: "male", picture: "images/prf/5.png", friends: ["p124", "p127", "p128", "p129", "p132"]}, 
		p124: {id : "p124", name : "Veli", surname : "Yilmaz", gender: "male", picture: "images/prf/4.jpg", friends: ["p123", "p126", "p130", "p131"]},
		p125: {id : "p125", name : "Ayse", surname : "Yilmaz", gender: "female", picture: "images/blank-profile.jpg", friends: ["p126", "p127", "p130", "p131"]},
		p126: {id : "p126", name : "Fatma", surname : "Yilmaz", gender: "female", picture: "images/blank-profile.jpg", friends: ["p124", "p125", "p128", "p129"]},
		p127: {id : "p127", name : "Hayriye", surname : "Yilmaz", gender: "female", picture: "images/prf/2.jpg", friends: ["p123", "p125", "p132"]},
		p128: {id : "p128", name : "Hayri", surname :	"Yilmaz", gender: "male", picture: "images/prf/3.jpg", friends: ["p123", "p126", "p132"]}, 
		p129: {id : "p129", name : "Kadri", surname : "Yilmaz", gender: "male", picture: "images/blank-profile.jpg", friends: ["p123", "p126", "p130"," p132"]},
		p130: {id : "p130", name : "Aliye", surname : "Yilmaz", gender: "female", picture: "images/blank-profile.jpg", friends: ["p124", "p125", "p129", "p131"]},
		p131: {id : "p131", name : "Veliye", surname : "Yilmaz", gender: "female", picture: "images/blank-profile.jpg", friends: ["p124", "p125", "p130"]},
		p132: {id : "p132", name : "Kadriye", surname : "Yilmaz", gender: "female", picture: "images/prf/1.jpg", friends: ["p123", "p127", "p128", "p129"]}
	};

	this.auth = function(id){
		if(fb.userList[id] !== undefined){
			return true;
		}
		else{
			return false;
		}
	}

	this.getName = function(id){
		return this.userList[id].name;
	}

	this.getSurname = function(id){
		return this.userList[id].surname;
	}

	this.getGender = function(id){
		return this.userList[id].gender;
	}

	this.getProfilePicture = function(id){
		return this.userList[id].picture;
	}

	this.getFriends = function(id){
		return this.userList[id].friends;
	}
}

//game object class
function Game(id){
	if(id !== "" && id !== undefined){
		syncGameFields();
	}else{
		this.id = "";
		this.state = "main";
	}

	this.lastUpdate = -1;
	this.rotationAngle = 0;

	this.setState = function (newState){
		if(newState !== game.state){
			this.state = newState;
			updateView();
		}
	}

	this.getPlayerCount = function(){
		return this.players.length;
	}

	this.getPointedPlayer = function(){
		//initially canvas draws it at +90 degree position
		//also rotation clockwise, so to follow tradition of coordinate system, negative value of rotation angle is taken
		var rotationResult = (game.rotationAngle - 90) % 360;
		if(rotationResult < 0){
			rotationResult += 360;
		}

		return game.players[Math.floor(rotationResult / (360 / game.capacity))];
	}

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


//player object class
function Player(id){
	this.id = id;
	this.name = fb.getName(id);
	this.surname = fb.getSurname(id);
	this.gender = fb.getGender(id);
	this.picture = fb.getProfilePicture(id);

	this.getId = function(){
		return this.id;
	}

	this.getName = function(){
		return this.name;
	}

	this.getSurname = function(){
		return this.surname;
	}

	this.getGender = function(){
		return this.gender;
	}

	this.getProfilePicture = function(){
		return this.picture;
	}

	this.change = function(playersArr){
		$('body').append('<select id="changePlayer"></select>');
		$('#changePlayer').append('<option value="choose" >Choose</option>');
		for(var ply in playersArr){
			if(playersArr[ply] !== this.id){
				$('#changePlayer').append('<option value='+playersArr[ply]+' >'+fb.getName(playersArr[ply])+'</option>');
			}
		}
		$('#changePlayer').change( function(){
			var newPlayer = $('#changePlayer option').filter(":selected").val();
			if(newPlayer !== "choose"){
				player = new Player(newPlayer);
				//consol.log(this.id);
				updateView();
			}
		})
	}
}