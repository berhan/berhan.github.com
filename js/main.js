window.onload=function() {
		
	canvas = $('#canvas')[0]; 
	ctx = canvas.getContext('2d');

	bottle = document.getElementById("bottle");
	portion = Math.PI*2/playerCount;

	//where is the center of chart placed
	centerX = Math.floor(canvas.width / 2) + 120;
	centerY = Math.floor(canvas.height / 2);

	init();

};

function init(){
		//drawBottle();
		gameState = gameStates[0];
		displayMainMenu();
		//newTurn();
		
}

function mouselog(){
	console.log("hey");
}

function getGamesList(){
	var gamesList = ["Oyun 1", 0, 4,"Oyun 2", 2, 5,"Oyun 3", 2, 2, "Oyun 4", 1, 3];
	console.log(gamesList.length);
	return gamesList;
}

function getPlayerList(){
	var playerList = [111, 112, 113, 114, 115, 116, 117, 118];
	return playerList; 
}

function getFriendList(id){
	var friendList = [111, 112, 113, 114, 115, 116, 117, 118];
	return friendList;
}

function getPlayerPicture(id){
	return "images/blank-profile.jpg";
}

function getPlayerName(id){
	return 'Ali';
}

function newTurn(){
	gameState = gameStates[6]; //rotateBottle //TODO updateGameState function'ı yaz
	//displayGameSideMenu();
	//playingPlayer = Math.floor(Math.random() * playerCount);
	//playerId = playingPlayer;
	incrementAngle = 3;
	rotationAngle = Math.random() * 360;
	friction = Math.random()* 0.001 + 0.008;
	console.log(rotationAngle+"\n");
	playerId = rotatingPlayer;
	if(playerId === rotatingPlayer){
		displayRotationScreen(true);
	}else{
		displayRotationScreen(false);
	}
	//startSpinning();
}

function displayRotationScreen(isRotatable){
	clearPage();
	backToMainMenuButton();
	updateCanvas();
	if(isRotatable){
	rotateButton();
	}else{
		//maybe some text
	}
}

function startSpinning(stopFunction){
	intervalOfRotation = setInterval(function(){ rotateBottle(stopFunction); }, 20);
}

function chooseRotatingPlayer(){
	rotatingPlayer  = choosePlayer();
	console.log('rotating: ' + rotatingPlayer);
	newTurn();
}

function choosePointedPlayer(){
	pointedPlayer = choosePlayer();
}

function choosePlayer(){
	var rotationResult = (-rotationAngle-90) % 360;
	if( rotationResult < 0){
		rotationResult += 360;
	}
	return Math.floor(rotationResult / (360/playerCount));
}

function displayStatusBar(){
	//Set the text font and color
	ctx.fillStyle = 'rgb(50,100,50)';
	ctx.font = "20px Times New Roman";
	
	//Clear the bottom 30 pixels of the canvas
	ctx.clearRect(0,canvas.height-30,canvas.width,30);  
	// Write Text 5 pixels from the bottom of the canvas
	ctx.fillText('Ceviren: '+ playingPlayer ,10 ,canvas.height-5);
	ctx.fillText('Rate: '+ incrementAngle , 100 ,canvas.height-5);
}

