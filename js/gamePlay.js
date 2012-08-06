function chooseFirstPlayer(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	drawChart();
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

function readyToRotate(){
	console.log("readyToRotate");
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	displayMessage(".sideMenuDiv", "Cevirme sirasi sende");
	backToMainMenuButton();
	//rotateButton();
	//setVelocity();
	//setRotationAngle();
	if(game.rotationAngle === undefined){
		game.rotationAngle = 135;
	}
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle);
	followMouse();
	

	// function rotateButton(){
	// 	$('body').append('<button id="rotateButton" class="rotateButton"style="position:absolute; top:20px; left:550px;">Cevirmeye basla</button>');
	// 	$('#rotateButton').click(function(){
	// 		console.log("pressed");
	// 		game.setState("rotating");
	// 		sendRotationVariables(true);
	// 	});
	// }

	// function setVelocity(){
	// 	$('body').append('<input type="number" class="rotateInput" name="velocity" size="1" style="position:absolute; top:20px; left:450px;"/>');
	// 	$('.rotateInput[name=velocity]').change(function(){
	// 		game.velocity = $('.rotateInput[name=velocity]').val()/1; //division to show it as integer
	// 	});
	// }

	// function setRotationAngle(){
	// 	$('body').append('<input type="number" class="rotateInput" name="rotationAngle" size="1" style="position:absolute; top:20px; left:500px;"/>');
	// 	$('.rotateInput[name=rotationAngle]').change(function(){
	// 		game.rotationAngle = $('.rotateInput[name=rotationAngle]').val()/1; //division to show it as integer
	// 		updateView();
	// 	});
	// }
}

function waitForRotater(){
	console.log("wait for rotater");
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	displayMessage(".sideMenuDiv", name + nameWithSuffix(fb.getName(game.rotater)) + " cevirmesi bekleniyor");
	backToMainMenuButton();
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle);
}

function selectionOfType(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle);
	if(player.id === game.pointed){
		displayDialog("selectionOfType");
	}else{
		displayMessage(".sideMenuDiv", nameWithSuffix(fb.getName(game.pointed)) + " oyun turunu secmesi bekleniyor");
		console.log("game type selection");
	}
}

function decideAction(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle);
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
		
		console.log("action selection");
	}
}

function takeAction(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle);
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

function evaluateAction(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle);
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

function successEnd(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle);
	if(player.id === game.pointed){
		displayDialog("successEndPointed");
	}else{
		displayDialog("successEndOthers");
	}
}

function failureEnd(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");	
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle);

	if(player.id === game.pointed){
		displayDialog("failureEndPointed");
	}else{
		displayDialog("failureEndOthers");
	}

}