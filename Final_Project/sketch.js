let player;
let building;

function setup() {
  createCanvas(800, 800);
  background(180, 238, 250);

  // video = createCapture(VIDEO);
  // video.size(800, 600);
  // video.hide();

  rectMode(CORNER);
  circle(CENTER);

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

  player = new Player();
  building = new Building();
}

function draw() {
  background(180, 238, 250);

  if (keyIsDown(UP_ARROW)) {
    player.up();
  }

  if (keyIsDown(DOWN_ARROW)) {
    player.down();
  }

  building.display();
  building.update();

  player.display();
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