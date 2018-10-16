var field = [];
var margin = {x: 0, y: 0};
var grid = {xLength:0, yLength:0, xElements:0, yElements:0};
var particles = [];
var id = 0;
var fieldShown = -1;
var drawBackground = true;




//function currentAngle(_this) {return atan2(mouseY-_this.center.y, mouseX-_this.center.x)+HALF_PI};
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  var arrowSize = 4;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function drawWords(x, y) {
  textAlign(CENTER)
  noStroke()
  fill(0);
  text("click to generate a particle", x, y+10, )
  text("press SPACEBAR to toggle vector field view", x, height-10)
}


function particle(_x, _y) {

  this.pos = createVector(0,0)
  this.vel = createVector(0,0)
  this.acc = createVector(0,0)
  this.size = 10;

  this.pos.x = _x;
  this.pos.y = _y;

  this.update = function() {

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.limit(15);

    if (this.pos.x > width) {
      this.pos.x=0;
    } else if (this.pos.x < 0) {
      this.pos.x=width;
    }
    if (this.pos.y > height) {
      this.pos.y=0;
    } else if (this.pos.y < 0) {
      this.pos.y=height;
    }
  }

  this.draw = function() {
    fill(255,0,0)
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    console.log("ciao")
    }
}

function fieldElement(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.size = grid.xLength/grid.xElements;
  this.center = createVector(margin.x+this.x*this.size+this.size/2, margin.y+this.y*this.size+this.size/2)
  this.f = createVector(0,0);
  this.v =  p5.Vector.fromAngle(atan2(mouseY-this.center.y, mouseX-this.center.x));
  this.global = createVector(this.x*this.size+margin.x, this.y*this.size+margin.y);

  this.draw = function() {
    drawArrow(this.center, this.v.mult(15), 'gray');
    //rect(margin.x+this.x*this.size, margin.y+this.y*this.size,  margin.y+(this.y+1)*this.size, this.size)
  }

  this.update = function() {
    currentAngle = p5.Vector.fromAngle(atan2(mouseY-this.center.y, mouseX-this.center.x)+HALF_PI)
    this.v.add(currentAngle).mult(0.05);
    this.v.normalize();
  }
}

function preload(){
    font = loadFont('assets/SourceSansPro-Bold.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(1000)
  colorMode(RGB, 255)

  margin.y += Math.floor(height/5);
  margin.x += Math.floor((width-(height*3/5))/2);

  grid.xLength = margin.y*3;
  grid.xElements = 20;
  grid.yElements = 20;

  colorMode = (RGB, 100);


  for (var y = 0; y < grid.yElements; y ++) {
    for (var x = 0; x < grid.xElements; x ++) {
      field.push(new fieldElement(x,y));
    }
  };
}

function mousePressed() {
  particles.push(new particle(mouseX, mouseY));
  particles[particles.length - 1].acc.x= random(1);
  particles[particles.length - 1].acc.y= random(1);
  return false;
  console.log(1)
};

function draw() {

  if (keyIsDown(32)) {fieldShown *= -1;};

  for (var i = 0; i < field.length; i++) {
    field[i].update();
  };

  if (drawBackground == true) {
    background(1000);
    drawWords(width/2, 5);
  };

  if (fieldShown == 1) {
    drawBackground = true;
      for (var i = 0; i < field.length; i++) {
        fill(150);
        field[i].draw();
      }
    } else if (fieldShown == -1) {
  drawBackground = false;
  }

for (var i = 0; i < particles.length; i++) {
  if ((particles[0].pos.x > margin.x)&&(particles[i].pos.y > margin.y)&&(particles[i].pos.x < (width-margin.x))&&(particles[i].pos.y < (height-margin.y))) {
  id = Math.floor((((particles[i].pos.x-margin.x)/(grid.xLength/grid.xElements)) + Math.floor(((particles[i].pos.y-margin.y)/(grid.xLength/grid.xElements)))*grid.xElements))
  } else { id = null; }

  if ((0 < id) && (id < field.length)) {particles[i].acc.add(field[id].v)};

  particles[i].update();
  particles[i].draw();
  }
}
