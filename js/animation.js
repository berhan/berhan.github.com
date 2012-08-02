function chooseFirstPlayer(){
	$('body').append('<div id="sideMenu" class=sideMenuDiv></div>');
	displayPlayerList(".sideMenuDiv");
		if(player.id === game.owner){
			game.rotationAngle = Math.random()*360;
			game.velocity = Math.random()*10 + 20;
			game.state = "rotating";
			sendRotationVariables(true);
		}
}

function sendRotationVariables(startAnimation){
	console.log("sended");
	stopServerStateSync();
	//game.setState("rotating");
	server.updateAttr(game.id, "state", game.state);
	server.updateAttr(game.id, "velocity", game.velocity);
	server.updateAttr(game.id, "rotationAngle", game.rotationAngle);
	//server.updateAttr(game.id, "clockwise", game.clockwise);
	server.updateAttr(game.id, "rotater", game.rotater);
	server.updateAttr(game.id, "pointed", game.pointed);
	server.updateAttr(game.id, "type", game.type);
	server.updateAttr(game.id, "action", game.action);
	server.updateAttr(game.id, "answer", game.answer);
	if(startAnimation){
			startAnimationRefresh();
	}
}

function startAnimationRefresh(){
	//game.state = "";
	animationRefresh = setInterval(function(){ updateView(); }, 32);
}

function stopAnimationRefresh(){
	clearInterval(animationRefresh);
	animationRefresh = 0;
}

function rotating(){
	// if(serverStateSync !== 0){
	// 	stopServerStateSync();
	// }
	//drawChart();
	var stopCheck = true;
	if((game.velocity > 0 && game.velocity > envStopThreshold) || (game.velocity < 0 && game.velocity > -envStopThreshold)){
			stopCheck = false;
	}
	if(stopCheck){
		drawBottle();
		rotateBottle(game.rotationAngle);
		//console.log(game.rotationAngle);
		game.rotationAngle += game.velocity;
		game.velocity *= envFriction;
	}else{
		//rotateBottle(game.rotationAngle);
		stopAnimationRefresh();
		drawBottle();
		rotateBottle(game.rotationAngle);
		//game.setState("stopped");
		stopped();
	}
}

// function calculateNewAngle(){
// 	if(game.clockwise){
// 		return (game.rotationAngle + game.velocity) % 360;
// 	}else{
// 		return angleSubstraction(game.rotationAngle - game.velocity) % 360;
// 	}
// }

function stopped(){
	console.log("stopped");
	if(game.rotater !== ""){
		if(game.rotater === player.id){
			game.pointed = game.getPointedPlayer();
			if(game.pointed === player.id){
				game.setState("readyToRotate");
				sendRotationVariables(false);
			}else{
				game.setState("selectionOfType");
				sendRotationVariables(false);
			}
		}
	}else if(game.owner === player.id){
		game.rotater = game.getPointedPlayer();
		console.log(game.getPointedPlayer());
		game.state = "newTurn";
		sendRotationVariables(false);
		//game.setState("newTurn");
	}

	setTimeout(startServerStateSync, 1000);
}

//draws the pie-chart-like area
// function drawChart(){
// 	var chartRadius = 260;
// 	// var centerX = Math.floor(canvas.width / 2) + 120;
// 	// var centerY = Math.floor(canvas.height / 2);
// 	var portion = Math.PI*2 / game.getPlayerCount();

// 	for(var i = 0; i < game.getPlayerCount(); i++){
// 		ctx.save();
// 		ctx.beginPath();
// 		ctx.moveTo(centerX, centerY);
// 		ctx.arc(centerX, centerY, chartRadius, i*portion, (i+1)*portion, false);
// 		ctx.closePath();
// 		ctx.fillStyle = colorPalette[i];
// 		ctx.fill();
// 		// drawPlayerPhoto(i);
// 		ctx.restore();
// 	}			
// }

function drawChart(){
	$('body').append('<img id="chart" src="images/chart.png"></img>');
}

