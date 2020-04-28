var context;
var backMusic = new Audio("beginning.wav" ) ;
backMusic.loop=true;
backMusic.volume = 0.05;
var eatSound = new Audio("eat.wav" ) ;
var dieSound = new Audio("die.wav" ) ;
var godSound = new Audio("god.wav" ) ;
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
var packmanSpeed=160;
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
var starEaten;
var snailEaten;
var candiesCounter;
var lastHundreadExcceded;
var godModeOn;
// bigBall.color="#00FF00";
// mediumBall.color="#ff0000";
// smallBall.color="#000000";
// bigBall.amount=50*0.1;
// mediumBall.amount=50*0.3;
// smallBall.amount=50*0.6;
// var maxPoints=smallBall.amount*5+mediumBall.amount*15+bigBall.amount*25;


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

			bigBall.amount=numOfBalls*0.1;
			mediumBall.amount=numOfBalls*0.3;
			smallBall.amount=numOfBalls*0.6;
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

	// $("#restartBut").click(function(){
	// 	window.clearInterval(intervalPac);
	// 	window.clearInterval(intervalMon);
	// 	window.clearInterval(intervalSnail);
	// 	if (confirm("Are you sure you want to restart the game?")) 
	// 	{
	// 		bigBall.amount=numOfBalls*0.1;
	// 		mediumBall.amount=numOfBalls*0.3;
	// 		smallBall.amount=numOfBalls*0.6;
	// 		maxPoints=smallBall.amount*5+mediumBall.amount*15+bigBall.amount*25;
	// 		Start();
	// 	} 
	// 	else 
	// 	{
	// 		intervalPac = setInterval(UpdatePosition, packmanSpeed);
	// 		intervalMon = setInterval(UpdateMonsterAndStarPosition, monstersSpeed);
	// 		intervalSnail = setInterval(UpdateSnailPosition, snailSpeed);
	// 	}
	// });

	// $("#newGameBut").click(function(){
	// 	window.clearInterval(intervalPac);
	// 	window.clearInterval(intervalMon);
	// 	window.clearInterval(intervalSnail);
	// 	if (confirm("Are you sure you want to start a new game?")) 
	// 	{
	// 		$(".screen").hide();
	// 		$("#optionsScreen").show();
	// 	} 
	// 	else 
	// 	{
	// 		intervalPac = setInterval(UpdatePosition, packmanSpeed);
	// 		intervalMon = setInterval(UpdateMonsterAndStarPosition, monstersSpeed);
	// 		intervalSnail = setInterval(UpdateSnailPosition, snailSpeed);
	// 	}
	// });

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
	showUser.value="Hello, "+document.getElementById("tryUsername").value;;
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

	//insert monsters
	for(let i=0;i<numOfMons;i++){
		if(i==0){
			board[0][0]=5;
			blinky.i=0;
			blinky.j=0;
		}
		else if(i==1){
			board[0][boardJ-1]=6;
			inky.i=0;
			inky.j=boardJ-1;
		}
		else if(i==2){
			board[boardI-1][0]=7;
			pinky.i=boardI-1;
			pinky.j=0;
		}
		else if(i==3){
			board[boardI-1][boardJ-1]=8;
			clyde.i=boardI-1;
			clyde.j=boardJ-1;
		}
	}
	//insert monsters


	//insert walls

	board[3][3] = 4;
	board[3][4] = 4;
	board[3][5] = 4;
	board[6][1] = 4;
	board[6][2] = 4;


	//insert pacman
	var emptyCell = findRandomEmptyCell(board);
	shape.i = emptyCell[0];
	shape.j = emptyCell[1];
	board[shape.i][shape.j] = 2;

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

	//insert star
	emptyCell=findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]]=star.code;
	star.i=emptyCell[0];
	star.j=emptyCell[1];

	//insert snail
	emptyCell=findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]]=snail.code;
	snail.i=emptyCell[0];
	snail.j=emptyCell[1];
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

	// var i = Math.floor(Math.random() * (boardI));
	// var j = Math.floor(Math.random() * (boardJ));
	// while (board[i][j] != 0) {
	// 	i = Math.floor(Math.random() * (boardI));
	// 	j = Math.floor(Math.random() * (boardJ));
	// }
	// return [i, j];
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
		}
	}

}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	movePacman();

	if (board[shape.i][shape.j] == smallBall.code) {
		eatSound.play();
		score += 5;
		candiesCounter--;
	} 
	else if (board[shape.i][shape.j] == mediumBall.code) {
		eatSound.play();
		score += 15;
		candiesCounter--;
	} 
	else if (board[shape.i][shape.j] == bigBall.code) {
		eatSound.play();
		score += 25;
		candiesCounter--;
	}
	else if(board[shape.i][shape.j] == snail.code){
		backMusic.playbackRate=0.3;
		snailEaten=true;
		window.clearInterval(intervalMon);
		intervalMon=setInterval(UpdateMonsterAndStarPosition,monstersSpeed*6);
		setTimeout(function () {window.clearInterval(intervalMon);
			intervalMon=setInterval(UpdateMonsterAndStarPosition,monstersSpeed);backMusic.playbackRate=1;
		},10000);
	}
	board[shape.i][shape.j] = 2;

	enterGodMode();

	checkCollision();


	var currentTime = new Date();
	time_elapsed = (gameDuration - (currentTime - start_time)) / 1000;
	if (time_elapsed <= 0 || score >= maxPoints||candiesCounter==0)
		endGame();
	// if (score >= 20 && time_elapsed <= 10) {
	// 	pac_color = "green";
	// } else {
	// }
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
		returnEatenCandy(blinky,"blinky");
		board[blinky.i][blinky.j] = 5;
	}
	else if(MonsterName=="inky"){
		returnEatenCandy(inky,"inky");
		board[inky.i][inky.j] = 6;
	}

	else if(MonsterName=="pinky"){
		returnEatenCandy(pinky,"pinky");
		board[pinky.i][pinky.j] = 7;
	}

	else if(MonsterName=="clyde"){
		returnEatenCandy(clyde,"clyde")
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



	returnEatenCandy(star,"star");
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


	// shape.i = Math.floor(Math.random() * 6 + 2);
	// shape.j = Math.floor(Math.random() * 6 + 2);
	// while (board[shape.i][shape.j] !=0 ) {
	// 	shape.i = Math.floor(Math.random() * 6 + 2);
	// 	shape.j = Math.floor(Math.random() * 6 + 2);
	// }
	board[shape.i][shape.j] = 2;
}

