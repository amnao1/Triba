var mySidebar = document.getElementById("mySidebar");
var lline = document.getElementById("vll");
var rline = document.getElementById("vlr");
var canvas = document.getElementById("kanvas");
var modal = document.getElementById("myModal");
var igrac = document.getElementById("igrac");
var span = document.getElementsByClassName("close")[0];
var ctx = canvas.getContext("2d");
var player = true;
var points = [];
var clicked = [];
var triangles = [];
var validS = false;
var validM = false;
var validE = false;
var indexS = -1;
var indexM = -1;
var indexE = -1;
var clicks = 0;

var point = function(x,y){
	this.x = x;
	this.y = y;
	return this;
};
var triangle = function(s, m, e){
	this.s = s;
	this.m = m;
	this.e = e;
	return this;
};

function drawPoint(x, y, r, color){
	ctx.fillStyle = color;
	ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
}

function restart(){
	clicks = 0;
	validS = false;
	validM = false;
	validE = false;
	indexS = -1;
	indexM = -1;
	indexE = -1;
}
function isThereMorePoints(indexS, indexM, indexE){
	var indexi = [indexS, indexM, indexE];
  var validTriangle = true;
  var morePoints = [];
	indexi = indexi.sort(function(a, b){return a - b});
	//console.log(indexi);
	for(var i=indexi[0]+1; i<indexi[1]; i++){
		if(colinear(points[indexi[0]], points[i], points[indexi[1]])){
			morePoints.push(i);		
		}
	}
	
	for(var i=indexi[1]+1; i<indexi[2]; i++){
		if(colinear(points[indexi[1]], points[i], points[indexi[2]])){
			morePoints.push(i);
		}
	}

	for(var i=indexi[0]+1; i<indexi[2]; i++){
		if(colinear(points[indexi[0]], points[i], points[indexi[2]])){
			morePoints.push(i);
		}
	}
	for(var i = 0; i < morePoints.length; i++) {
		 if(clicked[morePoints[i]] == 1){
       validTriangle = false;
       break;
		 }
	}
	if(validTriangle){
		for(var i = 0; i < morePoints.length; i++){
		  drawPoint(points[morePoints[i]].x, points[morePoints[i]].y, 12, '#a3b567');
		  clicked[morePoints[i]] = 1;
	  }
	}
	
	return validTriangle;
}

function isItValidPoint(x, y){
	var valid = false;
	var index = -1;
	for (var i = 0; i < points.length; i++) {
		if(((((x-points[i].x)*(x-points[i].x))+((y-points[i].y)*(y-points[i].y)))<144)){
			if (clicked[i] == 0){
				x = points[i].x;
				y = points[i].y;
				valid = true;
				if(player){
          drawPoint(x, y, 12, 'green');
				}else{
					drawPoint(x, y, 12, 'orange');
				}
				   
			}
			index = i;
		}
	}
	let p = new point(x, y)
	return [p, valid, index]; 
}

function validTriangle(start, middle, end, indexS, indexM, indexE){
	var valid = true;
	if(colinear(start, middle, end)){
		valid = false;
	}
	if(!isThereMorePoints(indexS, indexM, indexE)){
    valid = false;
	}
	if(triangles.length > 0){

		for(var i = 0; i<triangles.length; i++){
			if(checkIfTrianglesIntersect(triangles[i], [start, middle, end])){
				valid = false;
			}
		}
	}
	return valid;
}

function drawTriangle() {
	var color = 'orange';
	ctx.beginPath();
	if(player){
    color = 'orange';
	}else{
		color = 'green';
	}
	ctx.strokeStyle = color;
	ctx.lineWidth = 5;
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(middle.x, middle.y);
	ctx.lineTo(end.x, end.y);
	ctx.lineTo(start.x, start.y);
	ctx.stroke();
	ctx.closePath();
}

function colinear(a, b, c){
	return ((b.y-a.y) * (c.x-b.x) == (c.y-b.y) * (b.x-a.x));
}
	
function orientation(point1, point2, point3){
	return (((point3.y-point1.y) * (point2.x-point1.x)) > ((point2.y-point1.y) * (point3.x-point1.x)));
}
function checkIfLinesIntersect(line1, line2){	
	if(orientation(line1[0],line1[1],line2[0]) != orientation(line1[0],line1[1],line2[1]) && 
		orientation(line2[0],line2[1],line1[0]) != orientation(line2[0],line2[1],line1[1])){
		return true;
  }
}
function checkIfTrianglesIntersect(triangle1, triangle2) {
	for(var i=0; i<3; i++){
		for(var j=0; j<3; j++){
			if(checkIfLinesIntersect([triangle1[i], triangle1[(i+1)%3]], [triangle2[j], triangle2[(j+1)%3]])){
				return true;
			}
		}
	}
		
	return false; 
}


