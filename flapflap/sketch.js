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
let clouds = [];
let cloudspeed = -3;

let fontsize = 40;
let score = 0;

let isDead;
let submit;
let input;

let backgroundImage;
let backgroundPos = [];

// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyCCfmMisfHuRmqj80OXaZHIKanapblScNI",
  authDomain: "flappybird-scoreboard-kode.firebaseapp.com",
  databaseURL: "https://flappybird-scoreboard-kode.firebaseio.com",
  projectId: "flappybird-scoreboard-kode",
  storageBucket: "flappybird-scoreboard-kode.appspot.com",
  messagingSenderId: "222979090768",
  appId: "1:222979090768:web:a2686312cebc92e4012455"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function setup() {
  createCanvas(windowWidth, windowHeight);
  clouds = [
    [0, 100],
    [parseInt(windowWidth / 2.5), 200],
    [parseInt(windowWidth / 1.2), 400]
  ];
  cloud1 = loadImage("assets/cloud1.png");
  cloud2 = loadImage("assets/cloud2.png");
  cloud3 = loadImage("assets/cloud3.png");
  backgroundImage = loadImage("assets/background.png");
  bird = loadImage("assets/bird.png");

  input = createInput();
  input.position(windowWidth / 2 - input.width / 2, windowHeight / 2 + 175);
  submit = createButton("SUBMIT");
  submit.position(windowWidth / 2 - submit.width / 2, windowHeight / 2 + 200);
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
  let screen = windowWidth;
  let xpos = 0;

  while (xpos < screen) {
    image(
      backgroundImage,
      0 + xpos,
      0,
      backgroundImage.width + 20,
      windowHeight + 20
    );
    xpos += backgroundImage.width;
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
  button.position(windowWidth / 2 - button.width / 2, windowHeight / 2 + 100);
  button.mousePressed(restart);
  scoreboardbtn = createButton("SCOREBOARD");
  scoreboardbtn.position(
    windowWidth / 2 - scoreboardbtn.width / 2,
    windowHeight / 2 + 250
  );
  scoreboardbtn.mousePressed(() => window.location.href = "./scoreboard.html");
  noLoop();
}

function Dead() {
  isDead = true;
  textSize(fontsize * 3);
  textAlign(CENTER);
  fill(255, 50, 50);
  text("DEAD", windowWidth / 2, windowHeight / 2);
  birdSpeed = 0;
  button.textContent = "Restart";
  button.show();
  if (score > 0) {
    submit.show();
    input.show();
  }
  noLoop();
}

function send() {
  input.hide();
  submit.hide();
  scoreboardbtn.show();
  if (input.value()) {
    db.collection("scoreboard")
      .add({
        name: input.value(),
        score: score
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        input.value("")
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }
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
  scoreboardbtn.hide();
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
  if (isDead) return;
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
        return;
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
  let randVal = getRndInteger(50, windowHeight - 300);
  var newCol = {
    columnXPos: windowWidth,
    columnTopYHeight: randVal,
    columnBottomYPos: randVal + 250,
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
      jump();
    }
  }
}

function jump() {
  birdSpeed = birdJump;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
