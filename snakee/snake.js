var canvas = document.getElementById("snakeCanvas");
var ctx = canvas.getContext("2d");

var timer = 0;
var score = 0;
var paused = false;
var highScore = parseInt(localStorage.getItem("highScoreKey"), 10);
if (Number.isNaN(highScore))
	highScore = 0;

var snake = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	width: 20,
	height: 20,
	speed: 10,
	direction: "stop",
	colour: "#000000",
	grayscale: "#000000",
	
	tail: {
		length: [],
		width: 20,
		height: 20,
		colour: "#ff6961",
		grayscale: "#b7abaa"
	}
};

var food = {
	x: Math.floor(Math.random() * Math.floor(32)) * 20,
	y: Math.floor(Math.random() * Math.floor(24)) * 20,
	width: snake.width,
	height: snake.height,
	colour: "#6961ff",
	grayscale: "#abaab6"
};

function drawSnake(colour, tailColour) {
	ctx.beginPath();
	ctx.rect(snake.x, snake.y, snake.width, snake.height);
	ctx.fillStyle = colour;
	ctx.fill();
	ctx.closePath();
	
	for (var x = 0; x < snake.tail.length.length; x++) {
		ctx.beginPath();
		ctx.rect(snake.tail.length[x][0], snake.tail.length[x][1], snake.tail.width, snake.tail.height);
		ctx.fillStyle = tailColour;
		ctx.fill();
		ctx.closePath();
	}
}

function drawFood(colour) {
	ctx.beginPath();
	ctx.rect(food.x, food.y, food.width, food.height);
	ctx.fillStyle = colour;
	ctx.fill();
	ctx.closePath();
}

function detectCollisions() {
	for (var x = 0; x < snake.tail.length.length; x++)
		if (snake.tail.length[x][0] == snake.x && snake.tail.length[x][1] == snake.y)
			die();
	
	snake.tail.length.push([snake.x, snake.y]);
	if (snake.x == food.x && snake.y == food.y) {
		score++;
		var colliding;
		do {
			colliding = false;
			food.x = Math.floor(Math.random() * Math.floor(32)) * 20;
			food.y = Math.floor(Math.random() * Math.floor(24)) * 20;
			for (var x = 0; x < snake.tail.length.length; x++)
				if (snake.tail.length[x][0] == food.x && snake.tail.length[x][1] == food.y)
					colliding = true;
		} while (colliding == true);
	} else {
		snake.tail.length.shift();
	}
}

function move() {
	timer = 0;
	switch (snake.direction) {
		case "left":
			if (snake.x > 0) {
				detectCollisions();
				snake.x -= snake.width;
			} else {
				die();
			}
			break;
		case "right":
			if (snake.x + snake.width < canvas.width) {
				detectCollisions();
				snake.x += snake.width;
			} else {
				die();
			}
			break;
		case "up":
			if (snake.y > 0) {
				detectCollisions();
				snake.y -= snake.height;
			} else {
				die();
			}
			break;
		case "down":
			if (snake.y + snake.height < canvas.height) {
				detectCollisions();
				snake.y += snake.height;
			} else {
				die();
			}
			break;
		case "stop":
			break;
		default:
			console.log("fuckin uhhhhhhhh");
	}
}

function draw() {
	if (!paused) {
		timer++;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawFood(food.colour);
		drawSnake(snake.colour, snake.tail.colour);
		document.getElementById("scoreText").innerHTML = score;
		document.getElementById("hsText").innerHTML = highScore;
		
		if (timer == snake.speed)
			move();
	}
}

function die() {
	alert("you're die");
	if (score > highScore)
		localStorage.setItem("highScoreKey", score);
	document.location.reload();
	clearInterval(interval);
}

function pause() {
	if (paused == false) {
		paused = true;
		drawFood(food.grayscale);
		drawSnake(snake.grayscale, snake.tail.grayscale);
	} else {
		paused = false;
	}
}

function keyDownHandler(e) {
	if (!paused) {
		if (e.key == "Left" || e.key == "ArrowLeft") {
			if (snake.direction != "left" && (snake.direction != "right" || snake.tail.length.length < 2)) {
				snake.direction = "left";
				move();
			}
		}

		if (e.key == "Right" || e.key == "ArrowRight") {
			if (snake.direction != "right" && (snake.direction != "left" || snake.tail.length.length < 2)) {
				snake.direction = "right";
				move();
			}
		}

		if (e.key == "Up" || e.key == "ArrowUp") {
			if (snake.direction != "up" && (snake.direction != "down" || snake.tail.length.length < 2)) {
				snake.direction = "up";
				move();
			}
		}

		if (e.key == "Down" || e.key == "ArrowDown") {
			if (snake.direction != "down" && (snake.direction != "up" || snake.tail.length.length < 2)) {
				snake.direction = "down";
				move();
			}
		}
	}

	if (e.code == "Space") {
		pause();
	}
}

document.addEventListener("keydown", keyDownHandler, false);
var interval = setInterval(draw, 10);
