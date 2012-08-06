function sendRotationVariables(startAnimation){
	console.log("sended");
	stopServerStateSync();
	server.updateAttr(game.id, "state", game.state);
	server.updateAttr(game.id, "velocity", game.velocity);
	server.updateAttr(game.id, "rotationAngle", game.rotationAngle);
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
	if((game.velocity > 0 && game.velocity > envStopThreshold) || (game.velocity < 0 && game.velocity < -envStopThreshold)){
			stopCheck = false;
	}
	if(!stopCheck){
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

function stopped(){
	console.log("stopped");
	if(game.rotater !== ""){
		if(game.rotater === player.id){
			game.pointed = game.getPointedPlayer();
			if(game.pointed === player.id){
				displayDialog("pointedYourself");
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

function drawChart(){
	$('body').append('<img id="chart" src="images/chart.png"></img>');
}

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
	var total;
	var startTime;
	//var lastMovementTime = 0;
	var waitInterval = 0;
	mouseDownAction();

	function mouseDownAction(){
		$('.bottle').on("mousedown", function(e){
			//console.log("alfas");
			angle = ["","",""];
			angle.pop();
			angle.unshift(calculateAngle(e.pageX, e.pageY));
			startTime = getCurrentTime();
			total = 0;
			mousemoveAction();
			mouseupAction();

			return false; //prevent defaut action of browser
		});
	}
	
	function mousemoveAction(){
		$(document).on("mousemove", function(e){
			clearTimeout(waitInterval);
			waitInterval = setTimeout(function(){
				total = 0; 
				startTime = getCurrentTime();}, 200);

			var mouse = {x:e.pageX, y: e.pageY};
			if(Math.sqrt(Math.pow(Math.abs(mouse.x - centerX) , 2) + Math.pow(Math.abs(mouse.y - centerY), 2)) > 20){
				angle.pop();
				angle.unshift(calculateAngle(mouse.x, mouse.y ));
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
			}
			return false;
		});
	}

	function mouseupAction(){
		$(document).on("mouseup", function(){
			$(document).off("mousemove");
			$(document).off("mouseup");
			$('.bottle').off("mousedown");
			var curTime = getCurrentTime();
			var velocity = calculateVelocity(curTime);
			console.log("vel= " + velocity);
			if(velocity > envMinSpeed || velocity < (-1 * envMinSpeed)){
				triggerRotation(velocity, angle[0]);
			}else{
				followMouse();
			}
			
		});

		return false;
	}

	function calculateAngle(x,y){
		var position = Math.atan((centerY-y)/(x-centerX)) * (180 / Math.PI);
		//console.log(position);
		if((x-centerX) < 0){
			return 270 - position;
		}else{
			return 90 - position;
		}
	}

	function calculateVelocity(stopTime){
		var realVel = total / (stopTime - startTime);
		console.log("real: " + realVel);
		if(realVel < 0.40){
			return envVelocityCoefficient0 * realVel;
		}else if(realVel < 1){
			return envVelocityCoefficient1 * realVel;
		}else{
			return envVelocityCoefficient2 * realVel;
		}
		
	}

	function getCurrentTime(){
		var date = new Date(); //to get client side time information
		return date.getMilliseconds() + 1000 * date.getSeconds() + 1000 * 60 * date.getMinutes(); //from global Date object date
	}

	
}

function triggerRotation(velocity, rotationAngle){
	//game.clockwise = isClockwise;
	game.velocity = velocity;
	game.rotationAngle = rotationAngle;
	game.state = "rotating";
	sendRotationVariables(true);
}

