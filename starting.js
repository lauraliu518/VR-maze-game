// elizabeth's tasks, minimap/dynamic texture?, trees, starting page, lighting?, time of day and timer somewhere, loading page
// image variables
let playImg, bg, brick;
// font variable
let myfont;

let buffer;
let canvas;

// game state variable passed in from game play webpage. 1 for playing and 0 for not playing
let gameState;

let level = 3;

function preload(){
    startImg = loadImage("sources/startBtn.png");
    bg = loadImage("sources/startBg.jpg");
    myfont = loadFont('sources/fontResource/Silkscreen/Silkscreen-Regular.ttf');
}

function setup(){
    //canvas and buffer setup
    buffer = createGraphics(window.innerWidth, window.innerHeight);
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    //process graphics and other resources
    textFont(myfont);
    startImg.resize(width/4, height/7);
    bg.resize(width, height);

    if(window.localStorage.getItem("gameState") == null){
    }else{
        winState = window.localStorage.getItem("gameState");
    }
    


}

