//global variable definitions

var canvas;
var ctx;

var gameStates = ['noGame', 'gameCreation', 'waitingForOthers', 'readyToPlay' , 'selectRotPlayer', 'rotateBottle', 'rotating', 'gameTypeSelection', 'enterQuestion', 'takeAction', 'evaluateAction', 'successfulEnd', 'failureEnd' ];
var viewStates = ['mainMenu', 'chooseGame', 'createGame', 'selectRotPlayer', 'rotateBottle', 'followRotation', 'chooseType', 'waitTypeSelection', 'enterQuestion', 'waitQuestion', 'takeAction', 'waitAction', 'approve', 'waitApproval', 'successPointed', 'failurePointed'];
var gameState;	//state of gameplay
var viewState;	//where the user looks

var bottle;
var playerId;	//current player
var playerCount = 6; //determines the partitions of the circle
var colorPalette = ["#FFDAB9", "#E6E6FA", "#E0FFFF", "#9AFE2E", "#0404B4", "#01DFD7", "#F3E2A9", "#380B61", "#F5A9F2", "#81F7D8", "#8181F7"]; //will be grown

var portion;	//how much angle every player gets

//center of the canvas
var centerX;
var centerY;

var chartRadius = 260;
var arrowSize = chartRadius - 20;
//var pointedAngle = 0;
var rotatingPlayer;
var pointedPlayer;
var rotationResult = -1;
var intervalOfRotation;

var incrementAngle;	//how many angles the arrow passes in a turn
var rotationAngle;	//starting point of arrow, random for now
//without a rotation, arrow points -90 degree, so corrects it
//var initialAngle = rotationAngle + 90;
var friction;	//random friction


//global function definitions