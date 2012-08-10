//functions responsible to rotate bottle
//visual effects is a very little part, most of it calculations and data transportation with server

//The rotation logic is as follows: 
//
//If player is the rotator, she has the mouse control on bottle (see followMouse function)
//When her mouse down on bottle, movement of mouse over document is tracked and its angle to the center of chart calculated
//Then bottle rotated to this angle. Total angle mouse traveresed and total time spent on the movement are calculated and
//multiplied with some constants (see /js/definitions.js) to make it more faster and more fun to play.
//If at a given point mouse waits for a particular time or mouse reverses turning direction, total angle and time are zeroed.
//When mouse up, velocity is calculated, rotation triggered and variables are sent to the server. Then when other clients get this
//initial values, they mimic exact animation at the client side.


//provides client to server synchronization through server object (/js/server.js)
//if startAnimation is true, also starts animationRefresh.
function sendRotationVariables(startAnimation){
	console.log("sended");
	stopServerStateSync();
	server.updateAttr(game.id, "state", game.state);
	server.updateAttr(game.id, "velocity", game.velocity);
	server.updateAttr(game.id, "rotationAngle", game.rotationAngle);
	server.updateAttr(game.id, "rotator", game.rotator);
	server.updateAttr(game.id, "pointed", game.pointed);
	server.updateAttr(game.id, "type", game.type);
	server.updateAttr(game.id, "action", game.action);
	server.updateAttr(game.id, "answer", game.answer);
	if(startAnimation){
			startAnimationRefresh();
	}
}

//main function of animation. It starts to update view frequently when calculations are made by rotating function (/js/gameplay.js since it is also a state function )
function startAnimationRefresh(){
	//game.state = "";
	animationRefresh = setInterval(function(){ updateView(); }, animationRefreshInterval);
}

function stopAnimationRefresh(){
	clearInterval(animationRefresh);
	animationRefresh = 0;
}

//function determines the state after rotation and starts server side synchronization again
//If the rotation is the initial random rotation to determine first player, starts the new turn
//If stopped after a player rotated, goes to "Dare or Truth?" selection according to game flow
function stopped(){
	console.log("stopped");
	if(game.rotator !== ""){				//if a player rotated it or not
		if(game.rotator === player.id){		//make pointed player calculations on the client side of rotator and send to the server
			game.pointed = game.getPointedPlayer();
			if(game.pointed === player.id){
				displayDialog("pointedYourself");
			}else{
				game.setState("selectionOfType");
				sendRotationVariables(false);	//sends the pointed player to the server
			}
		}
	}else if(game.owner === player.id){				//if a player didn't rotated, it means it is initial random rotation
		game.rotator = game.getPointedPlayer();		//make calculations on the client side of game owner and send to the server
		console.log(game.getPointedPlayer());
		game.state = "newTurn";
		sendRotationVariables(false);				//sends the rotator player to the server 
	}

	setTimeout(startServerStateSync, 1000);			//syncronize with server after 1 second
}

//draws background chart
//-------NEEDS--------
//simple image determination for different player countts
//------/NEEDS--------
function drawChart(){
	$('#game-area').append('<img id="chart" src='+chartSrc4+'></img>');
}

//draws bottle according to bottleSrc variable
function drawBottle(){
	// $('#game-area').append('<span id="bottle"></span>');
	// $('#bottle').append('<img src="images/milk.png">');
	$('#game-area').append('<img class="bottle" id="bottle" src='+bottleSrc+'>');
}

//shows bottle rotated at given angle. rotate function comes from plugin.
function rotateBottle(rotationAngle){
	$('#bottle').rotate(rotationAngle);
}

//solves problems about circularity
function angleSubstraction(a1, a2){
	var res = a1 - a2;
	if(res > 180){
		res -= 360;
	}else if(res < -180){
		res += 360;
	}
	return res;

}

//function provides mouse control
//for brief explanation for animation read the beginning of this file
function followMouse(){
	var angle;		//keeps last three angles of mouse to catch direction changes (see mousemoveAction)
	var total;		//total angle mouse traversed
	var startTime;	//time at which mouse started teh movement on a particular direction
	var waitInterval = 0;	//timeout variable (see setTimeout on the Web and mousemoveAction below)
	mouseDownAction();

	function mouseDownAction(){
		$('.bottle').on("mousedown", function(e){
			angle = ["","",""];
			angle.pop();
			angle.unshift(calculateAngle(e.pageX, e.pageY));
			startTime = getCurrentTime();
			total = 0;
			mousemoveAction();		//starts tracking mouse movement
			mouseupAction();		//wait for mouse up

			return false; //prevents defaut action of browser
		});
	}
	
	function mousemoveAction(){
		$(document).on("mousemove", function(e){
			clearTimeout(waitInterval);					//clears interval every mouse movement
			waitInterval = setTimeout(function(){		//then starts again the count down
				total = 0; 
				startTime = getCurrentTime();}, mouseWaitThreshhold);

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
			return false; //prevents defaut action of browser
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

		return false; //prevents defaut action of browser
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

