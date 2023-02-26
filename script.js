//https://webdoli.tistory.com/24 참고하고 있음

function ball(){
	window.x = canvas.width / 2;
	window.y = canvas.height / 3;
	window.r = canvas.width/45;
	window.dx = 5;
	window.dy = -5;
}

function paddle(){
	window.pX = x;
	window.pHeight = x/15;
	window.pWidth = x/4;
	window.pLeft = false;
	window.pRight = false;
}

function brick(row, col){
	window.bricks = [];
	
	window.row = row;
	window.col = col;
	window.bW = canvas.width / (col+1);
	window.bH = canvas.height / 10;
	window.bWS = bW/10;
	
	for(let i=0; i<row; i++){
		window.bricks[i] = [];
		for(let j=0; j<col; j++){
			bricks[i][j] = {};
			bricks[i][j].x = bW/2 + j*bW;
			bricks[i][j].y = bH/2 + i*bH;
			bricks[i][j].exist = true;
		}
	}
}

function init(){
	
	window.canvas = document.getElementById('game');
	window.scr = canvas.getContext('2d');
	
	document.addEventListener('keyup', keyupHandler);//키뗄때
	document.addEventListener('keydown', keydownHandler);//키누를때
	
	document.addEventListener('mousemove', mouseHandler);//마우스움직일때
	
	ball();
	
	paddle();
	
	brick(3, 8);
	
	window.score = 0;
	window.game_over = false;
	loop();
}

function keydownHandler(input){
	if(input.keyCode == 39){//오른쪽
		window.pRight = true;
	}
	if(input.keyCode == 37){//왼쪽
		window.pLeft = true;
	}
}

function keyupHandler(input){
	if(input.keyCode == 39){//오른쪽
		window.pRight = false;
	}
	if(input.keyCode == 37){//왼쪽
		window.pLeft = false;
	}
}

function mouseHandler(input){
	const relativeX = input.clientX - canvas.offsetLeft;
	//모니터 왼쪽 끝부터의 거리 - 캔버스의 왼쪽 끝부터의 거리 == 실제로 필요한 거리+
	
	if(relativeX > 0 && relativeX < canvas.width - pWidth){
		pX = relativeX;
	}
	//마우스 x가 캔버스 x 사이에 있다면 마우스 x와 패들 x위치를 일치시킴.
}

function gameOver(){
	
	document.location.reload();
	alert('game over!');
	game_over = true;
}

function colideWall(){
	if(x - r <= 0 || x + r >= canvas.width){//양옆
		dx /= Math.abs(dx);
		dx *= -5;
	}
	if(y - r <= 0){//위
		dy /= Math.abs(dy);
		dy *= -5;
	}
	else if(y + r >= canvas.height){//아래 == 게임오버
		gameOver();
	}
	
}

function colidePaddle(){
	if(pX <= x && x <= pX + pWidth && y + r >= canvas.height - pHeight){
		dy = -dy;
	}
}

function colideBrick(){
	for(let i=0; i<row; i++){
		for(let j=0; j<col; j++){
			if(bricks[i][j].x <= x && x <= bricks[i][j].x + bW - bWS){
				if(bricks[i][j].y <= y && y<= bricks[i][j].y + bH/3){
					if(bricks[i][j].exist){
						bricks[i][j].exist = false;
						dy = -dy;
						score++;
					}
				}
			}
		}
	}
}

function move(){
	//이동
	x += dx;
	y += dy;	
	
	//벽과 충돌
	colideWall();
	
	//패들과 충돌
	colidePaddle();
	
	//벽돌과 충돌
	colideBrick();
	
	//패들의 이동
	if(pRight && pX + pWidth + 10 <= canvas.width){
		pX += 10;
	}
	if(pLeft && pX - 10 >= 0){
		pX -= 10;
	}
	
}

function drawBall(){
	scr.beginPath();
	scr.fillStyle = 'tomato';
	scr.arc(x, y, r, 0, 2 * Math.PI);
	scr.fill();
	scr.closePath();
}

function drawPaddle(){
	scr.beginPath();
	scr.fillStyle = 'blue';
	scr.rect(pX, canvas.height - pHeight, pWidth, pHeight);
	scr.fill();
	scr.closePath();
}

function drawBrick(){

	for(let i=0; i<row; i++){
		for(let j=0; j<col; j++){
			
			if(!bricks[i][j].exist){
				continue;
			}		
			scr.beginPath();
			scr.fillStyle = 'green';
			scr.rect(bricks[i][j].x, bricks[i][j].y, bW - bWS, bH/3);
			scr.fill();
			scr.closePath();
		}
	}
}

function drawScore(){
	scr.font = '16px';
	scr.fillStyle = 'black';
	scr.fillText('score: ' + score, 14, 14);
}
function draw(){
	scr.clearRect(0, 0, canvas.width, canvas.height);
	move();
	drawBall();	
	drawPaddle();
	drawBrick();
	drawScore();
}

function loop(){
	draw();
	
	if(score == row*col){
		cancelAnimationFrame(loop);
		document.location.reload();
		alert("you win!");
	}
	else if(game_over == true){
	}
	else{
		requestAnimationFrame(loop);//초당 60번씩 loop를 재귀호출해주는 함수.
	}
	
}
