function clearPage(){
	$('body > :not(#canvas)').remove();
	ctx.clearRect(0,0,canvas.width,canvas.height);
	stopRotation();
}
function displayMainMenu(){
	viewState = viewStates[0];
	createMainMenuButtons();
	//$(".mainMenuButton").show();
	setMainMenuButtonsActions();
}

function backToMainMenuButton(){
	var button = $('<button id="backToMainMenu">Ana Menu</button>');
	$('body').append(button);
	$('#backToMainMenu').click(function (){
		goToMainMenu();
	});
}

function goToMainMenu(){
	clearPage();
	displayMainMenu();
}

function displayChooseGameMenu(){
	clearPage();
	backToMainMenuButton();
	var gamesList = getGamesList();
	console.log(gamesList.length);
	var typeArray = ['gameListButton', 'gameCapacityStatus', 'capacityIndicator'];
	var headerArray = ['Acik Oyunlar', 'Durum', ''];
	//createTable('gamesList', 'gamesListTable',headerArray, 3, 4, gamesList, typeArray);
	createTable('body','gameListInitial', 'gamesListTable', 3, 4, gamesList, typeArray);
}

function displayGameSideMenu(){
	var sideMenuDiv = $('<div id="sideMenu" class=sideMenuDiv></div>');
	$('body').append(sideMenuDiv);
	displayPlayerList(sideMenuDiv);
	displayInviteList(sideMenuDiv);
}

function displayPlayerList(appendObject){
	var playerDiv = $('<div id="playerDiv" class="playerListDiv"></div>');
	$(appendObject).append(playerDiv);
	var playerList = getPlayerList();
	var typeArray = ['playerPictureCell', 'playerNameCell'];
	var headerArray = ['Oyundakiler'];
	var playerListData = [];
	for (var player in playerList){
		playerListData.push(getPlayerPicture(player));
		playerListData.push(getPlayerName(player));
	}
	createTable( '#playerDiv','playerSideListHeader', 'playerListTableHeader', 1, 1, headerArray, '');
	createTable( '#playerDiv','playerSideList', 'playerListTable', 2, playerList.length, playerListData, typeArray);
}

function displayInviteList(appendObject){
	var invitePlayerDiv = $('<div id="invitePlayerDiv" class="inviteListDiv"></div>');
	$(appendObject).append(invitePlayerDiv);
	var friendList = getFriendList();
	var typeArray = ['playerPictureCell', 'playerNameCell'];
	var headerArray = ['Davet Et'];
	var playerListData = [];
	for (var player in friendList){
		playerListData.push(getPlayerPicture(player));
		playerListData.push(getPlayerName(player));
	}
	createTable( '#invitePlayerDiv','inviteSideListHeader', 'playerListTableHeader', 1, 1, headerArray, '');
	createTable( '#invitePlayerDiv','inviteSideList', 'playerListTable', 2, friendList.length, playerListData, typeArray);
}


function createTable(appendObject, tableId,  tableClass, rows, columns, data, typeArray){
	var table = $('<table id=' + tableId + ' class=' + tableClass + ' ></table>');
	//var table = $('<table class=' + tableClass + ' ></table>');
	$(appendObject).append(table);
	for(var c=0; c<columns; c++){ 
		var rowEntry = '<tr>';
		for (var r = 0; r<rows; r++){
			rowEntry += cellStyler(typeArray[r], c*rows+r, data[c*rows+r]);
			//rowEntry += '<td class=gameListButton>' + data[c*rows+r] + '</td>';
		}	
	rowEntry += '</tr>';
	$('#'+tableId).append(rowEntry);
	}
}

function cellStyler(cellClass, id, cellData){
	if(cellClass === 'capacityIndicator'){
		cellData += cellData + ' Kisi Oynuyor';
	}else if(cellClass === 'playerPictureCell'){
		cellData = '<img height=50 width=50 src=' + cellData + ' ></img>';
	}
	return '<td class=' + cellClass + ' id=' + cellClass + id + ' >' + cellData +'</td>';
}

function createMainMenuButtons(){
	var startNow = '<button id="startNow" class="mainMenuButton">Hemen Basla</button>';
	var createGame = '<button id="createGame" class="mainMenuButton">Oyun Baslat</button>';
	var chooseGame = '<button id="chooseGame" class="mainMenuButton">Oyun Sec</button>';
	var howToPlay = '<button id="howToPlay" class="mainMenuButton">Nasıl Oynanır?</button>';
	$('body').append(startNow);
	$('body').append(createGame);
	$('body').append(chooseGame);
	$('body').append(howToPlay);
}

