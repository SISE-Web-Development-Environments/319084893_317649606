var context;
var backMusic = new Audio("beginning.wav" ) ;
backMusic.loop=true;
backMusic.volume = 0.05;
var eatSound = new Audio("eat.wav" ) ;
var dieSound = new Audio("die.wav" ) ;
var godSound = new Audio("god.wav" ) ;
var godPushSound = new Audio("godpush.mp3" ) ;
var loseSound = new Audio("lose.mp3" ) ;
var winSound = new Audio("winner.mp3" ) ;
var soundVolume=1;

var shape = new Object();
var gameDuration;
var numOfBalls;
var numOfMons;
var upKey;
var downKey;
var rightKey;
var leftKey;

//region Monsters
var blinkyImage=new Image();
blinkyImage.src="blinky.png";
var blinky=new Object();

var inkyImage=new Image();
inkyImage.src="inky.png";
var inky=new Object();

var pinkyImage=new Image();
pinkyImage.src="pinky.png";
var pinky=new Object();

var clydeImage=new Image();
clydeImage.src="clyde.png";
var clyde=new Object();

var starImage=new Image();
starImage.src="star.png";
var star=new Object();

var snailImage=new Image();
snailImage.src="snail.png";
var snail=new Object();

var tubeImage=new Image();
tubeImage.src="tube.png";
var tube=new Object();


//endregion

//region Fields
var board;
var score;
var lives;
var pac_color;
var start_time;
var game_time;
var time_elapsed;
var intervalPac;
var intervalMon;
var intervalSnail;
var lastKeyPressed;
var startAngle;
var endAngle;
var eyeStart;
var eyeEnd;
var blinkyAte;
var inkyAte;
var pinkyAte;
var clydeAte;
var starAte;
var packmanSpeed=140;
var monstersSpeed=280;
var snailSpeed=4000;
//endregion
var maxPoints;
var bigBall=new Object();
var mediumBall=new Object();
var smallBall=new Object();
bigBall.code=1;
mediumBall.code=9;
smallBall.code=10;
star.code=11;
snail.code=12;
tube.code=13;
var starEaten;
var snailEaten;
var godModeOn;
var allCandiedEaten;



var boardI=10;
var boardJ=10;



$(document).ready(function() {
	$("#optionsForm").validate({
		rules: {
			duration:{
				goodTime:true
			}
		}
	});
	jQuery.validator.addMethod("goodTime", function(value) {
        return (value>=60);
	  }, "please choose a number higher than 60");
	  
	$("#optionsSubmit").click(function(e)
    {
        e.preventDefault();
		if($('#optionsForm').valid() == true)
		{
			numOfBalls=document.getElementById("ballNum").value;
			numOfMons=document.getElementById("monsterNum").value;
			bigBall.color=document.getElementById("ball25").value;
			mediumBall.color=document.getElementById("ball15").value;
			smallBall.color=document.getElementById("ball5").value;
			gameDuration=document.getElementById("duration").value*1000;
			upKey=document.getElementById("upKeyIn_disp").value;
			downKey=document.getElementById("downKeyIn_disp").value;
			rightKey=document.getElementById("rightKeyIn_disp").value;
			leftKey=document.getElementById("leftKeyIn_disp").value;
			
			setSideValues();

			bigBall.amount=Math.floor(numOfBalls*0.1);
			mediumBall.amount=Math.floor(numOfBalls*0.3);
			smallBall.amount=Math.floor(numOfBalls*0.6);
			smallBall.amount+=(numOfBalls-(bigBall.amount+mediumBall.amount+smallBall.amount));
			maxPoints=smallBall.amount*5+mediumBall.amount*15+bigBall.amount*25;


			$(".screen").hide();
			$("#gameScreen").show();
            startGame();
		}
	});

	$("#randomChoise").click(function(e){
		e.preventDefault();
		ballNum.value=Math.floor(Math.random() * Math.floor(90)+50);
		monsterNum.value=Math.floor(Math.random() * Math.floor(4)+1);
		ballNum_disp.value=ballNum.value;
		monsterNum_disp.value=monsterNum.value;
		ball25.value='#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
		ball15.value='#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
		ball5.value='#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
		duration.value=Math.floor(Math.random() * Math.floor(50)+60);
		duration_disp.value=duration.value;
		side_balls.value=ballNum.value;
		side_monsters.value=monsterNum.value;
		side_ball25.value=ball25.value;
		side_ball15.value=ball15.value;
		side_ball5.value=ball5.value;
		side_duration.value=duration.value;
		upKeyIn_disp.value=38; upKeyIn.value='';
		downKeyIn_disp.value=40; downKeyIn.value='';
		rightKeyIn_disp.value=39; rightKeyIn.value='';
		leftKeyIn_disp.value=37; leftKeyIn.value='';

	});



});



