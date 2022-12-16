// Christy Lin
// DM-UY 1133 - Creative Coding
// Professor Katherine Bennett
// Final Project - Flappy Bird: City Edition

let font;

let player;

let command;

let buildings = [];
let planes = [];
let lives = [];

let lives_left = true;
let score = 0;
let highscore = 0;

let button;

function preload() {
  font = loadFont('assets/PixelGameFont.ttf');
}

function setup() {
  createCanvas(800, 800);
  background(180, 238, 250);

  rectMode(CORNER);
  circle(CENTER);

  command = new p5.SpeechRec('en-US', up_down);
  command.continuous = true;
  command.interimResults = true;
  command.start();

  textFont(font);
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
  buildings.push(new Building(375));
  planes.push(new Plane(50));
  for (let i = 30; i <= 120; i += 45) {
    lives.push(new Heart(i));
  } 

  button = createButton("Play again");

  // Resetting sketch by mouse click referenced from https://www.youtube.com/watch?v=lm8Y8TD4CTM&ab_channel=TheCodingTrain by TheCodingTrain
  button.mousePressed(play_again);  // If the button object is pressed by a mouse, play_again will run
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

  for (let building of buildings) {
    building.display(39, 193, 217);
    building.update();
  }

  for (let plane of planes) {
    plane.display();
    plane.update();
  }

  for (let heart of lives) {
    heart.display();
  }

  // Spawn in different obstacles
  if (random(3) < 0.5) {
    last_building = buildings[buildings.length - 1];
    last_plane = planes[planes.length - 1];
    if (last_building == undefined && last_plane == undefined) {
      random_planes_buildings();
    }
    else if ((last_building != undefined && last_plane != undefined)) {
      if (last_building.past_spawn_point() && last_plane.past_spawn_point()) {
        random_planes_buildings();
      }
    }
  }
  
  score += 0.05;
  textSize(30);
  textAlign(LEFT);
  fill(240, 7, 45);
  strokeWeight(3);
  
  text('SCORE:', 10, 785);
  text(round(score), 120, 785);

  for (let building of buildings) {
    if (player.hits(building, "building")) {
      if (lives_left == false) {
        game_over();
      }
      else {
        buildings.splice(0, 1);
        lives.pop();
        if (lives.length == 0) {
          lives_left = false;
        }
      }
    }

    if (building.off_screen()) {
      buildings.splice(0, 1);
    }
  }

  for (let plane of planes) {
    if (player.hits(plane, "plane")) {
      if (lives_left == false) {
        game_over();
      }
      else {
        planes.splice(planes.indexOf(plane), 1);
        lives.pop();
        if (lives.length == 0) {
          lives_left = false;
        }
      }
    }

    if (plane.off_screen()) {
      planes.splice(0, 1);
    }
  }
}

function game_over() {
  noLoop();
  background(0);

  fill(255, 0, 0);
  noStroke();

  textSize(50);
  textAlign(CENTER);
  text('GAME OVER!', width/2, height/2- 100);
  textSize(30);
  text('SCORE:', width/2- 20, height/2 - 65);
  textAlign(LEFT);
  text(round(score), width/2 + 35, height/2 - 65);
  if (score > highscore + 1) {
    highscore = score;
    textSize(20);
    textAlign(CENTER);
    text('NEW HIGH SCORE!', width/2, height/2 + 20);
  }
  textSize(30);
  textAlign(LEFT);
  text('HIGH SCORE:', width/2 - 120, height/2 + 50);
  text(round(highscore), width/2 + 65, height/2 + 50);
}

function random_planes_buildings() {
  let r = random(0, 7);
  if (r < 1) {
    planes.push(new Plane(50));
    planes.push(new Plane(400));
    buildings.push(new Building(730));
  }
  else if (r > 1 && r < 2) {
    planes.push(new Plane(225));
    buildings.push(new Building(563));
  }
  else if (r > 2 && r < 3) {
    planes.push(new Plane(50));
    buildings.push(new Building(350));
  }
  else if (r > 3 && r < 4) {
    planes.push(new Plane(100));
    buildings.push(new Building(400));
  }
  else if (r > 4 && r < 5) {
    buildings.push(new Building(300));
  }
  else if (r > 5 && r < 6) {
    planes.push(new Plane(450));
  }
  else if (r > 6 && r < 7) {
    planes.push(new Plane(225));
  }
  else {
    planes.push(new Plane(50));
    planes.push(new Plane(200));
    buildings.push(new Building(600));
  }
  


}

