var mySidebar = document.getElementById("mySidebar");
var lline = document.getElementById("vll");
var rline = document.getElementById("vlr");
var canvas = document.getElementById("kanvas");
var modal = document.getElementById("myModal");
var igrac = document.getElementById("igrac");
var span = document.getElementsByClassName("close")[0];
var ctx = canvas.getContext("2d");
const populationSize = 15;
const mutationRate = 0.1;
const numGenerations = 60;
var player = true;
var points = [];
var clicked = [];
var triangles = [];
var validPoints = [];
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

function generateFirstPlayer(){
  player = Math.random() < 0.5;
  firstPlayer = player;
}

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
//Da li postoje tacke na stranicama trougla
function isThereMorePoints(indexS, indexM, indexE){
  let indexi = [indexS, indexM, indexE];
  let validTriangle = true;
  let morePoints = [];
  indexi.sort(function(a, b){return a - b});
  for(let i=indexi[0]+1; i<indexi[1]; i++){
    if(colinear(points[indexi[0]], points[i], points[indexi[1]])){
      morePoints.push(i);		
    }
  }

  for(let i=indexi[1]+1; i<indexi[2]; i++){
    if(colinear(points[indexi[1]], points[i], points[indexi[2]])){
      morePoints.push(i);
    }
  }

  for(let i=indexi[0]+1; i<indexi[2]; i++){
    if(colinear(points[indexi[0]], points[i], points[indexi[2]])){
      morePoints.push(i);
    }
  }
  return morePoints;
}

function isItValidPoint(x, y){
  let valid = false;
  let index = -1;
  for (let i = 0; i < points.length; i++) {
    if(((((x-points[i].x)*(x-points[i].x))+((y-points[i].y)*(y-points[i].y)))<144)){
      if (clicked[i] == 0){
        x = points[i].x;
        y = points[i].y;
        valid = true;
        drawPoint(x, y, 12, 'orange');			   
      }
      index = i;
    }
  }
  let p = new point(x, y)
  return [p, valid, index]; 
}

function isItValidPointAI(point){
  let valid = false;
  let index = points.indexOf(point);
  if (clicked[index] == 0){
    valid = true;		   
  }
  return [valid, index]; 
}


function validTriangle(start, middle, end, indexS, indexM, indexE){
  let valid = true;
  var morePoints = isThereMorePoints(indexS, indexM, indexE);
  if(colinear(start, middle, end)){
    valid = false;
  }
  if(valid && triangles.length != 0){
    for(let i = 0; i<triangles.length; i++){
      if(checkIfTrianglesIntersect(triangles[i], [start, middle, end])){
        valid = false;
      }
    }
  }
  if(valid && morePoints.length > 0){
    for(let i = 0; i < morePoints.length; i++) {
      if(clicked[morePoints[i]] == 1){
        valid = false;
        break;
      }
    }
  }
  return valid;
}