function startGame()
{
	context = canvas.getContext("2d");
	Start();

}

function Start() {

	window.clearInterval(intervalPac);
	window.clearInterval(intervalMon);
	window.clearInterval(intervalSnail);
	
	backMusic.pause();
	musicToggle();
	if(soundVolume==0) soundToggle();
	showUser.value=document.getElementById("tryUsername").value;;
	board = new Array();
	initializeGameParameters();
	var food_remain = (smallBall.amount+mediumBall.amount+bigBall.amount);
	start_time = new Date()


	// ------------------ create all objects on board-----------------------------

	for (var i = 0; i < boardI; i++) {
		board[i] = new Array();
		for (var j = 0; j < boardJ; j++) {
			board[i][j]=0;
		}
	}

	//insert walls
	var randomNumber=Math.floor(Math.random()*4+1);
	if(randomNumber==1){
		board[3][3] = 4;
		board[3][4] = 4;
		board[3][5] = 4;
		board[6][1] = 4;
		board[6][2] = 4;
	}
	else if(randomNumber==2){
		board[3][3] = 4;
		board[4][3] = 4;
		board[5][3] = 4;
		board[4][6] = 4;
		board[5][6] = 4;
	}
	else if(randomNumber==3){
		board[6][4] = 4;
		board[6][5] = 4;
		board[6][6] = 4;
		board[3][2] = 4;
		board[3][3] = 4;
	}
	else if(randomNumber==4){
		board[2][6] = 4;
		board[3][6] = 4;
		board[4][6] = 4;
		board[5][3] = 4;
		board[6][3] = 4;
	}

	//insert food
	while (food_remain > 0)
	{
		var emptyCell = findRandomEmptyCell(board);

		let newrand=Math.random();
		let done=false;
		while(!done)
		{
			if(newrand<0.5 && smallBall.amount>0 && !done)
			{
				smallBall.amount--;
				board[emptyCell[0]][emptyCell[1]] = smallBall.code;
				done=true;

			}
			else newrand=Math.random();

			if(newrand<0.5 && mediumBall.amount>0 && !done)
			{
				mediumBall.amount--;
				board[emptyCell[0]][emptyCell[1]] = mediumBall.code;
				done=true;
			}
			else newrand=Math.random();

			if(newrand<0.5 && bigBall.amount>0 && !done)
			{
				bigBall.amount--;
				board[emptyCell[0]][emptyCell[1]] = bigBall.code;
				done=true;
			}
			else newrand=Math.random();
		}

		food_remain--;
	}

	//insert monsters
	for(let i=0;i<numOfMons;i++){
		if(i==0){
			blinky.i=0;
			blinky.j=0;
			saveEatenCandy(blinky,"blinky");
			board[0][0]=5;
		}
		else if(i==1){
			inky.i=0;
			inky.j=boardJ-1;
			saveEatenCandy(inky,"inky");
			board[0][boardJ-1]=6;
		}
		else if(i==2){
			pinky.i=boardI-1;
			pinky.j=0;
			saveEatenCandy(pinky,"pinky");
			board[boardI-1][0]=7;
		}
		else if(i==3){
			clyde.i=boardI-1;
			clyde.j=boardJ-1;
			saveEatenCandy(clyde,"clyde");
			board[boardI-1][boardJ-1]=8;
		}
	}

	//insert pacman
	var emptyCell = findRandomEmptyCell(board);
	shape.i = emptyCell[0];
	shape.j = emptyCell[1];
	board[shape.i][shape.j] = 2;



	//insert star
	if(checkCornersEmpty())
		emptyCell=randomizeCorner(board);
	else
		emptyCell=findRandomEmptyCell(board);
	star.i=emptyCell[0];
	star.j=emptyCell[1];
	saveEatenCandy(star,"star");
	board[emptyCell[0]][emptyCell[1]]=star.code;





	//insert snail
	emptyCell=findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]]=snail.code;
	snail.i=emptyCell[0];
	snail.j=emptyCell[1];

	//insert tube
	emptyCell=findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]]=tube.code;
	tube.i=emptyCell[0];
	tube.j=emptyCell[1];
	// ----------------------------------------------------------------------------------

	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			e.preventDefault();
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	intervalPac = setInterval(UpdatePosition, packmanSpeed);
	intervalMon = setInterval(UpdateMonsterAndStarPosition, monstersSpeed);
	intervalSnail = setInterval(UpdateSnailPosition, snailSpeed);

}