function checkCollision(){

	let collisionFound = false;
	for (let i = 0; i < numOfMons && !collisionFound; i++) {
		if (i == 0) {
			collisionFound = (blinky.i == shape.i && blinky.j == shape.j);
		} else if (i == 1) {
			collisionFound = (inky.i == shape.i && inky.j == shape.j);
		} else if (i == 2) {
			collisionFound = (pinky.i == shape.i && pinky.j == shape.j);
		} else if (i == 3) {
			collisionFound = (clyde.i == shape.i && clyde.j == shape.j);
		}
	}

	if (collisionFound && !godModeOn) {
		dieSound.play();
		randPacmanStart();
		board[shape.i][shape.j] = 0;
		for (let i = 0; i < numOfMons; i++) {
			if (i == 0) {
				board[blinky.i][blinky.j] = blinkyAte;
				blinkyAte = 0;
				blinky.i = 0;
				blinky.j = 0;
				board[blinky.i][blinky.j] = 5;
			} else if (i == 1) {
				board[inky.i][inky.j] = inkyAte;
				inkyAte = 0;
				inky.i = 0;
				inky.j = boardJ - 1;
				board[inky.i][inky.j] = 6;
			} else if (i == 2) {
				board[pinky.i][pinky.j] = pinkyAte;
				pinkyAte = 0;
				pinky.i = boardI - 1;
				pinky.j = 0;
				board[pinky.i][pinky.j] = 7;
			} else if (i == 3) {
				board[clyde.i][clyde.j] = clydeAte;
				clydeAte = 0;
				clyde.i = boardI - 1;
				clyde.j = boardJ - 1;
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
	else if(collisionFound&&godModeOn)
		board[shape.i][shape.j]=2;


	if(!starEaten&&(star.i==shape.i&&star.j==shape.j)){
		starEaten=true;
		score+=50;
		enterGodMode();
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
		alert("Game Completed!!!");
	}
	else if(time_elapsed<=0||candiesCounter==0){
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

function returnEatenCandy(MovingEntity,Name){
	var MovingEntityAte;
	if (board[MovingEntity.i][MovingEntity.j] == smallBall.code)
		MovingEntityAte = smallBall.code;
	else if (board[MovingEntity.i][MovingEntity.j] == mediumBall.code)
		MovingEntityAte = mediumBall.code;
	else if (board[MovingEntity.i][MovingEntity.j] == bigBall.code)
		MovingEntityAte = bigBall.code;
	else if (board[MovingEntity.i][MovingEntity.j] == snail.code)
		MovingEntityAte = snail.code;
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
	if(score>lastHundreadExcceded){
		godSound.play();
		lastHundreadExcceded+=250;
		godModeOn=true;
		setTimeout(function () {godModeOn=false;pac_color="yellow";},5000);
		pac_color="blue";
	}
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
		bigBall.amount=numOfBalls*0.1;
		mediumBall.amount=numOfBalls*0.3;
		smallBall.amount=numOfBalls*0.6;
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
		loseSound.volume=0;
		winSound.volume=0;
		document.getElementById("soundIm").src = "soundoff.png";

	}
	else{
		soundVolume=1;
		dieSound.volume=1;
		eatSound.volume=1;
		godSound.volume=1;
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
	lastHundreadExcceded=200;
	godModeOn=false;

	score = 0;
	lives=5;
	pac_color = "yellow";
	candiesCounter= (smallBall.amount+mediumBall.amount+bigBall.amount);

	let n=0;
}








