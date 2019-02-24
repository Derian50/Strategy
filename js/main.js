 var canvas = document.getElementById("canvas");
 var ctx = canvas.getContext("2d");
 canvas.style.background = "white";
 var width = 800,
 	 height = 600
canvas.width = width;
canvas.height = height;
ctx.font = "100px Comic Sans MS"

//объекты для игры
var buttons = {

	width: 60,
	height: 60,

	x: [],
	y: 16,

	img: [],
	colors: ["gray","green","yellow","blue", "black"]
}
var lines = {
	width: width,
	height:  2,
	count:  5,
	distance:  100,
	y : []
}
var circles = {
	radius: 24,
	x: [],
	y: [],
	countInLine: 4,
	builds: []
}

var money = {
	cash: 1000,
	income: 0
}
var units = {
	x: [],
	y: [],
	type: [],
	xp: [],
	atack: []
}
var createButtons = function(){

	for(var i = 0; i < 8; i++){
		buttons.x[i] = 244+(buttons.width+8)*i;
	}
}
var createLines = function(){
	for(var i = 0; i < lines.count; i++){
		lines.y[i] = 96+i*lines.distance;
	}
}
var createCircles = function(){

	ctx.lineWidth = 3; 
	var z = 0;
	for(var i = 0; i < lines.count; i++){
		for(var j = 0; j < circles.countInLine; j++){
			circles.x[z] = 44+62*j;
			circles.y[z] = 150+100*i;
			z++;
		}
	}
}
createButtons();
createCircles();
createLines();
var clickStatus = 0; //0 - ничего не нажато, 1 - выбор места для здания, 2 - выбора линии для юнита
var choiseActiveBuild = 0;
var choiseActiveUnit = 0;
var WhatButtonClick = function(x,y){
	for(var i = 0; i < buttons.x.length; i++){
		if(x > buttons.x[i] && x < buttons.x[i]+buttons.width && y < (buttons.y+buttons.height)){
			if( i === 0 && money.cash >= 100){
				choiseActiveBuild = i+1;
				clickStatus = 1;
			}else if (i === 1 && money.cash >= 400){
				choiseActiveBuild = i+1;
				clickStatus = 1;
			}else if(i === 2 && money.cash >= 100){
				choiseActiveUnit = 1;
				clickStatus = 2;
			}else if(i === 3 && money.cash >= 100){
				choiseActiveUnit = 2;
				clickStatus = 2;
			}
			console.log("click status " + clickStatus);
			break;
		}
	}
}
var WhatCircleClick = function(x,y){
	for(var i = 0; i < lines.count*circles.countInLine; i++){
			if(x > circles.x[i]-circles.radius && x < circles.x[i]+circles.radius && y > circles.y[i]-circles.radius && y < circles.y[i]+circles.radius){
				circles.builds[i] = choiseActiveBuild;
				
				if( choiseActiveBuild === 1){
					money.income+=1;
					money.cash-=100;
				}else if(choiseActiveBuild === 2 ){
					money.income+=5;
					money.cash-=400;
				}
				choiseActiveBuild = 0;
				clickStatus = 0;
			}
	}
}
var WhatLineClick = function(x,y){
	for(var i = 0; i < lines.count; i++){
		if(y > lines.y[i] && y < lines.y[i]+100){
			console.log("ChoiseActiveUnit" + choiseActiveUnit);
			if(choiseActiveUnit === 1){
				units.x.push(-64);
				units.y.push(118+100*i);
				units.type.push(1);
				units.xp.push(3);
				units.atack.push(1);
				money.cash-=100;
			}else if(choiseActiveUnit === 2){
				units.x.push(-64);
				units.y.push(118+100*i);
				units.type.push(2);
				units.xp.push(2);
				units.atack.push(1);
				money.cash-=100;
			}
			choiseActiveUnit = 0;
			clickStatus = 0;
		}
	}
}
window.onclick = function(e){
	if(clickStatus === 1){
		WhatCircleClick(e.offsetX, e.offsetY);
	}else if(clickStatus === 2){
		WhatLineClick(e.offsetX, e.offsetY);
	}
	WhatButtonClick(e.offsetX, e.offsetY);
	if(!isStartGame){
		isStartGame = true;
		gameLoop();
	}
	//fullScreen(canvas);
}



/*function fullScreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.webkitrequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.mozRequestFullscreen) {
    element.mozRequestFullScreen();
  }
}*/
var drawButtons = function(){
	for(var i = 0; i < buttons.x.length; i++){
		ctx.fillStyle = buttons.colors[i];
		ctx.fillRect(buttons.x[i], buttons.y, buttons.width, buttons.height);
	}
	ctx.fillStyle = "black";
}

var drawLines = function(){
	for(var i = 0; i < lines.count; i++){
		ctx.fillRect(0, lines.y[i],lines.width,lines.height);
	}
}
var drawMoney = function(){
	ctx.font = "30px Comic Sans MS";
	money.cash += money.income/50;
	ctx.fillText(Math.round(money.cash) + "$" + "+" + money.income + "$/с", 16, 64,);
}
var drawCircles = function(){

	for(var i = 0; i < lines.count*circles.countInLine; i++){
		if(circles.builds[i] === undefined){		
		ctx.beginPath ();
		ctx.arc (circles.x[i], circles.y[i], circles.radius, 0, Math.PI * 2, false);
		ctx.stroke ();
		}
	}
}
var drawText = function(){
	ctx.font = "12px Comic Sans MS";
	ctx.fillText("100$ 1$/с", 240, 90);
	ctx.fillText("400$ 5$/с", 305, 90);
	ctx.fillText("Гоп-пехота", 380, 88);
	ctx.fillText("Гоп-лучник все по 100$", 450, 88);
}
var drawBuilds = function(){
	for(var i = 0; i < lines.count*circles.countInLine; i++){
		if(circles.builds[i] === 1){
			ctx.fillStyle = "gray";
			ctx.fillRect(circles.x[i]-circles.radius, circles.y[i]-circles.radius, circles.radius*2, circles.radius*2);
		}else if(circles.builds[i] === 2){
			ctx.fillStyle = "green";
			ctx.fillRect(circles.x[i]-circles.radius, circles.y[i]-circles.radius, circles.radius*2, circles.radius*2);
		}
	}
}
var drawArrows = function(){
	for(var i = 0; i < 5; i++){
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.moveTo(300,150+100*i);
		ctx.lineTo(400,150+100*i);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(370, 130+100*i);
		ctx.lineTo(400, 150+100*i);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(370, 170+100*i);
		ctx.lineTo(400,150+100*i);
		ctx.stroke();
	}
}
var checkClickStatus = function(){
	if(clickStatus === 1){
		drawCircles();
	}else if(clickStatus === 2){
		drawArrows();
	}
}
var drawAndMoveUnits = function(){
	for(var i = 0; i < units.x.length; i++){
		if(units.y[i] === units.y[i+1] && units.x[i+1]+36 > units.x[i]){
			units.x[i+1]-=4;
		}
		units.x[i]+=0.3;
		if(units.type[i] === 1) ctx.fillStyle = "yellow";
		if(units.type[i] === 2) ctx.fillStyle = "blue";
		ctx.fillRect(units.x[i], units.y[i], 32,64);
	}
}
















var gameLoop = function(){
	ctx.clearRect(0,0,width,height);
	checkClickStatus();
	drawButtons();
	drawLines();
	drawMoney();
	drawText();	
	drawBuilds();
	drawAndMoveUnits();
	requestAnimationFrame(gameLoop);
}
var isStartGame = false;
var startGame = function(){
	ctx.fillText("Начать игру", 100, 200)
}
startGame();