function findRandomEmptyCell(board) 
{
	let emptyCells=new Array();
	for(let i=0;i<boardI;i++){
		for(let j=0;j<boardJ;j++){
			if(board[i][j]==0){
				emptyCells.push({i:i,j:j});
			}
		}
	}

	var randomCell = Math.floor(Math.random()*emptyCells.length);

	return [emptyCells[randomCell].i,emptyCells[randomCell].j];

}

function GetKeyPressed() {
	if (keysDown[upKey]) {
		return 1;
	}
	if (keysDown[downKey]) {
		return 2;
	}
	if (keysDown[leftKey]) {
		return 3;
	}
	if (keysDown[rightKey]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLives.value = lives;
	for (var i = 0; i < boardI; i++) {
		for (var j = 0; j < boardJ; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, startAngle, endAngle);
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + eyeStart, center.y + eyeEnd, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			}
			else if (board[i][j] == smallBall.code) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = smallBall.color; //color
				context.fill();
			}
			else if (board[i][j] == mediumBall.code) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = mediumBall.color; //color
				context.fill();
			}
			else if (board[i][j] == bigBall.code) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = bigBall.color; //color
				context.fill();
			}
			else if(board[i][j]==star.code){
				context.drawImage(starImage, center.x - 30, center.y - 30, canvas.width / boardJ, canvas.height / boardI);
			}
			else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j] == 5) {
				context.drawImage(blinkyImage, center.x - 30, center.y - 30, canvas.width / boardJ, canvas.height / boardI);
			}
			else if (board[i][j] == 6) {
				context.drawImage(inkyImage, center.x - 30, center.y - 30, canvas.width / boardJ, canvas.height / boardI);
			}
			else if (board[i][j] == 7) {
				context.drawImage(pinkyImage, center.x - 30, center.y - 30, canvas.width / boardJ, canvas.height / boardI);
			}
			else if (board[i][j] == 8) {
				context.drawImage(clydeImage, center.x - 30, center.y - 30, canvas.width / boardJ, canvas.height / boardI);
			}
			else if (board[i][j] == snail.code) {
				context.drawImage(snailImage, center.x - 30, center.y - 30, canvas.width / boardJ, canvas.height / boardI);
			}
			else if (board[i][j] == tube.code) {
				context.drawImage(tubeImage, center.x - 30, center.y - 30, canvas.width / boardJ, canvas.height / boardI);
			}
		}
	}

}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	movePacman();

	if (board[shape.i][shape.j] == smallBall.code) {
		eatSound.play();
		score += 5;
	}
	else if (board[shape.i][shape.j] == mediumBall.code) {
		eatSound.play();
		score += 15;
	}
	else if (board[shape.i][shape.j] == bigBall.code) {
		eatSound.play();
		score += 25;
	}
	else if(board[shape.i][shape.j] == snail.code){
		backMusic.playbackRate=0.3;
		snailEaten=true;
		window.clearInterval(intervalMon);
		intervalMon=setInterval(UpdateMonsterAndStarPosition,monstersSpeed*4);
		setTimeout(function () {window.clearInterval(intervalMon);
			intervalMon=setInterval(UpdateMonsterAndStarPosition,monstersSpeed);backMusic.playbackRate=1;
		},7000);
	}
	else if(board[shape.i][shape.j] == tube.code){
		enterGodMode();
	}
	board[shape.i][shape.j] = 2;


	checkCollision();




	var currentTime = new Date();
	time_elapsed = (gameDuration - (currentTime - start_time)) / 1000;
	allCandiedEaten=checkIfAllCandiesEaten();
	if (time_elapsed <= 0 || score >= maxPoints||allCandiedEaten)
		endGame();
	
	Draw();
 
}

