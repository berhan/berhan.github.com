$(document).ready( function () {
	fb = new FbObj();
	authGame();	
});

function authGame(){
	// $('body').append('<div id="authDialog"></div>');
	// $('#authDialog').append('<h1>Sise Cevirmece\'ye Hosgeldin</h1>');
	// $('#authDialog').append('<br>');
	// $('#authDialog').append('<p>Lutfen id giriniz</p>');
	// $('#authDialog').append('<input id="authIdInput" type="text"></input>');
	// $('#authDialog').append('<button id="authGiris">Giris</button>');
	// $("#authIdInput").keyup(function(event){
	// 	if(event.keyCode == 13){
	// 		$("#authGiris").click();
	// 	}
	// });
	// $('#authGiris').click(function(){
	// 	var id = $('#authIdInput').val();
	// 	if(fb.auth(id)){
	// 		init();
	// 	}
	// 	// FB.login();
	// });
	var id = "1183491185";
	if(fb.auth(id)){
		init();
	}
}

function login(me){
	player = new Player(me);
	init();
}

function logout(){

}

function init(){
	server = new Server();
	//game = new Game("");
	//player = new Player();
	//console.log(game.state);

	// canvas = $('#canvas')[0]; 
	// ctx = canvas.getContext('2d');

	//where is the center of chart placed
	centerX = 230;
	centerY = 220;

	//updateView(); //creates the initial view according to game state
	mainMenu();

}


function enterGame(id){
	game.id = id;
	server.addPlayer(id, player.id);
	//game.addPlayer(player.id);
	syncGameFields();
	updateView();
	startServerStateSync();
}

function exitGame(){
		if(serverStateSync !== 0){
			stopServerStateSync();
		}
		if(animationRefresh !== 0){
			stopAnimationRefresh();
		}
		server.removePlayer(game.id, player.id);
		game.id = "";
		game.setState("main");
}

function startServerStateSync(){
	//game.state = "";
	serverStateSync = setInterval(function(){ updateState(); }, 700);
}

function stopServerStateSync(){
	clearInterval(serverStateSync);
	serverStateSync = 0;
}

function syncGameFields(){
	var id = game.id;
	var isChanged = false;
	for (var field in server.gameList[id]) {
		if (server.gameList[id].hasOwnProperty(field)) {
			game[field] = server.gameList[id][field];
			isChanged = true;
		}
	}
	return isChanged;
}

//updates state of the game to the value in the server
function updateState(){
	var id = game.id;
	var oldState = game.state;
	if(serverStateSync != 0 && game.lastUpdate < server.getLastUpdate(id)){
		if(syncGameFields()){
			//game.setState(server.getState(id));
			console.log(game.state);
			updateView();
		}
	}
}

function updateView(){
	clearView();
	//console.log(player.id);
	if(game.state !== "rotating"){
		player.change(game.players);
	}
	states[game.state]();
}

function clearView(){
	if(game.state !== "rotating"){
		//$('body > :not(#canvas)').remove();
		$('body > :not(#area)').remove();
	}else{
		$('#bottle').remove();
	}
	//ctx.clearRect(0,0,canvas.width,canvas.height);
}

function mainMenu(){
	game = new Game("");
	
	$('body').append('<button id="startNow" class="mainMenuButton">Hemen Basla</button>');
	$('body').append('<button id="createGame" class="mainMenuButton">Oyun Baslat</button>');
	$('body').append('<button id="chooseGame" class="mainMenuButton">Oyun Sec</button>');
	$('body').append('<button id="howToPlay" class="mainMenuButton">Nasıl Oynanır?</button>');

	$('#startNow').click(function(){
		game.setState("enterGame");
	});

	$('#createGame').click(function(){
		game.setState("createGame");
	});

	$('#chooseGame').click(function(){
		game.setState("chooseGame");
	});

	$('#howToPlay').click(function(){
	});

}

function backToMainMenuButton(){
	$('body').append('<button id="backToMainMenu">Ana Menu</button>');
	$('#backToMainMenu').click(function (){
		if(game.id !== ""){
			displayDialog("exitGame");
		}else{
			game.setState("main");
		}

	});

}


function chooseGame(){
	//clearPage();
	backToMainMenuButton();
	var gameList = server.getGameList();
	for(var i=2; i<gameList.length; i+=4){
		var cap = gameList[i] - gameList[i+1]; //capacity - playerslist.length
		if(cap === 0 )
			gameList[i] = "Dolu";
		else
			gameList[i] = cap;
	}
	var typeArray = ['gameIdCell', 'gameListButton', 'gameCapacityStatus', 'capacityIndicator'];
	// var headerArray = ['Acik Oyunlar', 'Durum', 'Oyuncu Sayısı'];
	//createTable('gamesList', 'gamesListTable',headerArray, 3, 4, gamesList, typeArray);
	createTable('body','gamesListTable', 'gamesListTable', 4, gameList.length/4, gameList, typeArray);

	$('.gameListButton, .gameCapacityStatus, .capacityIndicator').click(function(){
			var gameId = this.parentNode.firstChild.innerHTML; //get game id from hidden column
			enterGame(gameId);
			console.log(gameId);
	});
}

function createTable(appendObject, tableId,  tableClass, rows, columns, data, typeArray){
	var table = $('<table id=' + tableId + ' class=' + tableClass + ' ></table>');
	//var table = $('<table class=' + tableClass + ' ></table>');
	$(appendObject).append(table);
	for(var c=0; c<columns; c++){ 
		var rowEntry = '<tr>';
		for (var r = 0; r<rows; r++){
			rowEntry += cellStyler(typeArray[r], c, data[c*rows+r]); //since every column has different types, they should have id's according to their row
			//rowEntry += '<td class=gameListButton>' + data[c*rows+r] + '</td>';
		}	
	rowEntry += '</tr>';
	$('#'+tableId).append(rowEntry);
	}
}

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

