
let bird;
let birdXPos, birdYPos, button;
let birdSpeed = 0;
let birdAcc = 0.4;
let birdJump = -12;
let birdSize = 60;

let columnSpeed = -10;
let columnWidth = 100;
let columnDistance = 1000;
let columns = [];

let cloud1, cloud2, cloud3;
let clouds = []
let cloudspeed = -3;

let fontsize = 40;
let score = 0;

let isDead;
let submit;
let input;

let backgroundImage;
let backgroundPos = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  clouds = [[0, 100],
  [parseInt(windowWidth/2.5), 200],
  [parseInt(windowWidth/1.2), 400]];
  cloud1 = loadImage("assets/cloud1.png");
  cloud2 = loadImage("assets/cloud2.png");
  cloud3 = loadImage("assets/cloud3.png");
  backgroundImage = loadImage("assets/background.png");
  bird = loadImage("assets/bird.png");

  input = createInput();
  input.position(windowWidth / 2 - input.width/2, windowHeight / 2 + 175)
  submit = createButton("SUBMIT")
  submit.position(windowWidth / 2 - submit.width/2, windowHeight / 2 + 200);
  submit.mousePressed(send);
  
  Start();
}

function draw() {
  UpdateBackground();
  UpdateClouds();
  UpdateBird();
  UpdateColumn();
  UpdateScore();
}

function UpdateBackground() {
  imageMode(CORNER);
  let w = backgroundImage.width;
  let xpos = 0;
  
  while (w / windowWidth > 0) {
    image(backgroundImage, 0+xpos, 0, backgroundImage.width + 20, windowHeight + 20);
    w = w/windowWidth;
    xpos = backgroundImage.width
  }
}

function Start() {
  submit.hide();
  input.hide();
  isDead = true;
  birdSpeed = 0;
  textSize(fontsize * 3);
  textAlign(CENTER);
  text("START", windowWidth / 2, windowHeight / 2);
  button = createButton("START");
  button.position(windowWidth / 2 - button.width/2, windowHeight / 2 + 100);
  button.mousePressed(restart);
  noLoop();
}

function Dead() {
  isDead = true;
  birdSpeed = 0;
  textSize(fontsize * 3);
  textAlign(CENTER);
  fill(255, 50, 50);
  text("DEAD", windowWidth / 2, windowHeight / 2);
  button.textContent = "Restart";
  button.show();
  submit.show();
  input.show();
  noLoop();
}

function send() {
  input.hide();
  submit.hide();
  //Submit here
  //save score and input.value() 
}

function restart() {
  isDead = false;
  birdXPos = windowWidth / 10;
  birdYPos = windowHeight / 3;
  birdSpeed = 0;
  columns = [];
  score = 0;
  button.hide();
  submit.hide();
  input.hide();
  loop();
}

function UpdateClouds() {
  for (let cloudpos of clouds) {
    cloudpos[0] += cloudspeed;
    if (cloudpos[0] < -600) {
      cloudpos[0] = windowWidth;
    }
  }
  image(cloud1, clouds[0][0], clouds[0][1]);
  image(cloud1, clouds[1][0], clouds[2][1]);
  image(cloud1, clouds[2][0], clouds[1][1]);
}

function UpdateBird() {
  fill(255, 255, 0);
  imageMode(CENTER);
  image(bird, birdXPos, birdYPos, birdSize, birdSize);

  birdSpeed += birdAcc;
  birdYPos += birdSpeed;
  if (birdYPos + birdSize / 2 >= windowHeight || birdYPos - birdSize / 2 < 0) {
    Dead();
  }
}

function UpdateColumn() {
  if (columns.length < 1) {
    CreateColumn();
  } else {
    if (columns[columns.length - 1].columnXPos < windowWidth - columnDistance) {
      CreateColumn();
    }
  }
  columns.forEach(function(element) {
    if (
      birdXPos + birdSize / 2 > element.columnXPos &&
      birdXPos - birdSize / 2 <= element.columnXPos + columnWidth
    ) {
      if (
        birdYPos - birdSize / 2 < element.columnTopYHeight ||
        birdYPos + birdSize / 2 > element.columnBottomYPos
      ) {
        Dead();
      }
    }

    if (element.columnXPos < 0 - columnWidth) {
      columns.shift();
      score++;
      return;
    }

    element.columnXPos += columnSpeed;
    fill(50, 205, 50);
    rect(
      element.columnXPos,
      element.columnBottomYPos,
      element.width,
      element.height
    );
    rect(element.columnXPos, 0, element.width, element.columnTopYHeight);

  });
}

function UpdateScore() {
  textSize(fontsize);
  textAlign(CENTER);
  fill(255);
  text(score, windowWidth / 2, 80);
}

function CreateColumn() {
  let randVal = getRndInteger(150, windowHeight - 100);
  var newCol = {
    columnXPos: windowWidth,
    columnBottomYPos: windowHeight - randVal,
    columnTopYHeight: windowHeight - randVal - 250,
    height: windowHeight,
    width: columnWidth
  };
  columns.push(newCol);
}

function keyPressed() {
  if (keyCode == 32) {
    if (isDead) {
      restart();
    } else {
      birdSpeed = birdJump;
    }
  }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
