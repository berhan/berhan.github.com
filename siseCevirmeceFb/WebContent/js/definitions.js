var server;
var fb; //faux facebook integration
var game;
var player;

var serverStateSync = 0; //updateState interval variable
var animationRefresh = 0; //rotating interval variable

var animationRefreshInterval = 32; //after how many milliseconds the view must be updated when animationg rotation
var serverRefreshInterval = 1000;

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

var game_capacity_limit = 8;

var mouseMovement = 0;
var mouseWaitThreshhold = 200; //how long the mouse can wait on a point

//object which keeps state functions
var states = {
	main: function(){ mainMenu(); },
	chooseGame: function(){ chooseGame(); },
	enterGame: function(){ enterGame("123"); },
	createGame: function(){ createGame(); },
	waitingForOthers: function(){ waitForOthers(); },
	chooseFirstPlayer: function(){ chooseFirstPlayer(); },
	newTurn: function(){ newTurn(); },
	readyToRotate: function(){ readyToRotate(); },
	rotating: function(){ rotating(); },
	selectionOfType: function(){ selectionOfType(); },
	decideAction: function(){ decideAction(); },
	takeAction: function(){ takeAction(); },
	evaluateAction: function(){ evaluateAction(); },
	successEnd: function(){ successEnd(); },
	failureEnd: function(){ failureEnd(); }
};