function createGame(){
	$('body').append('<div id="createGameForm"></div>');
	$('#createGameForm').append('<h1>Yeni oyun baslat</h1>');
	$('#createGameForm').append('Oyun adi: <input id="newGameName"/>');
	$('#createGameForm').append('<br>');
	//var selectHtml = '<select id="newGamePlayerCount">'
	$('#createGameForm').append('Kac kisiyle oynamak istersin:<select id="newGameCapacity"></select>');
	for(var i=1; i<9; i++){
		$('#newGameCapacity').append('<option value="'+i+'">'+i+'</option>');
	}
	$('#createGameForm').append('<br><button id="createGameButton">Baslat</button>');
	$('#createGameButton').click(function(){
		var gameName = $('#newGameName').val();
		var gameCapacity = $('#newGameCapacity').val();
		createGameOnServer(gameName, gameCapacity);
	});

	function createGameOnServer(gameName, gameCapacity){
		game.id = server.addGame(gameName, gameCapacity, player.id);
		startServerStateSync();
	}
}



function waitForOthers(){
	backToMainMenuButton();
	drawChart();
	drawBottle();
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	if(game.getPlayerCount() < game.capacity){
		displayInviteList(".sideMenuDiv");
	}else if(player.id === game.owner){
		$('.sideMenuDiv').append('<div id="inviteDiv" class="inviteListDiv"></div>');
		$('#inviteDiv').append('<button id="startGameButton">Oyunu Baslat</div>');
		$('#startGameButton').click(function(){
			server.updateAttr(game.id, "state", "chooseFirstPlayer");
		});
	}else{
		$('.sideMenuDiv').append('<div id="inviteDiv" class="inviteListDiv"></div>');
		$('#inviteDiv').append('<p>Oyunun baslamasi bekleniyor</p>');
	}

	function displayInviteList(appendObject){
		$(appendObject).append('<div id="inviteDiv" class="inviteListDiv"></div>');
		var friendList = fb.getFriends(player.getId());
		var typeArray = ['playerIdCell','playerPictureCell', 'playerNameCell'];
		var headerArray = ['Davet Et'];
		var playerListData = [];
		for (var ply in friendList){
			if((server.isInvited(friendList[ply], game.id) === 0) && !game.isPlaying(friendList[ply])) {
				playerListData.push(friendList[ply]);
				playerListData.push(fb.getProfilePicture(friendList[ply]));
				playerListData.push(fb.getName(friendList[ply]));
			}
		}
		createTable( '#inviteDiv','inviteSideListHeader', 'playerListTableHeader', 1, 1, headerArray, '');
		createTable( '#inviteDiv','inviteSideList', 'playerListTable', 3, playerListData.length/3, playerListData, typeArray);

		$('#inviteDiv .playerNameCell').click(function(){
			if($('.inviteButton[isClicked=true]').length > 0){
				$('.inviteButton').attr("isClicked", "false");
			}else{
				console.log("whoaa");
			}
		});


		$('#inviteDiv .playerNameCell').append('<button class=inviteButton >Davet Et</button>');

		$('.inviteButton').click(function(){
			$(this).attr("isClicked", "true");
			var friendId = this.parentNode.parentNode.firstChild.innerHTML; //get player id from hidden column
			if(inviteFriend(friendId)){
				$(this).html("Gonderildi");
			}
			//setTimeout(updateView, 1000);
			console.log(friendId);
		});

		function inviteFriend(friendId){
			if(server.isInvited(friendId, game.id) === 0){
				server.addInvitation(friendId, player.getId(), game.id);
				server.addPlayer(game.id, friendId);
				return true;
			}else{
				return false;
			}
		}
	}
}

function displayPlayerList(appendObject){
	$(appendObject).append('<div id="playerDiv" class="playerListDiv"></div>');
	var playerList = game.players;
	var typeArray = ['playerPictureCell', 'playerNameCell'];
	var headerArray = ['Oyundakiler'];
	var playerListData = [];
	for (var ply in playerList){
		playerListData.push(fb.getProfilePicture(playerList[ply]));
		playerListData.push(fb.getName(playerList[ply]));
	}
	createTable( '#playerDiv','playerSideListHeader', 'playerListTableHeader', 1, 1, headerArray, '');
	createTable( '#playerDiv','playerSideList', 'playerListTable', 2, playerList.length, playerListData, typeArray);

	$('#playerDiv .playerNameCell').click(function(){
		console.log("fyuu");
	});

}

function displayMessage(appendObject, messsage){
	$(appendObject).append('<div class="messageDiv"></div>');
	$('.messageDiv').html(messsage);
}

function displayDialog(type){
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
			updateView();
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
			game.action = $('#decideActionBox').val();
			game.setState("takeAction");
			sendRotationVariables(false);
			console.log(game.action);
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
			$('.dialogContainer').append('<button id="dialogNo" class="dialogButton">Soylemem</button>');
		}else{
			$('.dialogContainer').append('<p class="dialogText">Gerceklestirdin mi?</p>');
			$('.dialogContainer').append('<br>');
			$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Yaptim</button>');
			$('.dialogContainer').append('<button id="dialogNo" class="dialogButton">Olmaz</button>');
		}
		$('#dialogYes').click(function(){
			game.answer = $('#decideActionBox').val();
			game.setState("evaluateAction");
			sendRotationVariables(false);
			console.log("yaptim");
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

	var width = (760 - $('.dialogContainer').outerWidth()) / 2;
	var height = (600 - $('.dialogContainer').outerHeight()) / 2;
	$('.dialogContainer').offset({ top: height, left: width});
}

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