function play_again() {
  createCanvas(800, 800);
  background(180, 238, 250);
  noLoop();
  score = 0;
  lives_left = true;

  buildings = [];
  planes = [];

  player = new Player();
  buildings.push(new Building(375));
  planes.push(new Plane(50));
  for (let i = 30; i <= 120; i += 45) {
    lives.push(new Heart(i));
  } 
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
      // Collision detected referenced from https://editor.p5js.org/nguyenadam/sketches/k0OYejKdz by nguyenadam
      let building_one = collideRectCircle(obstacle.x_one, obstacle.y - 50, 150, 475, this.x, this.y, this.size);     // collideRectCircle() is given the locations and sizes of a rectangle and circle. If the two shapes collide the function will return true and saved to variable building_one
      let building_two = collideRectCircle(obstacle.x_two, obstacle.y, 150, 425, this.x, this.y, this.size);          // collideRectCircle() is given the locations and sizes of a rectangle and circle. If the two shapes collide the function will return true and saved to variable building_two
      let building_three = collideRectCircle(obstacle.x_three, obstacle.y + 75, 150, 400, this.x, this.y, this.size); // collideRectCircle() is given the locations and sizes of a rectangle and circle. If the two shapes collide the function will return true and saved to variable building_three
  
      return building_one || building_two || building_three;  // If the circle makes contact with at least one of the rectangles, true will be returned
    }
    if (type == "plane") {
    // Detects if the player makes contact with a plane
    let plane_one = collideRectCircle(obstacle.x + 50, obstacle.y - 50, 100, 25, this.x, this.y, this.size);  // collideRectCircle() is given the locations and sizes of a rectangle and circle. If the two shapes collide the function will return true and saved to variable plane_one
    let plane_two = collideRectCircle(obstacle.x + 25, obstacle.y - 25, 100, 25, this.x, this.y, this.size);  // collideRectCircle() is given the locations and sizes of a rectangle and circle. If the two shapes collide the function will return true and saved to variable plane_two
    let plane_three = collideRectCircle(obstacle.x, obstacle.y, 100, 25, this.x, this.y, this.size);          // collideRectCircle() is given the locations and sizes of a rectangle and circle. If the two shapes collide the function will return true and saved to variable plane_three
    let plane_four = collideRectCircle(obstacle.x + 25, obstacle.y + 25, 100, 25, this.x, this.y, this.size); // collideRectCircle() is given the locations and sizes of a rectangle and circle. If the two shapes collide the function will return true and saved to variable plane_four
    let plane_five = collideRectCircle(obstacle.x + 50, obstacle.y + 50, 100, 25, this.x, this.y, this.size); // collideRectCircle() is given the locations and sizes of a rectangle and circle. If the two shapes collide the function will return true and saved to variable plane_five
    return plane_one || plane_two || plane_three || plane_four || plane_five; // If the circle makes contact with at least one of the rectangles, true will be returned
    }
  }

  up() {
    if (this.y - 30 >= 0) {
      this.y -= 20;
      // console.log("successfully up");
    }
  }

  down() {
    if (this.y + 30 <= height) {
      this.y += 20;
      // console.log("successfully down");
    }
  }
}

class Heart {
  constructor(x) {
    this.x = x;
    this.y = 20;
    this.size = 30;
  }
  display() {
    fill(240, 7, 45);
    strokeWeight(2);
    // Heart Shape by Mithru from https://editor.p5js.org/Mithru/sketches/Hk1N1mMQg
    beginShape(); // Begin drawing a custom shape
    vertex(this.x, this.y); // Uses the x and y coordinates to create a vertex
    bezierVertex(this.x - this.size / 2, this.y - this.size / 2, this.x - this.size, this.y + this.size / 3, this.x, this.y + this.size); // The x location, y location and heart size are utilized in the control and anchor points to draw the left half of the heart
    bezierVertex(this.x + this.size, this.y + this.size / 3, this.x + this.size / 2, this.y - this.size / 2, this.x, this.y); // The x location, y location and heart size are utilized in the control and anchor points to draw the right half of the heart
    endShape(CLOSE);  // End drawing a custom shape using mode CLOSE
  }
}

function up_down() {
  // Split input from speech recognition from https://github.com/IDMNYU/p5.js-speech/blob/master/examples/05continuousrecognition.html by Oliver Wright and R. Luke DuBois
  let mostrecentword = command.resultString.split(' ').pop(); // Creates a string of the speech input, the string is split by spaces into a array of substrings and the last one is popped and stored into new variable mostrecentword
  if (mostrecentword.indexOf("up") !== -1) {                  // Check the index of the first occurence of "up" and compare it to the last
    // console.log("up");
    player.up();
  }
  else if (mostrecentword.indexOf("down") !== -1) {           // Check the index of the first occurence of "down" and compare it to the last
    // console.log("down");
    player.down();
  }
  // console.log(mostrecentword);
}