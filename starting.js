// elizabeth's tasks, minimap/dynamic texture?, trees, starting page, lighting?, time of day and timer somewhere, loading page

// image variables
let playIcon, hoverIcon, bg, titleBack;

// font variable
let myFont;

// game state variable: 1 for playing, 0 for not playing
let gameState = 0;

function preload() {
  playIcon = loadImage("sources/startingGraphics/playIcon1.svg"); 
  hoverIcon = loadImage("sources/startingGraphics/playIcon2.svg"); 
  bg = loadImage("sources/startBg.jpg"); 
  myFont = loadFont("sources/startingGraphics/Bungee-Shade.otf"); 
  titleBack = loadImage("sources/startingGraphics/Back.svg"); 
}

function setup() {
  // canvas and buffer setup
  buffer = createGraphics(window.innerWidth, window.innerHeight);
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  // set font and resize assets
  textFont(myFont);
  playIcon.resize(width / 8, height / 8);
  hoverIcon.resize(width / 8, height / 8);
  titleBack.resize(width / 1.5, height / 6);
}

function draw() {
  // create the background
  image(bg, 0, 0, width, height);

  // draw title background and text
  image(titleBack, width / 2 - titleBack.width / 2, height / 4.5);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(75);
  text("Maze Runner", width / 2, height / 5 + titleBack.height / 2);

  // make play button
  let playX = width / 2 - playIcon.width / 2;
  let playY = height / 2 - playIcon.height / 2;
  if (mouseX > playX && mouseX < playX + playIcon.width && mouseY > playY && mouseY < playY + playIcon.height) {
    // hover state
    image(hoverIcon, playX, playY);
  } else {
    // original state
    image(playIcon, playX, playY);
  }
}

function mousePressed() {
    gameState = 1;
    console.log("Game Started!");

    if(window.localStorage.getItem("gameState") == null){
    }else{
        gameState = window.localStorage.getItem("gameState");
    }

    let playX = width / 2 - playIcon.width / 2;
    let playY = height / 2 - playIcon.height / 2;

  // check if the button is clicked
  if (mouseX > playX && mouseX < playX + playIcon.width && mouseY > playY && mouseY < playY + playIcon.height) {
    window.location.href = "levels.html";
  }
}