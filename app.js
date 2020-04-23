var context;
var shape = new Object();
var gameDuration;
var numOfBalls;

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
var lastKeyPressed=0;
var startAngle=0.15 * Math.PI;
var endAngle=1.85*Math.PI;
var eyeStart=5;
var eyeEnd=-15;
var blinkyAte=0;
var inkyAte=0;
var pinkyAte=0;
var clydeAte=0;
var starAte=0;
var numOfMons;
var packmanSpeed=150;
var monstersSpeed=280;
//endregion
var maxPoints;
var bigBall=new Object();
var mediumBall=new Object();
var smallBall=new Object();
bigBall.code=1;
mediumBall.code=9;
smallBall.code=10;
star.code=11;
var starEaten=false;
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
			gameDuration=document.getElementById("duration").value;

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

	});

});



function startGame()
{
	context = canvas.getContext("2d");
	Start();

}

function Start() {
	board = new Array();
	score = 0;
	lives=70;
	pac_color = "yellow";
	var cnt = boardI*boardJ;
	var food_remain = (smallBall.amount+mediumBall.amount+bigBall.amount);
	start_time = new Date();
	game_time=90000;


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
	// ----------------------------------------------------------------------------------

	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
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
	intervalMon = setInterval(UpdateMonsterPosition, monstersSpeed);

}


function findRandomEmptyCell(board) 
{
	var i = Math.floor(Math.random() * (boardI));
	var j = Math.floor(Math.random() * (boardJ));
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * (boardI));
		j = Math.floor(Math.random() * (boardJ));
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
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
		}
	}

}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	movePacman();

	if (board[shape.i][shape.j] == smallBall.code) {
		score += 5;
	} else if (board[shape.i][shape.j] == mediumBall.code) {
		score += 15;
	} else if (board[shape.i][shape.j] == bigBall.code) {
		score += 25;
	}
	board[shape.i][shape.j] = 2;

	checkCollision();


	var currentTime = new Date();
	time_elapsed = (game_time - (currentTime - start_time)) / 1000;
	if (time_elapsed <= 0 || score == maxPoints)
		endGame();
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	} else {
		Draw();
	}

 
}

function UpdateMonsterPosition(){

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
		board[blinky.i][blinky.j] = blinkyAte;
		Monster=blinky;
	}

	else if(MonsterName=="inky"){
		board[inky.i][inky.j] = inkyAte;
		Monster=inky;
	}

	else if(MonsterName=="pinky"){
		board[pinky.i][pinky.j] = pinkyAte;
		Monster=pinky;
	}

	else if(MonsterName=="clyde"){
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
		if (board[blinky.i][blinky.j] == smallBall.code)
			blinkyAte = smallBall.code;
		else if (board[blinky.i][blinky.j] == mediumBall.code)
			blinkyAte = mediumBall.code;
		else if (board[blinky.i][blinky.j] == bigBall.code)
			blinkyAte = bigBall.code;
		// else if (board[blinky.i][blinky.j] == star.code)
		// 	blinkyAte = star.code;
		else
			blinkyAte = 0;
		board[blinky.i][blinky.j] = 5;
	}
	else if(MonsterName=="inky"){
		if (board[inky.i][inky.j] == smallBall.code)
			inkyAte = smallBall.code;
		else if (board[inky.i][inky.j] == mediumBall.code)
			inkyAte = mediumBall.code;
		else if (board[inky.i][inky.j] == bigBall.code)
			inkyAte = bigBall.code;
		// else if (board[inky.i][inky.j] == star.code)
		// 	inkyAte = star.code;
		else
			inkyAte = 0;
		board[inky.i][inky.j] = 6;
	}

	else if(MonsterName=="pinky"){
		if (board[pinky.i][pinky.j] == smallBall.code)
			pinkyAte = smallBall.code;
		else if (board[pinky.i][pinky.j] == mediumBall.code)
			pinkyAte = mediumBall.code;
		else if (board[pinky.i][pinky.j] == bigBall.code)
			pinkyAte = bigBall.code;
		// else if (board[pinky.i][pinky.j] == star.code)
		// 	pinkyAte = star.code;
		else
			pinkyAte = 0;
		board[pinky.i][pinky.j] = 7;
	}

	else if(MonsterName=="clyde"){
		if (board[clyde.i][clyde.j] == smallBall.code)
			clydeAte = smallBall.code;
		else if (board[clyde.i][clyde.j] == mediumBall.code)
			clydeAte = mediumBall.code;
		else if (board[clyde.i][clyde.j] == bigBall.code)
			clydeAte = bigBall.code;
		// else if (board[clyde.i][clyde.j] == star.code)
		// 	clydeAte = star.code;
		else
			clydeAte = 0;
		board[clyde.i][clyde.j] = 8;
	}



}