// function drawPlayerPhoto(index){
// 	var pic = fb.getProfilePicture(game.players[index]);
// 	// $('body').append('')
// 	ctx.drawImage(pic, 25, 25, 50, 50);
// }

// function drawBottle(rotationAngle){
// 	$('body').append('<img id="bottle" src="images/bottle2.svg">');
// 	var bottle = $('#bottle')[0];
// 	var height = 480;
// 	//var height = 2*arrowSize;
// 	var width = 2*height/3;
// 	//ctx.scale(1,-1);
// 	//ctx.scale(-1,1);
// 	//ctx.shadowColor = "rgba(80,80,80, 1)";
// 	//ctx.shadowOffsetX = 5;
// 	//ctx.shadowOffsetY = 5;
// 	ctx.drawImage(bottle, -(width/2), -(height/2), width, height);
// 	//ctx.scale(1,-1);
// 	//ctx.scale(-1,1);
// }

function drawBottle(){
	// $('body').append('<span id="bottle"></span>');
	// $('#bottle').append('<img src="images/milk.png">');
	$('body').append('<img class="bottle" id="bottle" src="images/milk.png">');
}

function rotateBottle(rotationAngle){
	//$('body').append('<img id="bottle" src="images/milk.png">');
	//$('#bottle').offset({top:centerY, left:centerX});
	$('#bottle').rotate(rotationAngle);
}

// function rotateBottle(rotationAngle){
// 	ctx.save();
// 	ctx.translate(centerX, centerY);
// 	ctx.rotate(Math.PI * rotationAngle / 180);
// 	//ctx.rotate(-90 * Math.PI / 180);
// 	drawBottle();
// 	ctx.restore();
// }

function angleSubstraction(a1, a2){
	var res = a1 - a2;
	if(res > 180){
		res -= 360;
	}else if(res < -180){
		res += 360;
	}
	return res;

}

function followMouse(){
	var angle;
	var total = 0;
	var startTime = 0;
	//bottleMouseDown();


	$('.bottle').on("mousedown", function(e){
		console.log("alfas");
		angle = ["","",""];
		angle.pop();
		angle.unshift(calculateAngle(e.pageX, e.pageY));
		startTime = getCurrentTime();
		mousemoveAction();
		mouseupAction();

		return false;
	});
	
	function mousemoveAction(){
		$(document).on("mousemove", function(e){
			angle.pop();
			angle.unshift(calculateAngle(e.pageX, e.pageY));
			
		 	rotateBottle(angle[0]);
		 	if(angle[2] === ""){
		 		total += angleSubstraction(angle[0], angle[1]);
		 	}else if((angle[0] < angle[1]) !== (angle[1] < angle[2])){
		 		total = 0;
		 		startTime = getCurrentTime();
		 	}else{
		 		total += angleSubstraction(angle[0], angle[1]);
		 		//console.log("entered");
		 	}
		});
	}

	function mouseupAction(){
		$(document).on("mouseup", function(){
			$(document).off("mousemove");
			$(document).off("mouseup");
			var curTime = getCurrentTime();
			var velocity = calculateVelocity(curTime);
			console.log("vel= " + velocity);
			if(velocity > envMinSpeed || velocity < (-1 * envMinSpeed)){
				triggerRotation(velocity, angle[0]);
			}else{
				//bottleMouseDown();
				followMouse();
			}
			
		});
	}

	function calculateAngle(x,y){
		var position = Math.atan((150-y)/(x-190)) * (180 / Math.PI);
		//console.log(position);
		if((x-190) < 0){
			return 270 - position;
		}else{
			return 90 - position;
		}
	}

	function calculateVelocity(stopTime){
		return 30 * (total / (stopTime - startTime));
	}

	function getCurrentTime(){
		var date = new Date();
		return date.getMilliseconds() + 1000 * date.getSeconds() + 1000 * 60 * date.getMinutes();
	}

	
}

function triggerRotation(velocity, rotationAngle){
	//game.clockwise = isClockwise;
	game.velocity = velocity;
	game.rotationAngle = rotationAngle;
	game.setState("rotating");
	sendRotationVariables(true);
}