function startGame(m, n, height, width){

	canvas.width = width;
	canvas.height = height;
	lline.style.height = height - 50;
	rline.style.height = height - 50;
	ctx = canvas.getContext("2d");

	for(let i=1; i<m+1; i++){
		for(let j=1; j<n+1; j++){
			drawPoint(i*70, j*60, 12, '#c8e09b');
			points.push(new point(i*70, j*60));
			clicked.push(0);
		}
	}
	
	
	canvas.addEventListener("mousedown", e => {
		let cX = canvas.getBoundingClientRect().left;
		let cY = canvas.getBoundingClientRect().top;
		clicks++;
		var x = e.clientX - cX;
		var y = e.clientY - cY;
		var rez = isItValidPoint(x, y);
		if(rez[1] == true){
			clicked[rez[2]] = 1;
		}
		
		if (clicks == 1) {
			
			indexS = rez[2];
			validS = rez[1];
			start = rez[0];
			
		}else if(clicks == 2){
			
			indexM = rez[2];
			validM = rez[1];
			middle = rez[0];

		}else if(clicks == 3){
			
			indexE = rez[2];
			validE = rez[1];
			end = rez[0]; 
			
			if(validS && validM && validE){
				if(validTriangle(start, middle, end, indexS, indexM, indexE)){
          console.log([start, middle, end])
					if(player){
						player = false;
						lline.style.borderRightColor = 'orange';
						rline.style.borderLeftColor = 'orange';
					}else{
						player = true;
						lline.style.borderRightColor = 'green';
						rline.style.borderLeftColor = 'green';
					}
					drawTriangle();
					triangles.push([start,middle,end]);
					if(isItOver()){
						endGame();
					}
					restart();
					
				}else{
					alert("Tacke ne cine trougao ili se trougao sijece sa drugim trouglom!");
					clicked[indexM]=0;
					clicked[indexS]=0;
					clicked[indexE]=0;
					drawPoint(start.x, start.y, 12, '#c8e09b');
					drawPoint(middle.x, middle.y, 12, '#c8e09b');
					drawPoint(end.x, end.y, 12, '#c8e09b');
					restart();
				}
			}
			else if(validS && validM && !validE){
				clicked[indexS]=0;
				clicked[indexM]=0;
				drawPoint(start.x, start.y, 12, '#c8e09b');
				drawPoint(middle.x, middle.y, 12, '#c8e09b');
				alert("Kliknuli ste tačku ili tačke koje su već uzete.");
				restart();
				
			}else if(validS && !validM && validE){
				clicked[indexS]=0;
				clicked[indexE]=0;
				drawPoint(start.x, start.y, 12, '#c8e09b');
				drawPoint(end.x, middle.y, 12, '#c8e09b');
				alert("Kliknuli ste tačku ili tačke koje su već uzete.");
				restart();
			}else if(!validS && validM && validE){
				clicked[indexM]=0;
				clicked[indexE]=0;
				drawPoint(end.x, end.y, 12, '#c8e09b');
				drawPoint(middle.x, middle.y, 12, '#c8e09b');
				alert("Kliknuli ste tačku ili tačke koje su već uzete.");
				restart();
			}else if((!validS) && (!validM) && validE){
				clicked[indexE]=0;
				drawPoint(end.x, end.y, 12, '#c8e09b');
				alert("Kliknuli ste tačku ili tačke koje su već uzete.");
				restart();
			}else if(validS && !validM && !validE){
				clicked[indexS]=0;
				drawPoint(start.x, start.y, 12, '#c8e09b');
				alert("Kliknuli ste tačku ili tačke koje su već uzete.");
				restart();
			}else if(!validS && validM && !validE){
				clicked[indexM]=0;
				drawPoint(middle.x, middle.y, 12, '#c8e09b');
				alert("Kliknuli ste tačku ili tačke koje su već uzete.");
				restart();
			}else if(!validS && !validM && !validE){
				clicked[indexM]=0;
				clicked[indexS]=0;
				clicked[indexE]=0;
				alert("Kliknuli ste tačku ili tačke koje su već uzete.");
				restart();
			}
		}
	});
}

function isItOver(){
	var over = true;
	var leftPoints = [];
	for(var i=0; i<clicked.length; i++){
		if(clicked[i] == 0){
      leftPoints.push(points[i]);
		}
	}
	for(var i=0; i < leftPoints.length; i++){
		for(var j=0; j < leftPoints.length; j++){
			for(var k=0; k < leftPoints.length; k++){
         if(validTriangle(leftPoints[i], leftPoints[j], leftPoints[k])){
         	 over = false;
         	 break;
         }
			}
		}
	}
	return over;

}
function endGame(){
  	modal.style.display = "block";
  	if(player){
      igrac.style.color = "orange";
  	}else{
  		igrac.style.color = "green";
  	}
}


//w3-school template//
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
  } else {
    mySidebar.style.display = 'block';
  }
}

function w3_close() {
    mySidebar.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

