var context;
var shape = new Object();
var blinkyImage=new Image();
blinkyImage.src="blinky.png";
var blinky=new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var lastKeyPressed=0;
var startAngle=0.15 * Math.PI;
var endAngle=1.85*Math.PI;
var eyeStart=5;
var eyeEnd=-15;
var blinkyAte=0;


$(document).ready(function() {
	// context = canvas.getContext("2d");
	// Start();

});

function startGame()
{
	context = canvas.getContext("2d");
	Start();
}

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();

	// ------------------ create all objects on board-----------------------------

	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if(i==0 && j==0){
				board[i][j]=5;
				blinky.i=i;
				blinky.j=j;
			}
			else if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			}
			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
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
	intervalPac = setInterval(UpdatePosition, 220);
	intervalMons = setInterval(UpdateMonsterPosition, 350);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
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
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
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
				context.arc(center.x + eyeStart, center.y +eyeEnd, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} 
			else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} 
			else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j] == 5) {
				context.drawImage(blinkyImage,center.x-30,center.y-30,canvas.width/10,canvas.height/10);
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	movePacman();
	
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
 
}

function UpdateMonsterPosition(){

	board[blinky.i][blinky.j] = blinkyAte;
	moveMonster();
		
	if(board[blinky.i][blinky.j]==1)
		blinkyAte = 1;
	else
	blinkyAte = 0;

	board[blinky.i][blinky.j] = 5;
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
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
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
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			startAngle=0.15 * Math.PI;
			endAngle=1.85*Math.PI;
			lastKeyPressed=x;
			eyeStart=5;
			eyeEnd=-15;
		}
	}
}

function moveMonster(){
	let action;
	var rnd = Math.random();
	// 1 - down
	// 2 - up
	// 3 - right
	// 4 - left
	let options=[];
	if(blinky.i>shape.i)
		options.push(1);
	if(blinky.i<shape.i)
		options.push(2);
	if(blinky.j<shape.j)
		options.push(3);
	if(blinky.j>shape.j)
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

	if(action==1 && board[blinky.i-1][blinky.j] != 4)
		blinky.i--;
	else if(action==2  && board[blinky.i+1][blinky.j] != 4)
		blinky.i++;
	else if(action==3 && board[blinky.i][blinky.j + 1] != 4)
		blinky.j++;	
	else if(action==4 && board[blinky.i][blinky.j - 1] != 4)
		blinky.j--;

	
}