function setMainMenuButtonsActions(){
	/*$('.mainMenuButton').click(function(){
		//$('.mainMenuButton').hide();
		clearPage();
	});*/
	$('#startNow').click(function(){
		//newTurn();
		displayRotatingPlayerSelection()
		//clearInterval(intervalOfRotation);
		//newTurn();
	});

	$('#createGame').click(function(){
		displayGameSideMenu();
		//drawChart();
	});

	$('#chooseGame').click(function(){
		displayChooseGameMenu();
		//newTurn();
		//drawChart();
	});

	$('#howToPlay').click(function(){
		//newTurn();
		//drawChart();
	});

}

function displayRotatingPlayerSelection(){
	//gameState = gameStates[4];
	viewState = viewStates[3];
	clearPage();
	backToMainMenuButton();
	updateCanvas();
	incrementAngle = 3;
	rotationAngle = Math.random() * 360;
	friction = Math.random()* 0.001 + 0.008;
	rotateBottle('');
	console.log(rotationAngle+"\n");
	//bottleMouseControl();
	console.log('ney');
	//startSpinning('chooseRotatingPlayer');
}

//draws the pie-chart-like area
function drawChart(){
	for( i = 0; i < playerCount; i++){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, chartRadius, i*portion, (i+1)*portion, false);
		ctx.closePath();
		ctx.fillStyle = colorPalette[i];
		ctx.fill();
		ctx.restore();
	}
				
}

function drawBottle(){
	//arrowSize 240
	var height = 2*arrowSize;
	var width = 2*height/3;
	ctx.scale(1,-1);
	ctx.scale(-1,1);
	ctx.shadowColor = "rgba(80,80,80, 1)";
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.drawImage(bottle, -(width/2), -(height/2), width, height);
	ctx.scale(1,-1);
	ctx.scale(-1,1);
}

function bottleMouseControl(){
	 $(bottle).click(function(event){
	 	//console.log(event.pageX + ' - ' + event.pageY);
	 	console.log('hey');
	 });
	 	
        // var mouseLeft = (event.pageX - centerX);
        // var mouseTop = (event.pageY - centerY);
        // var correctTop = (centerTop - mouseTop);
        // var correctLeft = (mouseLeft - centerLeft);
        // var rawAngle = (180/Math.PI) * Math.atan2(correctTop,correctLeft);
        // var intAngle = parseInt(rawAngle, 10);
        // var msg = '';
        // msg += (mouseTop >= centerTop) ? ' lower ' : ' upper ';
        // msg += (mouseLeft >= centerLeft) ? ' right ' : ' left ';
        // msg += intAngle;
        // $('#log').prepend('<div>' + msg + '</div>');

}

function rotateBottle(stopFunction){
	updateCanvas();
	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate(Math.PI * rotationAngle / 180);
	//ctx.rotate(-90 * Math.PI / 180);
	//drawArrow();
	drawBottle();
	rotationAngle += incrementAngle;
	incrementAngle -= friction;
	ctx.restore();
	if(incrementAngle < 0){	//avoid turning to reverse direction
		stopRotation(stopFunction);
	}
}

function stopRotation(stopFunction){
	clearInterval(intervalOfRotation);
	//ctx.clearRect(0,0,canvas.width,60);  
	//rotationResult = (rotationAngle - initialAngle) % 360;
	rotationResult = rotationAngle % 360;
	//pointedPlayer = choosePlayer();
	//ctx.fillText('Result: '+ rotationResult + ' Player: ' + pointedPlayer, 10 ,20);
	//ctx.fillText('Total: '+ rotationAngle , 10 ,40);
	//startGameDialogs();
	if(stopFunction === 'chooseRotatingPlayer'){
		chooseRotatingPlayer();
	}else if(stopFunction === 'choosePointedPlayer'){
		choosePointedPlayer();
	}else{

	}
}


function updateCanvas(){
	ctx.clearRect(0,0,canvas.width,canvas.height); //clears all canvas
	drawChart();
	//displayStatusBar();		//the information about arrow's movement
	//drawArrow();
}

function rotateButton(){
	var rotateBottle = '<button id="rotateBottle" class="rotateBottle">Cevir</button>';
	$('body').append(rotateBottle);
}


function roundRect(x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == "undefined" ) {
		stroke = true;
	}
	if (typeof radius === "undefined") {
		radius = 5;
	}
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	if (stroke) {
		ctx.stroke();
	}
	if (fill) {
		ctx.fill();
	}        
}