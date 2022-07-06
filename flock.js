let flock;
let foodX, foodY;
let food;

function setup() {
  createCanvas(640, 360);
  createP("Drag the mouse to generate new boids.");

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 10; i++) {
    let b = new Boid(width / 2,height / 2);
    flock.addBoid(b);
  }

  foodX = random(640);
  foodY = 0;
  food = circle(foodX, foodY, 10);
}

function draw() {
  background(58,72,107);

  for(let i = 0; i < 660; i += 40){
    fill(205,162,130);
    noStroke();
    circle(i, 360, 60); 
  }

  noStroke();
  fill(114,159,98);
  circle(60, 310, 30);
  fill(58,72,107);
  circle(80, 310, 30);
  fill(114,159,98);
  circle(60, 290, 30);
  fill(58,72,107);
  circle(40, 290, 30);
  fill(114,159,98);
  circle(60, 270, 30);
  fill(58,72,107);
  circle(80, 270, 30);
  fill(114,159,98);
  circle(60, 250, 30);
  fill(58,72,107);
  circle(40, 250, 30);

  stroke("#000000");
  fill(111,105,102);
  ellipse(70, 320, 40, 30);
  ellipse(50, 330, 30, 20);



  noStroke();
  fill(114,159,98);
  circle(600, 310, 30);
  fill(58,72,107);
  circle(620, 310, 30);
  fill(114,159,98);
  circle(600, 290, 30);
  fill(58,72,107);
  circle(580, 290, 30);
  fill(114,159,98);
  circle(600, 270, 30);
  fill(58,72,107);
  circle(620, 270, 30);
  fill(114,159,98);
  circle(600, 250, 30);
  fill(58,72,107);
  circle(580, 250, 30);

  stroke("#000000");
  fill(111,105,102);
  ellipse(610, 320, 40, 30);
  ellipse(590, 330, 30, 20);

  // catcher
  fill(205,205,205);
  ellipse(mouseX, mouseY, 30, 20);

  //food
  fill("#cb4a34");
  noStroke();
  food = circle(foodX, foodY, 10);
  if(foodY > height){
    foodX = random(width);
    foodY = 0;
  }else{
    foodY += 1;
  }


  flock.run();
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  // this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  let avo = this.avoid(boids);      // Avoid walls
  let skf = this.food(boids);
  // Arbitrarily weight these forces
  sep.mult(10.0);
  ali.mult(2.0);
  coh.mult(1.0);
  avo.mult(5.0);
  skf.mult(1.5);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
  this.applyForce(avo);
  this.applyForce(skf);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  fill(127);
  stroke(200);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
  beginShape();
  vertex(0, -this.r * 3);
  vertex(-this.r*3, this.r * 3);
  vertex(this.r*3, this.r * 3);
  endShape(CLOSE);

  ellipse(0, this.r*4, this.r*6, this.r*4);
  noStroke();
  fill(58,72,107);
  ellipse(0, this.r*5, this.r*7, this.r*3);

  fill(127);
  stroke(200);
  beginShape();
  vertex(0, this.r*2);
  vertex(-this.r, this.r*4);
  vertex(this.r, this.r*4);
  endShape(CLOSE);

  circle(this.r*0.5, -this.r, 2);
  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}

Boid.prototype.food = function(boids){
  let sum = createVector(foodX, foodY);   // Start with empty vector to accumulate all locations
  return this.seek(sum);
}

Boid.prototype.avoid = function(boids) {
  let steer = createVector(0, 0);
  if (this.position.x <= 0 ) {
    steer.add(createVector(1, 0));
  }
  if (this.position.x > 640) { // width of canvas
    steer.add(createVector(-1, 0));
  }
  if (this.position.y <= 0) {
    steer.add(createVector(0, 1));
  }
  if (this.position.y > 300) { // height of canvas
    steer.add(createVector(0, -1));
  }

  // avoiding catcher
  if(this.position.x < mouseX+10 && this.position.x > mouseX-10 &&
    this.position.y < mouseY+10 && this.position.y > mouseY-10){
      if(this.position.x < mouseX){
        steer.add(createVector(-1, 0));
      }
      if(this.position.x >= mouseX){
        steer.add(createVector(1, 0));
      }
      if(this.position.y < mouseY){
        steer.add(createVector(0, -1));
      }
      if(this.position.y >= mouseY){
        steer.add(createVector(0, 1));
      }
  }
  
  return steer;
}