function drawTriangle() {
  var color = 'orange';
  ctx.beginPath();
  if(player){
    color = 'green';
  }else{
    color = 'orange';
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
  for(let i=0; i<3; i++){
    for(let j=0; j<3; j++){
      if(checkIfLinesIntersect([triangle1[i], triangle1[(i+1)%3]], [triangle2[j], triangle2[(j+1)%3]])){
        return true;
      }
    }
  }
  return false; 
}


function generateRandomSolution(){
  const triangle = [];
  for (let i = 0; i < 3; i++) {
    const rPoint = generateRandomPoint();
    triangle.push(rPoint);
  }
  if(validTriangle(triangle[0], triangle[1], triangle[2], points.indexOf(triangle[0]), points.indexOf(triangle[1]), points.indexOf(triangle[2]))){
    return triangle;
  }else{
    return generateRandomSolution();
  }
}

function getValidPoints() {
  var validPoints = [];
  for(var i=0; i<clicked.length; i++){
    if(clicked[i] == 0){
      validPoints.push(points[i]);
    }
  } 
  return validPoints;          
}

function startGameAI(m, n, height, width){
  generateFirstPlayer();
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
  if (player){
    playerAI();
  }else{
    lline.style.borderRightColor = 'orange';
    rline.style.borderLeftColor = 'orange';
  }
}

function playerAI(){
  var bestSolution = runGeneticAlgorithm(populationSize, mutationRate, numGenerations);

  indexS = points.indexOf(bestSolution[0]);
  indexM = points.indexOf(bestSolution[1]);
  indexE = points.indexOf(bestSolution[2]);
  var morePoints = isThereMorePoints(indexS, indexM, indexE);
  start = bestSolution[0];
  middle = bestSolution[1];
  end = bestSolution[2];
  clicked[indexS] = 1;
  clicked[indexM] = 1;
  clicked[indexE] = 1;
  drawPoint(start.x, start.y, 12, "green");
  drawPoint(middle.x, middle.y, 12, "green");
  drawPoint(end.x, end.y, 12, "green");
  for(let i = 0; i < morePoints.length; i++) {
    drawPoint(points[morePoints[i]].x, points[morePoints[i]].y, 12, '#a3b567');
    clicked[morePoints[i]] = 1;
  }
  drawTriangle();
  triangles.push([start,middle,end]);
  lline.style.borderRightColor = 'orange';
  rline.style.borderLeftColor = 'orange';
  player = false;
  if(isItOver()){
    endGame();
  }
  restart();
}

function runGeneticAlgorithm(populationSize, mutationRate, numGenerations) {
  var population = [];
  for (let i = 0; i < populationSize; i++) {
    const randomSolution = generateRandomSolution();
    population.push(randomSolution);
  }
  function findBestSolution() {
    let bestIndex = 0;
    let bestFitness = calculateFitness(population[0]);
    for (let i = 1; i < population.length; i++) {
      const fitness = calculateFitness(population[i]);
      if (fitness > bestFitness) {
        bestIndex = i;
        bestFitness = fitness;
      }
    }

    return bestIndex;
  }

  function evolve() {
    const newPopulation = [];
    const bestI = findBestSolution();

    newPopulation.push(population[bestI]);

    while (newPopulation.length < populationSize) {
      const parent1 = selection(population);
      const parent2 = selection(population);
      const child = crossover(parent1, parent2);
      if (Math.random() < mutationRate) {
        mutation(child);
      }
      newPopulation.push(child);
    }
    population.splice(0, populationSize, ...newPopulation);
  }

  for (let generation = 0; generation < numGenerations; generation++) {
    evolve();
  }

  const bestIndex = findBestSolution();
  return population[bestIndex];
}


function calculateFitness(triangle) {
  let fitness = 0;
  const index0 = points.indexOf(triangle[0]);
  const index1 = points.indexOf(triangle[1]);
  const index2 = points.indexOf(triangle[2]);
  var morePoints = isThereMorePoints(index0, index1, index2);

  if(!validTriangle(triangle[0], triangle[1], triangle[2], index0, index1, index2)){
    fitness-=1000;
  }else{
    fitness+=morePoints.length;
  }
  
  return fitness;
}


function selection(population){
  var totalFitness = 0;
  for(var i=0; i<population.length; i++){
    totalFitness += calculateFitness(population[i]);
  }

  const randomValue = Math.random() * totalFitness;
  let preFitness = 0;
  for (let i = 0; i < population.length; i++) {
    preFitness += calculateFitness(population[i]);
    if (preFitness >= randomValue) {
      return population[i];
    }
  }
  return population[0];
}

function crossover(parent1, parent2) {
  const crossoverPoint = Math.floor(Math.random() * 3);
  const child = [
    parent1[0], 
    parent1[1],
    parent2[crossoverPoint], 
    ];

    return child;
  }

  function mutation(solution) {
  const mutateIndex = Math.floor(Math.random() * 3);
  const newPoint = generateRandomPoint();

  triangle[mutateIndex] = newPoint;
}

function generateRandomPoint() {
  const randomPoint = points[Math.floor(Math.random()*clicked.length)];
  if(isItValidPointAI(randomPoint)[0]){
    return randomPoint;
  }else{
    return generateRandomPoint();
  }
}

canvas.addEventListener("mousedown", e => {
  var cX = canvas.getBoundingClientRect().left;
  var cY = canvas.getBoundingClientRect().top;
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

    console.log(indexS+" "+indexM+" "+indexE);
    console.log(validS+" "+validM+" "+validE);
    if(validS && validM && validE){
      if(validTriangle(start, middle, end, indexS, indexM, indexE)){
        var morePoints = isThereMorePoints(indexS, indexM, indexE);
        if(morePoints.length > 0){
          for(var i=0; i<morePoints.length; i++){
            drawPoint(points[morePoints[i]].x, points[morePoints[i]].y, 12, '#a3b567');
            clicked[morePoints[i]] = 1;
          }
        }
        drawTriangle();
        triangles.push([start,middle,end]);
        lline.style.borderRightColor = 'green';
        rline.style.borderLeftColor = 'green';
        player = true;

        if(isItOver()){
          endGame();
        }else{
          playerAI(); 
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


function isItOver(){
  var over = true;
  var leftPoints = [];
  for(var i=0; i<clicked.length; i++){
    if(clicked[i] == 0){
    	leftPoints.push([points[i], i]);
    }
  }
  for(var i=0; i < leftPoints.length; i++){
    for(var j=0; j < leftPoints.length; j++){
      for(var k=0; k < leftPoints.length; k++){
        if(validTriangle(leftPoints[i][0], leftPoints[j][0], leftPoints[k][0], leftPoints[i][1], leftPoints[j][1], leftPoints[k][1])){
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