function UpdateMonsterAndStarPosition(){

	for(var i=0;i<numOfMons;i++){
		if(i==0)
			moveMonster("blinky");
		else if(i==1)
			moveMonster("inky");
		else if(i==2)
			moveMonster("pinky");
		else if(i==3)
			moveMonster("clyde");
	}

	if(!starEaten)
		moveStar();

	checkCollision();
	Draw();



}

function UpdateSnailPosition(){
	if (!snailEaten) {
		var emptyCell = findRandomEmptyCell(board);
		board[snail.i][snail.j]=0;
		snail.i = emptyCell[0];
		snail.j = emptyCell[1];
		board[emptyCell[0]][emptyCell[1]] = snail.code;
		Draw();
	}
	else {
		window.clearInterval(intervalSnail);
	}
}

function movePacman(){
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			startAngle=-0.35*Math.PI;
			endAngle=1.35*Math.PI;
			lastKeyPressed=x;
			eyeStart=-15;
			eyeEnd=-3;
		}
	}
	if (x == 2) {
		if (shape.j < boardJ-1 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			startAngle=0.65 * Math.PI;
			endAngle=2.35*Math.PI;
			lastKeyPressed=x;
			eyeStart=15;
			eyeEnd=-5;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			startAngle=1.15 * Math.PI;
			endAngle=2.85*Math.PI;
			lastKeyPressed=x;
			eyeStart=5;
			eyeEnd=-15;
		}
	}
	if (x == 4) {
		if (shape.i < boardI-1 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			startAngle=0.15 * Math.PI;
			endAngle=1.85*Math.PI;
			lastKeyPressed=x;
			eyeStart=5;
			eyeEnd=-15;
		}
	}
}

function moveMonster(MonsterName){
	let Monster;
	if(MonsterName=="blinky"){
		if(blinkyAte==snail.code){
			if(blinky.i==snail.i&&blinky.j==snail.j)
				board[blinky.i][blinky.j] = blinkyAte;
		}
		else
			board[blinky.i][blinky.j] = blinkyAte;
		Monster=blinky;
	}

	else if(MonsterName=="inky"){
		if(inkyAte==snail.code){
			if(inky.i==snail.i&&inky.j==snail.j)
				board[inky.i][inky.j] = inkyAte;
		}
		else
			board[inky.i][inky.j] = inkyAte;
		Monster=inky;
	}

	else if(MonsterName=="pinky"){
		if(pinkyAte==snail.code){
			if(pinky.i==snail.i&&pinky.j==snail.j)
				board[pinky.i][pinky.j] = pinkyAte;
		}
		else
			board[pinky.i][pinky.j] = pinkyAte;
		Monster=pinky;
	}

	else if(MonsterName=="clyde"){
		if(clydeAte==snail.code){
			if(clyde.i==snail.i&&clyde.j==snail.j)
				board[clyde.i][clyde.j] = clydeAte;
		}
		else
			board[clyde.i][clyde.j] = clydeAte;
		Monster=clyde;
	}





	let action;
	var rnd = Math.random();
	// 1 - down
	// 2 - up
	// 3 - right
	// 4 - left
	let options=[];
	if(Monster.i>shape.i)
		options.push(1);
	if(Monster.i<shape.i)
		options.push(2);
	if(Monster.j<shape.j)
		options.push(3);
	if(Monster.j>shape.j)
		options.push(4);
	let length=options.length;

	if(length==1)
	{
		if(rnd>0.2)
			action=options[0];
		else
			action=Math.floor(Math.random() * 4 + 1);

	}
	else
	{
		if(rnd<=0.46)
			action=options[0];
		else if(rnd>0.46&&rnd<=0.92)
			action=options[1];
		else
			action=Math.floor(Math.random() * 4 + 1);

	}

	if (action == 1 && Monster.i - 1 >= 0 && board[Monster.i - 1][Monster.j] != 4)
		Monster.i--;
	else if (action == 2 && Monster.i + 1 < boardI && board[Monster.i + 1][Monster.j] != 4)
		Monster.i++;
	else if (action == 3 && Monster.j + 1 < boardJ && board[Monster.i][Monster.j + 1] != 4)
		Monster.j++;
	else if (action == 4 && Monster.j - 1 >= 0 && board[Monster.i][Monster.j - 1] != 4)
		Monster.j--;

	if(MonsterName=="blinky"){
		saveEatenCandy(blinky,"blinky");
		board[blinky.i][blinky.j] = 5;
	}
	else if(MonsterName=="inky"){
		saveEatenCandy(inky,"inky");
		board[inky.i][inky.j] = 6;
	}

	else if(MonsterName=="pinky"){
		saveEatenCandy(pinky,"pinky");
		board[pinky.i][pinky.j] = 7;
	}

	else if(MonsterName=="clyde"){
		saveEatenCandy(clyde,"clyde")
		board[clyde.i][clyde.j] = 8;
	}



}

