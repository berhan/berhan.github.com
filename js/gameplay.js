//functions which will be called after state transtions. The corresponding states can be found at /js/definitions.js > states object.
//Only main menu and its first tranisitions are presented in /js/main.js file.

//messages (little notifications at the right bottom of screen) are controlled from their corresponding state's function. 
//So, you can modify them from here. For dialogs (pop-ups) you should look /js/util.js > displayDialog function.
//You can check types from the functions of this file.
//Also related, if you want to change the style of tables (most of the game controls, except main menu are tables) see createTable and cellStyler
//from /js/util.js. They take data and visualize them. If your intention is to change the representation of data, find and see caller function.


//first state which absent players are being invited.
//every player has right to send an invitation. Notification is sent through Facebook but invitations are also taken by server and 
//when a user login the game, it is checked whether she has an invitation. If she has, then she is redirected to that game. 
function waitForOthers(){
	backToMainMenuButton();
	drawChart();
	drawBottle();
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");

	//if game full, don't show invitation list and wait for owner to start the game.
	if(game.getPlayerCount() < game.capacity){ 
		displayInviteList(".sideMenuDiv");
	}else if(player.id === game.owner){
		$('.sideMenuDiv').append('<div id="inviteDiv" class="inviteListDiv"></div>');
		$('#inviteDiv').append('<button id="startGameButton">Oyunu Baslat</div>');
		$('#startGameButton').click(function(){
			server.updateAttr(game.id, "state", "chooseFirstPlayer");  //updating server state is enough because ever player must be sync with server so after a few milliseconds, all of their states will be updated.
		});
	}else{
		$('.sideMenuDiv').append('<div id="inviteDiv" class="inviteListDiv"></div>'); //other players than owner see this message. It can be stylized giving an id to <p> tag and add rules in the CSS file.
		$('#inviteDiv').append('<p>Oyunun baslamasi bekleniyor</p>');
	}

	//displays invite list in a given object. It uses an array consisting of friend id, name and picture.
	//main function is preparing data and send it to the createTable function. It is in /js/util.js
	function displayInviteList(appendObject){
		$(appendObject).append('<div id="inviteDiv" class="inviteListDiv"></div>');
		var friendList = fb.getFriends(player.id);			//how many friends will be shown can be determined in this function
		var typeArray = ['playerIdCell','playerPictureCell', 'playerNameCell'];
		var headerArray = ['Davet Et'];		//type array for the header table. It is a distinct table to avoid scrolling issues.
		
		var playerListData = [];
		for (var ply in friendList){
			if((server.isInvited(friendList[ply], game.id) === 0) && !game.isPlaying(friendList[ply])) {
				playerListData.push(friendList[ply]);				//friend's Facebook id. It is hidden by CSS.
				playerListData.push(fb.getProfilePicture(friendList[ply]));
				playerListData.push(fb.getName(friendList[ply]));
			}
		}
		createTable( '#inviteDiv','inviteSideListHeader', 'playerListTableHeader', 1, 1, headerArray, '');
		createTable( '#inviteDiv','inviteSideList', 'playerListTable', 3, playerListData.length/3, playerListData, typeArray);

		//isClicked attribute is something I added. Since invite button is above the name of the player, both of them is clicked when one click invite button.
		//To avoid this, I check both of them and if invite button isClicked, name button ignores the event.
		$('#inviteDiv .playerNameCell').click(function(){
			if($('.inviteButton[isClicked=true]').length > 0){
				$('.inviteButton').attr("isClicked", "false");
			}
		});


		$('#inviteDiv .playerNameCell').append('<button class=inviteButton >Davet Et</button>');

		$('.inviteButton').click(function(){
			$(this).attr("isClicked", "true");
			var friendId = this.parentNode.parentNode.firstChild.innerHTML; //get player id from hidden column
			if(inviteFriend(friendId)){
				$(this).html("Gonderildi");
			}
		});

		//sends invitation to the server. The integration with web service can be configured from the server object (/js/server.js). 
		function inviteFriend(friendId){
			if(server.isInvited(friendId, game.id) === 0){
				server.addInvitation(friendId, player.id, game.id);
				//------------REMOVE-------------
				server.addPlayer(game.id, friendId); //this line is for simulation.
				//-----------/REMOVE-------------
				return true;
			}else{
				return false;
			}
		}
	}
}

//state in which first player is choosen. Variables are calculated in the computer of the owner and then sent to the server.
//after first state update (i.e. after a few milliseconds) clients get them and animate the rotation.
function chooseFirstPlayer(){
	displayGameArea();
		if(player.id === game.owner){
			game.rotationAngle = Math.random()*360;
			game.velocity = Math.random()*10 + 20;
			game.state = "rotating";
			sendRotationVariables(true);
		}
}

//the rotater player has the right to rotate bottle, others just wait
function newTurn(){
	game.pointed = "";
	if(player.id === game.rotater){
		readyToRotate();
	}else{
		waitForRotater();
	}
}

