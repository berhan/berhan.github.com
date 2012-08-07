var server;
var fb; //faux facebook integration
var game;
var player;

var serverStateSync = 0; //updateState interval variable
var animationRefresh = 0; //rotating interval variable

var animationRefreshInterval = 32; //after how many milliseconds the view must be updated when animationg rotation

var chartSrc4 = "images/chart.png";
var bottleSrc = "images/milk.png";

var centerX;
var centerY;

var envFriction = 0.92;
var envStopThreshold = 1.5;
var envMinSpeed = 20;
var envVelocityCoefficient0 = 100;
var envVelocityCoefficient1 = 80;
var envVelocityCoefficient2 = 200;


var mouseMovement = 0;
var mouseWaitThreshhold = 200; //farenin ne kadar bkeleyebileceği

//var colorPalette = ["#DF0101", "#FF8000", "#298A08", "#01A9DB", "#A901DB", "#0404B4", "#86B404", "#FFFF00", "#F5A9F2", "#81F7D8", "#8181F7"]; //will be grown

//object which keeps state functions
var states = {
	//auth: function(){ auth(); },
	main: function(){ mainMenu(); },
	chooseGame: function(){ chooseGame(); },
	enterGame: function(){ enterGame("123"); },
	createGame: function(){ createGame(); },
	waitingForOthers: function(){ waitForOthers(); },
	chooseFirstPlayer: function(){ chooseFirstPlayer(); },
	newTurn: function(){ newTurn(); },
	readyToRotate: function(){ readyToRotate(); },
	rotating: function(){ rotating(); },
	//stopped: function(){ stopped();},
	selectionOfType: function(){ selectionOfType(); },
	decideAction: function(){ decideAction(); },
	takeAction: function(){ takeAction(); },
	evaluateAction: function(){ evaluateAction(); },
	successEnd: function(){ successEnd(); },
	failureEnd: function(){ failureEnd(); },
	wfo: function(){ console.log("bey");}
};