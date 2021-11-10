let mirror,
    mirrorCenter, 
    gem,
    slider,
    comparisonVector,
    gemCoords,
    eyeCoords;

function setup() {
  createCanvas(600, 400);
  angleMode(DEGREES);
  
  container = {width: 200, height: 200};
  wall = {depth: 5, height: container.height};
  gem = {width: 40, height: 40};
  
  mirrorCenter = createVector(width/3, height/2);
  let mirrorEdge = (wall.depth/2) + (gem.width/2);
  
  // Vector used to determine the angle of the gem relative to the mirror
  comparisonVector = createVector(0, wall.height/2);
  
  // Make mirror center the center of the grid
  translate(mirrorCenter.x, mirrorCenter.y);
  
  // Initial gem coords
  let gemX = (wall.height/2) * cos(90);
  let gemY = comparisonVector.y - ((gem.height/2) + wall.depth);
  gemCoords = createVector(gemX, gemY);
  
  // Eye coords
  eyeCoords = createVector(wall.height/2, (wall.depth/2) - (wall.height/2));
  
  let padding = 15;

  slider = createSlider(mirrorEdge, container.width - (gem.width/2), gemCoords.x);
  slider.position(mirrorCenter.x - wall.depth, (mirrorCenter.y + (wall.height/2)) + padding);
  slider.style('width', (wall.height + wall.depth) + 'px');
}

function draw() {
  translate(mirrorCenter.x, mirrorCenter.y);
  background(240);
  
  gemCoords.x = slider.value();
  
  drawContainer();
  
  drawMirror();
  
  // Draw incident ray
  line(0, 0, gemCoords.x, gemCoords.y);
  drawGem(gemCoords.x, gemCoords.y,"#d15945");
  
  drawReflection();
  
  reflectionRay();
  
  let incidentAngle = comparisonVector.angleBetween(gemCoords);
  
  drawLineDashes(incidentAngle);
  
  drawAngleArcs(incidentAngle);
}

function drawAngleArcs(angle) {
  // Incident ray arc
  angleArc(90 + angle, 90);
  // Reflection ray arc
  angleArc(270, 270 - angle);
  
  equalityDash(25 * cos(-90 - (angle/2)), 25 * sin(-90 - (angle/2)),-90 - (angle/2));
  equalityDash(25 * cos(90 + (angle/2)), 25 * sin(90 + (angle/2)),-90 + (angle/2));
}

function drawLineDashes(angle) {
  let dash_X = dist(0,0, (gemCoords.x/2) - 2, (gemCoords.y/2) - 2) * cos(90 + angle);
  let dash_Y = dist(0,0, (gemCoords.x/2) - 2, (gemCoords.y/2) - 2) * sin(90 - angle);
  
  let dash2_X = dist(0,0, (gemCoords.x/2) + 2, (gemCoords.y/2) + 2) * cos(90 + angle);
  let dash2_Y = dist(0,0, (gemCoords.x/2) + 2, (gemCoords.y/2) + 2) * sin(90 + angle);
  
  equalityDash(dash_X, dash_Y, angle);
  equalityDash(dash2_X, dash2_Y, angle);
  equalityDash(-(dash_X), dash_Y, -(angle));
  equalityDash(-(dash2_X), dash2_Y, -(angle));
}

function equalityDash(x, y, angle) {
  push();
  translate(x, y);

  let dashX = 5 * cos(angle);
  let dashY = 5 * sin(angle);

  line(dashX, dashY, -dashX, -dashY);
  pop();
}

function angleArc(start, stop) {
  noFill();
  arc(0, 0, 50, 50, start, stop);
}

function reflectionRay() {
  let eye = {width: 40, height: 25};
  let topWallIntersection = (-(wall.height/2)/(-(gemCoords.y/gemCoords.x)));
  
  if (topWallIntersection >= eyeCoords.x - (eye.width/2) && topWallIntersection <= (eyeCoords.x - (eye.width/2))+ eye.width) {
    drawEye(eyeCoords.x, eyeCoords.y, eye, true);
  } else {
    drawEye(eyeCoords.x, eyeCoords.y, eye);
  }
    
  if (topWallIntersection >= 0 && topWallIntersection <= wall.height) {
    line(0, 0, topWallIntersection, -(wall.height/2) + (wall.depth/2));
  } else {
    let rightWallIntersection = -(gemCoords.y/gemCoords.x) * wall.height;
    line(0, 0, wall.height, rightWallIntersection);
  }
}

function drawEye(x, y, dimension, active = false) {
  push();
  noStroke();
  
  // Collision container
  push();
  fill(240);
  
  rect(x - (dimension.width/2), y - (dimension.height/2), dimension.width, dimension.height);
  pop();
  
  // Outer shape
  polygon(x, y, dimension.width, dimension.height, "white")
 
  // Retina
  let color;
  
  if (active) {
    color = "#457cea";
  } else {
    color = "#8e8e8e"
  }
  
  hexagon(x, y - 1, 10, color);
  
  // Pupil
  hexagon(x, y - 1, 6, "black");
  pop();
}

function drawReflection() {
  push();
  drawingContext.setLineDash([5,5]);
  line(-(gemCoords.x), gemCoords.y, 0, 0);
  pop();
  drawGem(-(gemCoords.x), gemCoords.y,"#f0bfb6");
}

function drawGem(x, y, color) {
  push();
  noStroke();
  polygon(x, y, gem.width, gem.height, color);
  pop();
}

function polygon(x, y, width, height, color) {
  push();
  fill(color);
  triangle(x, y + height/2, x + width/2, y, x - width/2, y);
  beginShape();
  vertex(x - 20, y);
  vertex(x - 10, y - 10);
  vertex(x + 10, y - 10);
  vertex(x + 20, y);
  endShape();
  pop();
}

function hexagon(x, y, radius, color) {
  let angle = 360 / 6;
  
  noStroke();
  fill(color);
  
  beginShape();
  for (let a = 0; a < 360; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function drawMirror() {
  push();
  fill(69, 124, 234);
  noStroke();
  rect(-(wall.depth/2), -(wall.height/2), wall.depth, wall.height);
  pop();
}

function drawContainer() {
  push();
  noStroke();
  fill("#535353");
  rect(0, - (wall.height/2), wall.height, wall.depth);
  rect(wall.height, -(wall.height/2), wall.depth, wall.height);
  rect(0,(wall.height/2) - wall.depth, wall.height, wall.depth);
  pop();
}