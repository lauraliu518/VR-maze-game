// level variables
let level1, level2, level3, levelBg, bg;

// font variable
let myFont;

// button variables
let buttonSize, spacing, buttons;

function preload() {
  level1 = loadImage("sources/startingGraphics/level1.svg");
  level2 = loadImage("sources/startingGraphics/level2.svg");
  level3 = loadImage("sources/startingGraphics/level3.svg");
  levelBg = loadImage("sources/startingGraphics/lockedLevel.svg");
  bg = loadImage("sources/startBg.jpg");
  myFont = loadFont("sources/startingGraphics/Bungee-Shade.otf");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  // set button size and spacing
  buttonSize = width / 20;
  spacing = buttonSize / 5;

  // find the buttons position
  buttons = [
    { x: width / 3 - buttonSize / 2, y: height / 2 - buttonSize / 2, image: level1 },
    { x: width / 2 - buttonSize / 2, y: height / 2 - buttonSize / 2, image: level2 },
    { x: 2 * width / 3 - buttonSize / 2, y: height / 2 - buttonSize / 2, image: level3 }
  ];

  levelBg.resize(buttonSize, buttonSize);
  buttons.forEach(button => button.image.resize(buttonSize, buttonSize));
  textFont(myFont);
}

function draw() {
  image(bg, 0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("Select Your Difficulty", width / 2, height / 5);

  // put in buttons and the level
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    image(levelBg, button.x, button.y); 
    image(button.image, button.x, button.y);

    // hovering over the selecting button
    if (mouseX > button.x && mouseX < button.x + buttonSize && mouseY > button.y && mouseY < button.y + buttonSize
    ) {
      stroke(255);
      strokeWeight(4);
      noFill();
      rect(button.x, button.y, buttonSize, buttonSize);
    }
  }
}

function mousePressed() {
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (mouseX > button.x && mouseX < button.x + buttonSize && mouseY > button.y && mouseY < button.y + buttonSize) {
      // redirect to another page
      if (i === 0) {
        startLevel1();
      } else if (i === 1) {
        startLevel2();
      } else if (i === 2) {
        startLevel3();
      }
    }
  }
}

function startLevel1() {
  window.location.href = "level1.html";
}

function startLevel2() {
  window.location.href = "level2.html";
}

function startLevel3() {
  window.location.href = "level3.html";
}