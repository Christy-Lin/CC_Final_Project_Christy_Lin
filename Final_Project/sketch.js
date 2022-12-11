let player;

let building_height = [275, 375, 475];
let plane_y_locations = [50, 75, 100, 125];

let buildings = [];
let planes = [];

let command;
// let command = new p5.SpeechRec('en-US'); 

let button;

function setup() {
  createCanvas(800, 800);
  background(180, 238, 250);

  rectMode(CORNER);
  circle(CENTER);

  command = new p5.SpeechRec('en-US');

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
  buildings.push(new Building(375));
  planes.push(new Plane(random(plane_y_locations)));
  // bird_two = new Birds(600, 100);
  // bird_three = new Birds(600, 125);
  // bird_four = new Birds(600, 150);

  button = createButton("Play again");
  button.mousePressed(play_again);
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
  
  player.display();

  for (building of buildings) {
    building.display(39, 193, 217);
    building.update();
  }

  for (plane of planes) {
    plane.display();
    plane.update();
  }
  
  if (random(10) < 0.5) {
    last_building = buildings[buildings.length - 1];
    if (last_building == undefined) {
      buildings.push(new Building(random(building_height)));
    }
    else {
      if (last_building.past_spawn_point()) {
        buildings.push(new Building(random(building_height)));
      }
    }
  }

  if (random(10) < 0.5) {
    last_plane = planes[planes.length - 1];
    if (last_plane == undefined) {
      planes.push(new Plane(random(plane_y_locations)));
    }
    else {
      if (last_plane.past_spawn_point()) {
        planes.push(new Plane(random(plane_y_locations)));
      }
    }
  }

  if (random(10) < 0.1) {
      last_building = buildings[buildings.length - 1];
      if (last_building == undefined) {
        buildings.push(new Building(building_height[0]));
      }
      else {
        if (last_building.past_spawn_point()) {
          buildings.push(new Building(building_height[0]));
        }
      }
  
      last_plane = planes[planes.length - 1];
      if (last_plane == undefined) {
        planes.push(new Plane(65));
      }
      else {
        if (last_plane.past_spawn_point()) {
          planes.push(new Plane(65));
        }
      }
  }

  if (random(10) < 0.1) {
    last_building = buildings[buildings.length - 1];
    last_plane = planes[planes.length - 1];
    if (last_building == undefined && last_plane == undefined) {
      buildings.push(new Building(500));
      planes.push(new Plane(plane_y_locations[0]));
      planes.push(new Plane(275));
    }
    else {
      if (last_building.past_spawn_point() && last_plane.past_spawn_point()) {
        buildings.push(new Building(500));
        planes.push(new Plane(plane_y_locations[0]));
        planes.push(new Plane(275));
      }
    }

    // if (last_plane == undefined) {
    //   planes.push(new Plane(plane_y_locations[0]));
    //   planes.push(new Plane(275));
    // }
    // else {
    //   if (last_plane.past_spawn_point()) {
    //     planes.push(new Plane(plane_y_locations[0]));
    //     planes.push(new Plane(275));
    //   }
    // }
  }
  
  for (let building of buildings) {
    if (player.hits(building, "building")) {
      noLoop();
      background(0);
      fill(255, 0, 0);
      noStroke();
      textSize(50);
      textAlign(CENTER);
      text('Game Over!', width/2, height/2);
    }

    if (building.off_screen()) {
      buildings.splice(0, 1);
    }
  }

  for (let plane of planes) {
    if (player.hits(plane, "plane")) {
      noLoop();
      background(0);
      fill(255, 0, 0);
      noStroke();
      textSize(50);
      textAlign(CENTER);
      text('Game Over!', width/2, height/2);
    }

    if (plane.off_screen()) {
      planes.splice(0, 1);
    }
  }
}

function play_again() {
  createCanvas(800, 800);
  background(180, 238, 250);
  noLoop();

  buildings = [];
  planes = [];

  player = new Player();
  buildings.push(new Building(random(building_height)));
  planes.push(new Plane(random(plane_y_locations)));
  loop();
}

class Building {
  constructor(y) {
    this.x_one = width + 80;
    this.x_two = 725 + 80;
    this.x_three = 825 + 80;
    this.y = y
  }

  display(red, green, blue) {
    stroke(0);
    fill(red, green, blue);
    rect(this.x_one, this.y - 50, 150, 800);
    rect(this.x_two, this.y, 150, 800);
    rect(this.x_three, this.y + 75, 150, 800);
  }

  update() {
    this.x_one -= 5;
    this.x_two -= 5;
    this.x_three -= 5;
  }

  off_screen() {
    return this.x_one < -200;
  }

  past_spawn_point() {
    return this.x_one < 400;
  }

}

class Plane {
  constructor(y) {
    this.x = width;
    this.y = y;
  }

  display() {
    fill(34, 181, 159);
    stroke(0);

    rect(this.x + 50, this.y - 50, 100, 25);
    rect(this.x + 25, this.y - 25, 100, 25);
    rect(this.x, this.y, 100, 25);
    rect(this.x + 25, this.y + 25, 100, 25);
    rect(this.x + 50, this.y + 50, 100, 25);

  }

  update() {
    this.x -= 5;
  }

  off_screen() {
    return this.x < -200;
  }

  past_spawn_point() {
    return this.x < 400;
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

  hits(obstacle, type) {
    if (type == "building") {
      // Detects if the player makes contact with a building
      let building_one = collideRectCircle(obstacle.x_one, obstacle.y - 50, 150, 475, this.x, this.y, this.size);
      let building_two = collideRectCircle(obstacle.x_two, obstacle.y, 150, 425, this.x, this.y, this.size);
      let building_three = collideRectCircle(obstacle.x_three, obstacle.y + 75, 150, 400, this.x, this.y, this.size);
  
      return building_one || building_two || building_three;
    }
    if (type == "plane") {
    // Detects if the player makes contact with a plane
    let plane_one = collideRectCircle(obstacle.x + 50, obstacle.y - 50, 100, 25, this.x, this.y, this.size);
    let plane_two = collideRectCircle(obstacle.x + 25, obstacle.y - 25, 100, 25, this.x, this.y, this.size);
    let plane_three = collideRectCircle(obstacle.x, obstacle.y, 100, 25, this.x, this.y, this.size);
    let plane_four = collideRectCircle(obstacle.x + 25, obstacle.y + 25, 100, 25, this.x, this.y, this.size);
    let plane_five = collideRectCircle(obstacle.x + 25, obstacle.y + 50, 100, 25, this.x, this.y, this.size);
    return plane_one || plane_two || plane_three || plane_four || plane_five;
    }
  }

  up() {
    if (this.y - 30 >= 0) {
      this.y -= 10;
    }
  }

  down() {
    if (this.y + 30 <= height) {
      this.y += 10;
    }
  }
}