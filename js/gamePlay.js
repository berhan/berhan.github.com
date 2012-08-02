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
	displayMessage(".sideMenuDiv", fb.getName(game.rotater)+" cevirmesi bekleniyor");
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
		$('body').append('<div class="dialogBackground"></div>');
		$('body').append('<div class="dialogContainer"></div>');
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

	}else{
		displayMessage(".sideMenuDiv", fb.getName(game.pointed)+" oyun turunu secmesi bekleniyor");
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
		$('body').append('<div class="dialogBackground"></div>');
		$('body').append('<div class="dialogContainer"></div>');
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
		$('body').append('<div class="dialogBackground"></div>');
		$('body').append('<div class="dialogContainer"></div>');
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
	}else{
		if(game.type === "gercek"){
			displayMessage(".sideMenuDiv", fb.getName(game.pointed)+', '+fb.getName(game.rotater)+'\'nin '+game.action+' sorusuna ne kadar dürüst cevap verecek?');
		}else{
			displayMessage(".sideMenuDiv", fb.getName(game.pointed)+', '+fb.getName(game.rotater)+'\'nin '+game.action+' isteğini gerceklestirebilecek mi?');
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
		$('body').append('<div class="dialogBackground"></div>');
		$('body').append('<div class="dialogContainer"></div>');
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
	$('body').append('<div class="dialogBackground"></div>');
		$('body').append('<div class="dialogContainer"></div>');
		$('.dialogContainer').append('<p class="dialogMessage">:)</p>');
		$('.dialogContainer').append('<br>');
		if(player.id === game.pointed){
			$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Devam</button>');
				$('#dialogYes').click(function(){
				game.rotater = game.pointed;
				game.setState("newTurn");
				sendRotationVariables(false);
			});	
		}else{
			$('.dialogContainer').append('<p class="dialogMessage">Yeni tur icin '+fb.getName(game.pointed)+' bekleniyor</p>');
		}
}

function failureEnd(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");	
	drawChart();
	drawBottle();
	rotateBottle(game.rotationAngle);
	$('body').append('<div class="dialogBackground"></div>');
	$('body').append('<div class="dialogContainer"></div>');
	$('.dialogContainer').append('<br>');
	$('.dialogContainer').append('<p class="dialogMessage">:(</p>');
	$('.dialogContainer').append('<button id="dialogYes" class="dialogButton">Devam</button>');
	$('#dialogYes').click(function(){
		game.rotater = game.pointed;
		game.setState("newTurn");
		sendRotationVariables(false);
	});
}