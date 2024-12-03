// level variables
let level1, level2, level3, bg, titleBack;

// font variable
let myFont;

// button variables
let buttonSize, spacing, buttons;

function preload() {
  level1 = loadImage("sources/startingGraphics/button1.png");
  level2 = loadImage("sources/startingGraphics/button2.png");
  level3 = loadImage("sources/startingGraphics/button3.png");
  bg = loadImage("sources/startBg.jpg");
  titleBack = loadImage("sources/startingGraphics/Back.svg"); 
  myFont = loadFont("sources/startingGraphics/Bungee-Shade.otf");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  titleBack.resize(width / 2.5, height / 4);


  // Button size and spacing
  buttonSize = 100; 
  spacing = 100;

  // Calculate starting positions for horizontal layout
  let totalWidth = 3 * buttonSize + 2 * spacing; 
  let startX = (width - totalWidth) / 2; 
  let yPosition = height / 2 - buttonSize / 2; 

  // Initialize buttons with their positions
  buttons = [
    { x: startX, y: yPosition, img: level1 },
    { x: startX + buttonSize + spacing, y: yPosition, img: level2 },
    { x: startX + 2 * (buttonSize + spacing), y: yPosition, img: level3 },
  ];
}

function draw() {
  image(bg, 0, 0, width, height);

  // title
  image(titleBack, width / 2 - titleBack.width / 2, height / 10);
  textAlign(CENTER, CENTER);
  textFont(myFont);
  textSize(50);
  fill(255);
  text("Select Your", width / 2, height / 5 - 30); 
  text("Difficulty", width / 2, height / 5 + 30);

  // make the buttons
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    image(button.img, button.x, button.y, buttonSize, buttonSize);
  }
}

function mousePressed() {
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (
      mouseX > button.x &&
      mouseX < button.x + buttonSize &&
      mouseY > button.y &&
      mouseY < button.y + buttonSize
    ) {
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