function moveStar(){
	if(starAte==snail.code){
		if(star.i==snail.i&&star.j==snail.j)
			board[star.i][star.j] = starAte;
	}
	else
		board[star.i][star.j] = starAte;


	var random=Math.floor(Math.random() * 4 + 1);

	if(random==1&&star.i+1<boardI&&board[star.i+1][star.j]!=4)
		star.i++;
	if(random==2&&star.i-1>=0&&board[star.i-1][star.j]!=4)
		star.i--;
	if(random==3&&star.j+1<boardJ&&board[star.i][star.j+1]!=4)
		star.j++;
	if(random==4&&star.j-1>=0&&board[star.i][star.j-1]!=4)
		star.j--;



	saveEatenCandy(star,"star");
	board[star.i][star.j] = star.code;
}

function randPacmanStart() {
	let emptyCells=new Array();
	for(let i=0;i<boardI;i++){
		for(let j=0;j<boardJ;j++){
			if((i==0&j==0)||(i==0&&j==boardJ-1)||(i==boardI-1&&j==0)||(i==boardI-1&&j==boardJ-1))
				continue;
			if(board[i][j]==0)
				emptyCells.push({i:i,j:j});
		}
	}

	var randomCell = Math.floor(Math.random()*emptyCells.length);

	shape.i=emptyCells[randomCell].i;
	shape.j=emptyCells[randomCell].j;

	board[shape.i][shape.j] = 2;
}

function checkCollision(){

	let blinkyCollision = false;
	let inkyCollision = false;
	let pinkyCollision = false;
	let clydeCollision = false;
	for (let i = 0; i < numOfMons; i++) {
		if (i == 0) {
			blinkyCollision = (blinky.i == shape.i && blinky.j == shape.j);
		} else if (i == 1) {
			inkyCollision = (inky.i == shape.i && inky.j == shape.j);
		} else if (i == 2) {
			pinkyCollision = (pinky.i == shape.i && pinky.j == shape.j);
		} else if (i == 3) {
			clydeCollision = (clyde.i == shape.i && clyde.j == shape.j);
		}
	}
	let collisionFound=(blinkyCollision||inkyCollision||pinkyCollision||clydeCollision);

	if (collisionFound && !godModeOn) {
		backMusic.playbackRate=1;
		dieSound.play();
		randPacmanStart();
		board[shape.i][shape.j] = 0;
		for (let i = 0; i < numOfMons; i++) {
			if (i == 0) {
				board[blinky.i][blinky.j] = blinkyAte;
				blinkyAte = 0;
				blinky.i = 0;
				blinky.j = 0;
				saveEatenCandy(blinky,"blinky");
				board[blinky.i][blinky.j] = 5;
			} else if (i == 1) {
				board[inky.i][inky.j] = inkyAte;
				inkyAte = 0;
				inky.i = 0;
				inky.j = boardJ - 1;
				saveEatenCandy(inky,"inky");
				board[inky.i][inky.j] = 6;
			} else if (i == 2) {
				board[pinky.i][pinky.j] = pinkyAte;
				pinkyAte = 0;
				pinky.i = boardI - 1;
				pinky.j = 0;
				saveEatenCandy(pinky,"pinky");
				board[pinky.i][pinky.j] = 7;
			} else if (i == 3) {
				board[clyde.i][clyde.j] = clydeAte;
				clydeAte = 0;
				clyde.i = boardI - 1;
				clyde.j = boardJ - 1;
				saveEatenCandy(clyde,"clyde");
				board[clyde.i][clyde.j] = 8;
			}
		}

		if ((--lives) == 0)
			endGame();
		score -= 10;


		window.clearInterval(intervalPac);
		window.clearInterval(intervalMon);
		intervalPac = setInterval(UpdatePosition, packmanSpeed);
		intervalMon = setInterval(UpdateMonsterAndStarPosition, monstersSpeed);

	}
	else if(collisionFound&&godModeOn){
		godPushSound.play();
		board[shape.i][shape.j]=2;
		if(blinkyCollision){
			blinkyAte = 0;
			blinky.i = 0;
			blinky.j = 0;
			board[blinky.i][blinky.j] = 5;
		}
		if(inkyCollision){
			inkyAte = 0;
			inky.i = 0;
			inky.j = boardJ - 1;
			board[inky.i][inky.j] = 6;
		}
		if(pinkyCollision){
			pinkyAte = 0;
			pinky.i = boardI - 1;
			pinky.j = 0;
			board[pinky.i][pinky.j] = 7;
		}
		if(clydeCollision){
			clydeAte = 0;
			clyde.i = boardI - 1;
			clyde.j = boardJ - 1;
			board[clyde.i][clyde.j] = 8;
		}

		// window.clearInterval(intervalMon);
		// intervalMon = setInterval(UpdateMonsterAndStarPosition, monstersSpeed);

	}



	if(!starEaten&&(star.i==shape.i&&star.j==shape.j)){
		starEaten=true;
		score+=50;
	}

}

