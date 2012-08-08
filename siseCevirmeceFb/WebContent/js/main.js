$(document).ready( function () {
	fb = new FbObj();
	authGame();	
	//jsontest();
});

function jsontest(){
	$.getJSON('/siseCevirmeceFb/GameServlet?gameId=123', function(response){
		console.log(response.name);
	});
}

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
	game.syncGameFields();
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

//updates state of the game to the value in the server
function updateState(){
	var id = game.id;
	var oldState = game.state;
	if(serverStateSync != 0 && game.lastUpdate < server.getLastUpdate(id)){
		if(game.syncGameFields()){
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


function chooseGame(){
	$('#handler').on("gameListGet", function(event){
		console.log("ee");
		chooseGameTable(event.list);
	});
	//clearPage();
	backToMainMenuButton();
	server.getGameList();

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


