// Christy Lin
// DM-UY 1133 - Creative Coding
// Professor Katherine Bennett
// Final Project - Flappy Bird: City Edition

// Font and Music
let font;
let ding;
let death_sound_effect;
let hit_obstacles;
let music;

// Player
let player;

// Speech Commands ("Up", "Down")
let command;

// Objects
let buildings = [];
let planes = [];
let lives = [];
let slows = [];

// Lives and Score Variables
let lives_left = true;
let score = 0;
let highscore = 0;
let update_speed = 3.5;

// Play Again Button
let button;


// Preloads font and sound
// https://www.dafont.com/pixelgamefont.font
// https://pixabay.com/sound-effects/
function preload() {
  font = loadFont('assets/PixelGameFont.ttf');
  ding = loadSound('assets/ding.mp3');
	death_sound_effect = loadSound('assets/death_sound_effect.mp3');
	hit_obstacles = loadSound('assets/hit_obstacles.mp3');
	music = loadSound('assets/music.mp3');
}

// Sets up the game
function setup() {
  createCanvas(800, 800);
  background(180, 238, 250);

  rectMode(CORNER);
  circle(CENTER);

  // Takes in audio commands
  command = new p5.SpeechRec('en-US', up_down);
  command.continuous = true;
  command.interimResults = true;
  command.start();

  textFont(font);

  player = new Player();
  buildings.push(new Building(375));
  planes.push(new Plane(50));
  for (let i = 30; i <= 120; i += 45) {
    lives.push(new Heart(i));
  }

  button = createButton("Play again");

  // Resetting sketch by mouse click referenced from https://www.youtube.com/watch?v=lm8Y8TD4CTM&ab_channel=TheCodingTrain by TheCodingTrain
  button.mousePressed(play_again);  // If the button object is pressed by a mouse, play_again will run
  music.play();
	music.loop();
}

function draw() {
  background(180, 238, 250);

  // Players have the option of playing using the up and down arrow keys
  if (keyIsDown(UP_ARROW)) {
    player.up();
  }
  
  if (keyIsDown(DOWN_ARROW)) {
    player.down();
  }
  
  player.display();

  for (let building of buildings) {
    building.display(39, 193, 217);
    building.update(update_speed);
  }

  for (let plane of planes) {
    plane.display();
    plane.update(update_speed);
  }

  for (let heart of lives) {
    heart.display();
  }

  for (let i = 0; i < slows.length; ++i) {
    slows[i].display();
    slows[i].update(update_speed);
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

  if (update_speed < 8) {
    update_speed += 0.0005;
    // update_speed += 0.01;
  }
  // console.log(update_speed);

  // Display Score
  score += 0.02;
  textSize(30);
  textAlign(LEFT);
  fill(240, 7, 45);
  strokeWeight(3);
  
  text('SCORE:', 10, 785);
  text(round(score), 120, 785);

  for (let building of buildings) {
    if (player.hits(building, "building")) {
      if (lives_left == false) {
				death_sound_effect.play();
        game_over();
      }
      else {
        hit_obstacles.play();
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
				death_sound_effect.play();
        game_over();
      }
      else {
        hit_obstacles.play();
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

  for (let slow of slows) {
    if (player.hits(slow, "slow")) {
      update_speed = 3.5;
      slows.splice(0, 1);
      ding.play();
    }
  
    if (slow.off_screen()) {
      slows.splice(0, 1);
    }
  }
}

// Display the game over screen
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

// Spawns in random arrangements of planes and buildings. Occasionally spawns in a slow object if the game is a certain speed
function random_planes_buildings() {
  let r = random(0, 8);
  let r_ = random(0, 10);
  
  if (r < 1) {
    planes.push(new Plane(50));
    planes.push(new Plane(400));
    buildings.push(new Building(730));
    if (update_speed > 5) {
      if (r_ > 0 && r_ < 3) {
        slows.push(new Slow(250));
      }
      else if (r_ > 3 && r_ < 6) {
        slows.push(new Slow(600));
      }
    }
  }
  else if (r > 1 && r < 2) {
    planes.push(new Plane(225));
    buildings.push(new Building(563));
    if (update_speed > 5) {
      if (r_ > 0 && r_ < 3) {
        slows.push(new Slow(100));
      }
      else if (r_ > 3 && r_ < 6) {
        slows.push(new Slow(425));
      }
    }
  }
  else if (r > 2 && r < 3) {
    planes.push(new Plane(50));
    buildings.push(new Building(350));
      if (update_speed > 5) {
        if (r_ > 0 && r_ < 3) {
          slows.push(new Slow(200));
      }
    }
  }
  else if (r > 3 && r < 4) {
    planes.push(new Plane(100));
    buildings.push(new Building(400));
    if (update_speed > 5) {
      if (r_ > 0 && r_ < 3) {
        slows.push(new Slow(250));
      }
    }
  }
  else if (r > 4 && r < 5) {
    buildings.push(new Building(300));
    if (update_speed > 5) {
      if (r_ > 0 && r_ < 3) {
        slows.push(new Slow(125));
      }
    }
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
    if (update_speed > 5) {
      if (r_ > 0 && r_ < 3) {
        slows.push(new Slow(400));
      }
    }
  }
}

// Restarts the game if the player chooses to play again
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

  update(update_speed) {
    this.x_one -= update_speed;
    this.x_two -= update_speed;
    this.x_three -= update_speed;
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

  update(update_speed) {
    this.x -= update_speed;
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
    if (type == "slow") {
      let collision = collideCircleCircle(obstacle.x, obstacle.y, obstacle.size, this.x, this.y, this.size)
      return collision
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

class Slow {
  constructor(y) {
    this.x = width;
    this.y = y;
    this.size = 40;
  }

  display() {
    fill(240, 197, 18);
    circle(this.x , this.y, this.size);
  }

  update(update_speed) {
    this.x -= update_speed;
  }

  off_screen() {
    return this.x < -20;
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