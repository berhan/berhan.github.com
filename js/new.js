$(document).ready( function () {
	fb = new FbObj();
	authGame();	
});

function authGame(){
	$('body').append('<div id="authDialog"></div>');
	$('#authDialog').append('<h1>Sise Cevirmece\'ye Hosgeldin</h1>');
	$('#authDialog').append('<br>');
	//$('#authDialog').append('<p>Lutfen id giriniz</p>');
	//$('#authDialog').append('<input id="authIdInput" type="text"></input>');
	$('#authDialog').append('<button id="authGiris">Giris</button>');
	// $("#authIdInput").keyup(function(event){
	// 	if(event.keyCode == 13){
	// 		$("#authGiris").click();
	// 	}
	// });
	$('#authGiris').click(function(){
		//var id = $('#authIdInput').val();
		FB.login();
	});
}

function login(){
	var me;
	FB.api('/me', function(response) {
      me = response.id; 
    });
	player = new Player(me);
	init();
}

function logout(){

}

function init(){
	server = new Server();
	game = new Game("");
	//player = new Player();
	console.log(game.state);

	// canvas = $('#canvas')[0]; 
	// ctx = canvas.getContext('2d');

	//where is the center of chart placed
	// centerX = Math.floor(canvas.width / 2) + 120;
	// centerY = Math.floor(canvas.height / 2);
	centerX = Math.floor(800 / 2) + 120;
	centerY = Math.floor(700 / 2);

	envFriction = 0.98;
	envStopThreshold = 1.5;
	envMinSpeed = 8;


	updateView(); //creates the initial view according to game state

}


function enterGame(id){
	game.id = id;
	server.addPlayer(id, player.id);
	//game.addPlayer(player.id);
	syncGameFields();
	updateView();
	startServerStateSync();
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
	if(id !== "" && game.lastUpdate < server.getLastUpdate(id)){
		if(syncGameFields()){
			//game.setState(server.getState(id));
			console.log(game.state);
			updateView();
		}
	}

	
	// if(game.isRotating && !(game.isRotationUpdated)){
	// 	startRotationUpdate();
	// }
	
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
			exitGameConfirm();
		}else{
			game.setState("main");
		}

	});

	function exitGameConfirm(){
		// $('body').append('<div class ="dialogParent"></div>');
		$('body').append('<div class="dialogBackground"></div>');
		$('body').append('<div class="dialogContainer"></div>');
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
}





function chooseGame(){
	//clearPage();
	backToMainMenuButton();
	var gamesList = server.getGameList();
	console.log(gamesList.length);
	var typeArray = ['gameListButton', 'gameCapacityStatus', 'capacityIndicator'];
	var headerArray = ['Acik Oyunlar', 'Durum', ''];
	//createTable('gamesList', 'gamesListTable',headerArray, 3, 4, gamesList, typeArray);
	createTable('body','gameListInitial', 'gamesListTable', 2, gamesList.length/2,gamesList, typeArray);
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
		cellData += cellData + ' Kisi Oynuyor';
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
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	if(game.getPlayerCount() < game.capacity){
		displayInviteList(".sideMenuDiv");
	}else if(player.id === game.owner){
		$('body').append('<div id="inviteDiv" class="inviteListDiv"></div>');
		$('#inviteDiv').append('<button id="startGameButton">Oyunu Baslat</div>');
		$('#startGameButton').click(function(){
			server.updateAttr(game.id, "state", "chooseFirstPlayer");
		});
	}else{
		$('body').append('<div id="inviteDiv" class="inviteListDiv"></div>');
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
