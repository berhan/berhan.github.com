//functions to provide some globally used utilities like creating table, determining a suffix according to name etc...

//through game, this objects are shown. drawing bottle doesn't mean controlling it, followMouse from /js/animation.js provides it
//and it is called just from readyToRotate from /js/gameplay.js
function displayGameArea(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle); //this doesn't start rotation, just redraw bottle at given angle
	backToMainMenuButton();
}

//displays "Ana Menu" button. If the player is in a game, it asks for confirmation to leave game and return to the main menu.
//to modify confirmation dialog and its actions see displayDialog
function backToMainMenuButton(){
	$('body').append('<button id="backToMainMenu">Ana Menu</button>');
	$('#backToMainMenu').click(function (){
		if(game.id !== ""){
			displayDialog("exitGame");
		}else{
			game.setState("main"); //this doesn't affect server's state. Check /js/game.js > setState
		}

	});

}

//creates a table with given rows and columns and appends it to the appendObject.
//data is just an array and represented in this way: [row1col1, row1col2, row2col1, row2col2 ... ]
//tableId and tableClass are attributes of <table> tag.
//typeArray is attributes of <td> tags and are passed to cellStyler (see it below) function.
//typeArray is represented in this way: [classOfColumn1, classOfColumn2 ...]
function createTable(appendObject, tableId,  tableClass, rows, columns, data, typeArray){
	var table = $('<table id=' + tableId + ' class=' + tableClass + ' ></table>');
	$(appendObject).append(table);
	for(var c=0; c<columns; c++){ 
		var rowEntry = '<tr>';
		for (var r = 0; r<rows; r++){
			rowEntry += cellStyler(typeArray[r], c, data[c*rows+r]); //since every column has different types, they should have id's according to their row
		}	
		rowEntry += '</tr>';
		$('#'+tableId).append(rowEntry);
	}
}

//gives classes and contents of table cells (so, their styles)
//cellClass gives the class of td but also can change it its contents, like putting an image.
//id's just integers, actual written id's are "cellClass+id". So, if you want to select a particular cell of tables you can use this id's.
//if you just want to take related information about that row, probably gameId or playerId is enough. You can add them the firs column of
//tables and hide with CSS. See /js/gameplay.js > waitForOthers > displayInviteList. click binding of inviteButton is a an example of such action
function cellStyler(cellClass, id, cellData){
	if(cellClass === 'capacityIndicator'){
		cellData += ' Kişi Oynuyor';
	}else if(cellClass === 'gameCapacityStatus'){
		if(cellData !== 'Dolu')
			cellData += ' Kişi';
	}else if(cellClass === 'playerPictureCell'){
		cellData = '<img height=50 width=50 src=' + cellData + ' ></img>';
	}else if(cellClass === 'playerInviteCell'){
		cellData = cellData + ' <button class=inviteButton id=inviteButton'+id+' >Davet Et</button>';
	}
	return '<td class=' + cellClass + ' id=' + cellClass + id + ' >' + cellData +'</td>';
}

//display playing people list and append it to appendObject (generally sideMenuDiv)
//gets player list from game menu directly and create appropriate data array using fb object. If there is a server side player list, a web service
//may be written for it.
//representation of playerListData: [player1Id(hidden), player1PictureURL, player1Name, player2Id(hidden), ...]
function displayPlayerList(appendObject){
	$(appendObject).append('<div id="playerDiv" class="playerListDiv"></div>');
	var playerList = game.players;
	var typeArray = ['playerIdCell','playerPictureCell', 'playerNameCell'];
	var headerArray = ['Oyundakiler'];
	var playerListData = [];
	for (var ply in playerList){
		playerListData.push(playerList[ply]);
		playerListData.push(fb.getProfilePicture(playerList[ply]));
		playerListData.push(fb.getName(playerList[ply]));
	}
	createTable( '#playerDiv','playerSideListHeader', 'playerListTableHeader', 1, 1, headerArray, '');
	createTable( '#playerDiv','playerSideList', 'playerListTable', 3, playerList.length, playerListData, typeArray);

	$('#playerDiv .playerNameCell').click(function(){
		console.log("fyuu");
	});

}

//append a messageDiv with given message and appends it to given object (generally sideMenuDiv)
//to change the look of this messages look /style/styles.css > .messageDiv
function displayMessage(appendObject, messsage){
	$(appendObject).append('<div class="messageDiv"></div>');
	$('.messageDiv').html(messsage);
}

