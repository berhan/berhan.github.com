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
