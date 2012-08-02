//yedek class functions

// Server.prototype.setState = function(newState){
// 	if(game.id !== "" || game.id !== undefined){
// 		this.gameList[game.id].state = newState;
// 	}
// }

// Server.prototype.setVelocity = function(newVelocity){
// 	if(game.id !== "" && game.id !== undefined){
// 		this.gameList[game.id].velocity = newVelocity;
// 	}
// }

// Server.prototype.setRotationAngle = function(newAngle){
// 	if(game.id !== "" && game.id !== undefined){
// 		this.gameList[game.id].rotationAngle = newAngle;
// 	}
// }

// Server.prototype.setFriction = function(newFriction){
// 	if(game.id !== "" && game.id !== undefined){
// 		this.gameList[game.id].friction = newFriction;
// 	}
// }


// Server.prototype.getState = function(id){
// 	if(id === undefined || id === ""){
// 		return ""; //no game
// 	}else{
// 		return this.gameList[id].state;
// 	}
// 	//return this.state;
// }

// Server.prototype.getName = function(id){
// 	return this.gameList[id].name;
// }

// Server.prototype.getCount = function(id){
// 	return this.gameList[id].count;
// }

// Server.prototype.getGameList = function(id){
// 	var gameListArr = [];
// 	for (var g in this.gameList) {
// 	    if (this.gameList.hasOwnProperty(g)) {
// 	        gameListArr.push(this.gameList[g].name);
// 	        gameListArr.push(this.gameList[g].playerCount);
// 	    }
// 	}
// 	return gameListArr;
// }

// Server.prototype.getRotationAngle = function(id){
// 	return this.gameList[id].rotationAngle;
// }

// Server.prototype.getVelocity = function(id){
// 	return this.gameList[id].velocity;
// }

// Server.prototype.getFriction = function(){
// 	return Math.random()* 0.001 + 0.008;
// }


// Game.prototype.setState = function (newState){
// 	if(newState !== game.state){
// 		if(this.id !== ""){ //Buraları kontrol et!!
// 			this.state = server.getState(this.id);
// 		}else{
// 			this.state = newState;
// 		}
// 		updateView();
// 	}
// }


// FbObj.prototype.auth = function(){
// 	return this.userId;
// }

// FbObj.prototype.getProfilePic = function(id){
// 	// if(this.userId !== undefined){
// 	// 	return this.userList[this.userId].picture;
// 	// }else{
// 	// 	return undefined;
// 	// }
// 	return this.userList[id].picture;
// }