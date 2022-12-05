let player;
let building;
let birds;

let buildings = [];

// let command;

let button;

function setup() {
  createCanvas(800, 800);
  background(180, 238, 250);

  rectMode(CORNER);
  circle(CENTER);

  // command = new p5.SpeechRec('en-US');

  // Background Buildings
  // noStroke();
  // fill(72, 137, 203);
  // beginShape();
  // vertex(800, 600);
  // vertex(800, 800);
  // vertex(0, 800);
  // vertex(0, 400);
  // vertex(10, 400);
  // vertex(10, 410);
  // vertex(12, 440);
  // vertex(16, 470);
  // vertex(20, 470);
  // vertex(23, 480);
  // endShape(CLOSE);

  // position = createVector(400, 400);
  // velocity = createVector(random(-1, -5), 0);
  // building1 = new Building(velocity);

  // player_position = createVector()
  player = new Player();
  buildings.push(new Building())
  birds = new Birds();
  // building = new Building();
}

function draw() {
  background(180, 238, 250);

  // The key is down functions will be replaced with speech recognition
  // The input will be commands 'up' and 'down' and will call the player up() and down() methods respectively
  if (keyIsDown(UP_ARROW)) {
    player.up();
  }
  
  if (keyIsDown(DOWN_ARROW)) {
    player.down();
  }
  
  if (random(10) < 0.03) {
    buildings.push(new Building());
  }

  for (building of buildings) {
    building.display(39, 193, 217);
    building.update();
  }

  player.display();

  birds.display();
  
  if (player.hits(building)) {
    noLoop();
    background(0);
    fill(255, 0, 0);
    noStroke();
    textSize(50);
    textAlign(CENTER);
    text('Game Over!', width/2, height/2);

    button = createButton("Play again");
    button.mousePressed(play_again);
  }
}

function play_again() {
  createCanvas(800, 800);
  background(180, 238, 250);

  for (building in buildings) {
    buildings.pop();
  }

  rectMode(CORNER);
  circle(CENTER);
  player = new Player();
  buildings.push(new Building())
  loop();
}

class Building {
  constructor() {
    this.x_one = width;
    this.x_two = 725;
    this.x_three = 825;
  }

  display(red, green, blue) {
    stroke(0);
    fill(red, green, blue);
    rect(this.x_one, 325, 150, 475);
    rect(this.x_two, 375, 150, 425);
    rect(this.x_three, 450, 150, 400);
  }

  update() {
    this.x_one -= 5;
    this.x_two -= 5;
    this.x_three -= 5;
  }

}

class Birds {
  constructor() {

  }
  display(red, green, blue) {
    fill(34, 181, 159);
    stroke(102, 230, 250);

    square(674, 26, 25);
    square(637, 63, 25);
    square(600, 100, 25);
    square(637, 137, 25);
  }

}

class Player {
  constructor() {
    this.x = 100;
    this.y = 400;
    this.size = 50;
  }

  display() {
    strokeWeight(3);
    stroke(70, 135, 201);
    fill(95, 191, 242);
    circle(this.x, this.y, this.size);
  }

  hits(building) {
    // Detects if the player games contact with the buildings
    let building_one = collideRectCircle(building.x_one, 325, 150, 475, this.x, this.y, this.size);
    let building_two = collideRectCircle(building.x_two, 375, 150, 425, this.x, this.y, this.size);
    let building_three = collideRectCircle(building.x_three, 450, 150, 400, this.x, this.y, this.size);

    return building_one || building_two || building_three;
  }

  up() {
    if (this.y - 30 >= 0) {
      this.y -= 15;
    }
  }

  down() {
    if (this.y + 30 <= height) {
      this.y += 15;
    }
  }
}