function moveStar(){
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



	if (board[star.i][star.j] == smallBall.code)
		starAte = smallBall.code;
	else if (board[star.i][star.j] == mediumBall.code)
		starAte = mediumBall.code;
	else if (board[star.i][star.j] == bigBall.code)
		starAte = bigBall.code;
	else
		starAte = 0;
	board[star.i][star.j] = star.code;
}

function randPacmanStart() {
	shape.i = Math.floor(Math.random() * 6 + 2);
	shape.j = Math.floor(Math.random() * 6 + 2);
	while (board[shape.i][shape.j] !=0 ) {
		shape.i = Math.floor(Math.random() * 6 + 2);
		shape.j = Math.floor(Math.random() * 6 + 2);
	}
	board[shape.i][shape.j] = 2;
}

function checkCollision(){

	let collisionFound=false;
	for(let i=0;i<numOfMons&&!collisionFound;i++){
		if(i==0){
			collisionFound=(blinky.i==shape.i&&blinky.j==shape.j);
		}
		else if(i==1){
			collisionFound=(inky.i==shape.i&&inky.j==shape.j);
		}
		else if(i==2){
			collisionFound=(pinky.i==shape.i&&pinky.j==shape.j);
		}
		else if(i==3){
			collisionFound=(clyde.i==shape.i&&clyde.j==shape.j);
		}
	}

	if(collisionFound){
		randPacmanStart();
		board[shape.i][shape.j]=0;
		for(let i=0;i<numOfMons;i++){
			if(i==0){
				board[blinky.i][blinky.j]=blinkyAte;
				blinkyAte=0;
				blinky.i=0;
				blinky.j=0;
				board[blinky.i][blinky.j]=5;
			}
			else if(i==1){
				board[inky.i][inky.j]=inkyAte;
				inkyAte=0;
				inky.i=0;
				inky.j=boardJ-1;
				board[inky.i][inky.j]=6;
			}
			else if(i==2){
				board[pinky.i][pinky.j]=pinkyAte;
				pinkyAte=0;
				pinky.i=boardI-1;
				pinky.j=0;
				board[pinky.i][pinky.j]=7;
			}
			else if(i==3){
				board[clyde.i][clyde.j]=clydeAte;
				clydeAte=0;
				clyde.i=boardI-1;
				clyde.j=boardJ-1;
				board[clyde.i][clyde.j]=8;
			}
		}

		if((--lives)==0)
			endGame();
		score-=10;


		window.clearInterval(intervalPac);
		window.clearInterval(intervalMon);
		intervalPac = setInterval(UpdatePosition, packmanSpeed);
		intervalMon = setInterval(UpdateMonsterPosition, monstersSpeed);

	}

	if(!starEaten&&(star.i==shape.i&&star.j==shape.j)){
		starEaten=true;
		score+=50;
	}

}

function endGame(){
	if(lives==0){
		alert("Loser!");
	}
	else if(score==maxPoints)
	{
		alert("Game Completed!!!");
	}
	else if(time_elapsed<=0){
		if(score<100)
			alert("You are better than "+score+" points!");
		else
			alert("Winner!!!");
	}
	// else if (score == 50) {
	// 	window.alert("Game completed");
	// }
	window.clearInterval(intervalPac);
	window.clearInterval(intervalMon);
}



function handleKeys(e)
{
	e.preventDefault();
	document.getElementById("upKey").value =e.keyCode;
}

function checkNotAbcentFigure(){
	let pacmanExists=false;
	let blinkyExists=false;
	let inkyExists=false;
	let pinkyExists=false;
	let clydeExists=false;
	for(var i=0;i<boardI;i++){
		for(var j=0;j<boardJ;j++){
			if(board[i][j]==2)
				pacmanExists=true;
			else if(board[i][j]==5)
				blinkyExists=true;
			else if(board[i][j]==6)
				inkyExists=true;
			else if(board[i][j]==7)
				pinkyExists=true;
			else if(board[i][j]==8)
				clydeExists=true;
		}
	}
	if(numOfMons==1)
		return (pacmanExists&&blinkyExists);
	else if(numOfMons==2)
		return (pacmanExists&&blinkyExists&&inkyExists);
	else if(numOfMons==3)
		return (pacmanExists&&blinkyExists&&inkyExists&&pinkyExists);
	else
		return (pacmanExists&&blinkyExists&&inkyExists&&pinkyExists&&clydeExists);

}