function endGame(){
	
	

	backMusic.pause();

	if(lives==0){
		loseSound.play();
		alert("Loser!");
	}
	else if(score>=maxPoints)
	{
		winSound.play();
		alert("Winner!!!");
	}
	else if(time_elapsed<=0||allCandiedEaten){
		if(score<100)
		{
			loseSound.play();
			alert("You are better than "+score+" points!");
			
		}
		else
		{
			winSound.play();
			alert("Winner!!!");
		}
	}
	
	if(soundVolume!=0) soundToggle();
	gameDuration=100000000000;
	window.clearInterval(intervalPac);
	window.clearInterval(intervalMon);
	window.clearInterval(intervalSnail);
	$(".screen").hide();
	$("#optionsScreen").show();
	
}

function saveEatenCandy(MovingEntity,Name){
	var MovingEntityAte;
	if (board[MovingEntity.i][MovingEntity.j] == smallBall.code)
		MovingEntityAte = smallBall.code;
	else if (board[MovingEntity.i][MovingEntity.j] == mediumBall.code)
		MovingEntityAte = mediumBall.code;
	else if (board[MovingEntity.i][MovingEntity.j] == bigBall.code)
		MovingEntityAte = bigBall.code;
	else if (board[MovingEntity.i][MovingEntity.j] == snail.code)
		MovingEntityAte = snail.code;
	else if (board[MovingEntity.i][MovingEntity.j] == tube.code)
		MovingEntityAte = tube.code;
	else
		MovingEntityAte = 0;

	if(Name=="blinky")
		blinkyAte=MovingEntityAte;
	else if(Name=="inky")
		inkyAte=MovingEntityAte;
	else if(Name=="pinky")
		pinkyAte=MovingEntityAte;
	else if(Name=="clyde")
		clydeAte=MovingEntityAte;
	else if(Name=="star")
		starAte=MovingEntityAte;



}

function enterGodMode(){
	godSound.play();
	godModeOn=true;
	setTimeout(function () {godModeOn=false;pac_color="yellow";},4000);
	pac_color="#00FF00";
}



function handleKeys(e)
{
	e.preventDefault();
	document.getElementById("upKey").value =e.keyCode;
}




function restartGame()
{
	window.clearInterval(intervalPac);
	window.clearInterval(intervalMon);
	window.clearInterval(intervalSnail);
	if (confirm("Are you sure you want to restart the game?")) 
	{
		bigBall.amount=Math.floor(numOfBalls*0.1);
		mediumBall.amount=Math.floor(numOfBalls*0.3);
		smallBall.amount=Math.floor(numOfBalls*0.6);
		smallBall.amount+=(numOfBalls-(bigBall.amount+mediumBall.amount+smallBall.amount));
		maxPoints=smallBall.amount*5+mediumBall.amount*15+bigBall.amount*25;
		Start();
	} 
	else
	{
		intervalPac = setInterval(UpdatePosition, packmanSpeed);
		intervalMon = setInterval(UpdateMonsterAndStarPosition, monstersSpeed);
		intervalSnail = setInterval(UpdateSnailPosition, snailSpeed);
	}

}