//view of the rotater player. It has followMouse function which allows to control the bottle.
function readyToRotate(){
	displayGameArea();
	console.log("readyToRotate");
	displayMessage(".sideMenuDiv", "Cevirme sirasi sende");
	if(game.rotationAngle === undefined){
		game.rotationAngle = 135;
	}
	followMouse();
}

//view of all players but rotater. A message is shown to notify them about game flow.
function waitForRotater(){
	displayGameArea();
	displayMessage(".sideMenuDiv", nameWithSuffix(fb.getName(game.rotater)) + " cevirmesi bekleniyor");
}

//state in which rotation animation is happening. It makes calculations rotates bottle according to them every time view updated by starAnimationRefresh(/js/animation.js)
function rotating(){

	var stopCheck = true;
	if((game.velocity > 0 && game.velocity > envStopThreshold) || (game.velocity < 0 && game.velocity < -envStopThreshold)){
			stopCheck = false;
	}
	if(!stopCheck){
		drawBottle();
		rotateBottle(game.rotationAngle);
		game.rotationAngle += game.velocity; 	//calculates next angle
		game.velocity *= envFriction;			//reduces velocity
	}else{
		stopAnimationRefresh();
		drawBottle();
		rotateBottle(game.rotationAngle);
		stopped(); //see /js/animation.js
	}
}


//state in which game type is selected. Pointed player shows selection dialog while others see a message.
function selectionOfType(){
	displayGameArea();
	if(player.id === game.pointed){
		displayDialog("selectionOfType");
	}else{
		displayMessage(".sideMenuDiv", nameWithSuffix(fb.getName(game.pointed)) + " oyun turunu secmesi bekleniyor");
		console.log("game type selection");
	}
}

//state in which the question or the action is decided by the rotater player. Rotater sees the diaog while others see appropriate messages.
function decideAction(){
	displayGameArea();
	if(player.id === game.rotater){
		displayDialog("decideAction");
	}else if(player.id === game.pointed){
		if(game.type === "gercek"){
			displayMessage(".sideMenuDiv", '"Gercek"i sectin. Bakalım '+fb.getName(game.rotater)+' sana ne soracak...');
		}else{
			displayMessage(".sideMenuDiv", '"Cesaret"i sectin. Bakalım '+fb.getName(game.rotater)+' senden ne isteyecek...');
		}
	}else{
		if(game.type === "gercek"){
			displayMessage(".sideMenuDiv", fb.getName(game.pointed)+'"Gercek"i secti. Bakalım '+fb.getName(game.rotater)+' ne soracak...');
		}else{
			displayMessage(".sideMenuDiv", fb.getName(game.pointed)+'"Cesaret"i secti. Bakalım '+fb.getName(game.rotater)+' ne isteyecek...');
		}
	}
}

//state in which pointed player answers the question or take the action. Others see appropriate messages.
function takeAction(){
	displayGameArea();
	if(player.id === game.pointed){
		displayDialog("takeAction");
	}else{
		if(game.type === "gercek"){
			displayMessage(".sideMenuDiv", fb.getName(game.pointed) + ', '+ nameWithSuffix(fb.getName(game.rotater)) + ' ' + game.action + ' sorusuna ne kadar dürüst cevap verecek?');
		}else{
			displayMessage(".sideMenuDiv", fb.getName(game.pointed) + ', '+ nameWithSuffix(fb.getName(game.rotater)) + ' ' + game.action+' isteğini gerceklestirebilecek mi?');
		}
	}
}

//state in which rotater evaluate the answer or action. Others also see the answer.
function evaluateAction(){
	displayGameArea();
	if(player.id === game.rotater){
		displayDialog("evaluateAction");
	}else if(player.id === game.pointed){
		if(game.type === "gercek"){
			displayMessage(".sideMenuDiv", fb.getName(game.rotater)+', "'+game.answer+'" cevabına ne diyecek?');
		}else{
			if(game.answer === undefined){
				displayMessage(".sideMenuDiv", fb.getName(game.rotater)+', onay verecek mi?');
			}
		}
		
	}else{
		if(game.type === "gercek"){
			displayMessage(".sideMenuDiv", fb.getName(game.pointed)+', "'+game.answer+'" dedi. ' + fb.getName(game.rotater) + ' onaylayacak mı?');
		}else{
			if(game.answer === undefined){
				displayMessage(".sideMenuDiv", fb.getName(game.rotater)+', onay verecek mi?');
			}
		}
	}
}

//the state if rotater approves the answer or question.
function successEnd(){
	displayGameArea();
	if(player.id === game.pointed){
		displayDialog("successEndPointed");
	}else{
		displayDialog("successEndOthers");
	}
}

//the state if rotater rejects the answer or question. Also if pointed player refuses to answer or take action, game turns this state.
function failureEnd(){
	displayGameArea();
	if(player.id === game.pointed){
		displayDialog("failureEndPointed");
	}else{
		displayDialog("failureEndOthers");
	}

}