//displays a modal dialog according to given type. If you changed the dimensions of game area, change height and width variables
//If you want to change the positon of dialogs, look at the very bottom of this function and change the proportions.
function displayDialog(type){
	var height = 600;
	var width = 760;
	$('body').append('<div class="dialogBackground"></div>');
	$('body').append('<div class="dialogContainer"></div>');

	if(type === "exitGame"){
		$('.dialogContainer').append('<p class="dialogMessage">Cikmak istedigine emin misin?</p>');
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Evet</button>');
		$('.dialogContainer').append('<button id="dialogNo" class="dialogButton">Hayir</button>');
		$('#dialogYes').click(function(){
			exitGame();
		});
		$('#dialogNo').click(function(){
			updateView(); //since game state didn't change, it draws real game area and close dialog
		});

	}else if(type === "selectionOfType"){
		$('.dialogContainer').append('<p class="dialogMessage">Gercek mi, Cesaret mi?</p>');
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Gercek</button>');
		$('.dialogContainer').append('<button id="dialogNo" class="dialogButton">Cesaret</button>');
		$('#dialogYes').click(function(){
			game.type = "gercek";
			console.log("gercek");
			game.setState("decideAction");
			sendRotationVariables(false);
		});
		$('#dialogNo').click(function(){
			game.type = "cesaret";
			console.log("cesaret");
			game.setState("decideAction");
			sendRotationVariables(false);
		});

	}else if(type === "decideAction"){
		if(game.type === "gercek"){
			$('.dialogContainer').append('<p class="dialogMessage">'+fb.getName(game.pointed)+'\'den ne ogrenmek istersin?</p>');
		}else{
			$('.dialogContainer').append('<p class="dialogMessage">'+fb.getName(game.pointed)+'\'nin ne yapmasini istersin?</p>');
		}
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<textarea id="decideActionBox"></textarea>');
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<span></span><button id="dialogYes" class="dialogButton">Gonder</button>');
		$('#dialogYes').click(function(){
			if($('#decideActionBox').val().length > 0){
				game.action = $('#decideActionBox').val();
				game.setState("takeAction");
				sendRotationVariables(false);
				console.log(game.action);
			}else{
				$('.dialogMessage').text("Lütfen giriş yapınız...");
			}
		
		});

	}else if(type === "takeAction"){
		if(game.type === "gercek"){
			$('.dialogContainer').append('<p class="dialogMessage">'+fb.getName(game.rotater)+' sana bunu sordu:</p>');
		}else{
			$('.dialogContainer').append('<p class="dialogMessage">'+fb.getName(game.rotater)+' senden bunu istedi:</p>');
		}
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<p class="dialogText">'+game.action+'</p>');
		$('.dialogContainer').append('<br>');
		if(game.type === "gercek"){
			$('.dialogContainer').append('<p class="dialogText">Cevabın?</p>');
			$('.dialogContainer').append('<br>');
			$('.dialogContainer').append('<textarea id="decideActionBox"></textarea>');
			$('.dialogContainer').append('<br>');
			$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Gonder</button>');
			$('.dialogContainer').append('<button id="dialogNo" class="dialogButton">Olmaz</button>');
		}else{
			$('.dialogContainer').append('<p class="dialogText">Gerceklestirdin mi?</p>');
			$('.dialogContainer').append('<br>');
			$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Yaptim</button>');
			$('.dialogContainer').append('<button id="dialogNo" class="dialogButton">Olmaz</button>');
		}
		$('#dialogYes').click(function(){
			if($('#decideActionBox').val().length > 0){
				game.answer = $('#decideActionBox').val();
				game.setState("evaluateAction");
				sendRotationVariables(false);
			}else{
				$('.dialogMessage').text("Lütfen giriş yapınız...");
			}
		});
		$('#dialogNo').click(function(){
			game.answer = " ";
			game.setState("failureEnd");
			console.log("reddediyorum");
		});

	}else if(type === "evaluateAction"){
		$('.dialogContainer').append('<p class="dialogMessage">Onayliyor musun?</p>');
		//$('.dialogContainer').append('<p class="dialogText">'+game.action+'</p>');
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Evet</button>');
		$('.dialogContainer').append('<button id="dialogNo" class="dialogButton">Hayir</button>');
		$('#dialogYes').click(function(){
			// game.action = $('#decideActionBox').val();
			game.setState("successEnd");
			sendRotationVariables(false);
			console.log("onay");
		});
		$('#dialogNo').click(function(){
			game.setState("failureEnd");
			sendRotationVariables(false);
			console.log("red");
		});

	}else if(type === "successEndPointed"){
		$('.dialogContainer').append('<p class="dialogMessage">:)</p>');
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Devam</button>');
			$('#dialogYes').click(function(){
			game.rotater = game.pointed;
			game.setState("newTurn");
			sendRotationVariables(false);
		});	

	}else if(type === "successEndOthers"){
		$('.dialogContainer').append('<p class="dialogMessage">:)</p>');
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<p class="dialogMessage">Yeni tur icin '+fb.getName(game.pointed)+' bekleniyor</p>');

	}else if(type === "failureEndPointed"){
		$('.dialogContainer').append('<p class="dialogMessage">:(</p>');
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Devam</button>');
		$('#dialogYes').click(function(){
			game.rotater = game.pointed;
			game.setState("newTurn");
			sendRotationVariables(false);
		});

	}else if(type === "failureEndOthers"){
		$('.dialogContainer').append('<p class="dialogMessage">:(</p>');
		$('.dialogContainer').append('<br>');
		$('.dialogContainer').append('<p class="dialogMessage">Yeni tur icin '+fb.getName(game.pointed)+' bekleniyor</p>');
	}else if(type === "pointedYourself"){
		$('.dialogContainer').append('<p class="dialogMessage">Sana geldi. Tekrar çevirmelisin...</p>');
		setTimeout(function(){
			sendRotationVariables(false); 
			game.setState("readyToRotate");}
			, 2000);
	}

	var width = (width - $('.dialogContainer').outerWidth()) / 2;
	var height = (height - $('.dialogContainer').outerHeight()) / 2;
	$('.dialogContainer').offset({ top: height, left: width});
}

//returns the name with appropriate suffix like berhan'in, ali'nin, osman'ın...
function nameWithSuffix(name){
	var suffix = "'";
	var vowSet0 = "aıou";
	var vowSet1 = "eiöü";
	var vowels = vowSet0+vowSet1;
	var lastLetter = name[name.length-1];
	console.log(lastLetter);
	var lastVowel;
	
	for(var i = name.length-1; i >= 0; i--){
		if(vowels.indexOf(name[i]) != -1){
			lastVowel = name[i];
			break;
		}
	}

	if (vowels.indexOf(lastLetter) !== -1) {
		suffix += "n";
	}

	if(vowSet1.indexOf(lastVowel) !== -1){
		suffix += "in";
	}else{
		suffix += "ın";
	}

	return name+suffix;
}