function newGame()
{
	if(soundVolume==1) soundToggle();
	backMusic.pause();
	window.clearInterval(intervalPac);
	window.clearInterval(intervalMon);
	window.clearInterval(intervalSnail);
	if (confirm("Are you sure you want to start a new game?")) 
	{
		$(".screen").hide();
		$("#optionsScreen").show();
	} 
	else 
	{
		intervalPac = setInterval(UpdatePosition, packmanSpeed);
		intervalMon = setInterval(UpdateMonsterAndStarPosition, monstersSpeed);
		intervalSnail = setInterval(UpdateSnailPosition, snailSpeed);
	}
}

function soundToggle()
{
	if(soundVolume==1)
	{
		soundVolume=0;
		dieSound.volume=0;
		eatSound.volume=0;
		godSound.volume=0;
		godPushSound.volume=0;
		loseSound.volume=0;
		winSound.volume=0;
		document.getElementById("soundIm").src = "soundoff.png";

	}
	else{
		soundVolume=1;
		dieSound.volume=1;
		eatSound.volume=1;
		godSound.volume=1;
		godPushSound.volume=1;
		loseSound.volume=1;
		winSound.volume=1;
		document.getElementById("soundIm").src = "soundon.png";
	}
}

function musicToggle()
{
	if(backMusic.paused)
	{
		backMusic.play();
		document.getElementById("musicIm").src = "musicon.png";
	}
	else
	{
		backMusic.pause();
		document.getElementById("musicIm").src = "musicoff.png";
	}
}

function initializeGameParameters(){
	lastKeyPressed=0;
	startAngle=0.15 * Math.PI;
	endAngle=1.85*Math.PI;
	eyeStart=5;
	eyeEnd=-15;
	blinkyAte=0;
	inkyAte=0;
	pinkyAte=0;
	clydeAte=0;
	starAte=0;
	starEaten=false;
	snailEaten=false;
	godModeOn=false;

	score = 0;
	lives=5;
	pac_color = "yellow";

	allCandiedEaten=false;


	let n=0;
}

function randomizeCorner(board){
	let emptyCorners=new Array();
	if(board[0][0]==0)
		emptyCorners.push({i:0,j:0});
	if(board[boardI-1][0]==0)
		emptyCorners.push({i:boardI-1,j:0});
	if(board[0][boardJ-1]==0)
		emptyCorners.push({i:0,j:boardJ-1});
	if(board[boardI-1][boardJ-1]==0)
		emptyCorners.push({i:boardI-1,j:boardJ-1});

	var randomCell = Math.floor(Math.random()*emptyCorners.length);

	return [emptyCorners[randomCell].i,emptyCorners[randomCell].j];
}

function checkCornersEmpty(){
	if(board[0][0]==0)
		return true;
	if(board[boardI-1][0]==0)
		return true;
	if(board[0][boardJ-1]==0)
		return true;
	if(board[boardI-1][boardJ-1]==0)
		return true;
	return false;
}


function setSideValues()
{
	side_upKey.value=document.getElementById("upKeyIn_disp").value;
	side_downKey.value=document.getElementById("downKeyIn_disp").value;
	side_leftKey.value=document.getElementById("leftKeyIn_disp").value;
	side_rightKey.value=document.getElementById("rightKeyIn_disp").value;
	side_balls.value=document.getElementById("ballNum_disp").value;
	side_ball25.value=ntc.name(document.getElementById("ball25").value)[1];
	document.getElementById("side_ball25").style.color = document.getElementById("ball25").value;
	side_ball15.value=ntc.name(document.getElementById("ball15").value)[1];
	document.getElementById("side_ball15").style.color = document.getElementById("ball15").value;
	side_ball5.value=ntc.name(document.getElementById("ball5").value)[1];
	document.getElementById("side_ball5").style.color = document.getElementById("ball5").value;
	side_duration.value = document.getElementById("duration_disp").value;
	side_monsters.value=document.getElementById("monsterNum_disp").value;
}

function checkIfAllCandiesEaten(){
	for(let i=0;i<boardI;i++){
		for(let j=0;j<boardJ;j++){
			if(board[i][j]==smallBall.code||board[i][j]==mediumBall.code||board[i][j]==bigBall.code)
				return false;
		}
	}
	return true;

}

