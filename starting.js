// image variables
let playIcon, hoverIcon, bg, titleBack;

// font variable
let myFont;

// game state variable: 1 for playing, 0 for not playing
let gameState = 0;

// preloading all of the images
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

    // set font
    textFont(myFont);

    // resizing the images
    playIcon.resize(width / 8, height / 8);
    hoverIcon.resize(width / 8, height / 8);
    titleBack.resize(width / 2, height / 4);
    }

function draw() {
    // create the background
    image(bg, 0, 0, width, height);

    // draw title background
    image(titleBack, width / 2 - titleBack.width / 2, height / 4.5 - 50);

    // formatting the text
    fill(255,255,102);
    textAlign(CENTER, CENTER);
    textSize(60);
    noStroke();
    text("Survival Maze ", width / 2, height / 5 + titleBack.height / 2 - 50);

    // make play button
    let playX = width / 2 - playIcon.width / 2;
    let playY = height / 2 - playIcon.height / 2 -50;

    // if the user's mouse is over the play button, allow the icon to hover and indicate it is going to be pressed
    if (mouseX > playX && mouseX < playX + playIcon.width && mouseY > playY && mouseY < playY + playIcon.height) {
        // hover state
        stroke(154, 247, 100);
        strokeWeight(10);
        noFill();
        rect(playX, playY + 30, hoverIcon.width, hoverIcon.height, 20);

        image(hoverIcon, playX, playY + 30);
    } else {
        // original play icon state
        image(playIcon, playX, playY + 50);
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
        // once the button is clicked, go to the levels page
        window.location.href = "levels.html";
    }
}