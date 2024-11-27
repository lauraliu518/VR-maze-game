//win state variable passed in from game play webpage. 1 for lose, 2 for win, 0 for playing
let winState;
let playImg;

let buffer;
let canvas;

function preload(){
    playImg = loadImage("sources/playBtn.png");
    bg = loadImage("sources/endBg.jpg");
}

function setup(){
    buffer = createGraphics(window.innerWidth, window.innerHeight);
    //create responsive canvas
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    //background(0);

    playImg.resize(width/4, height/7);
    bg.resize(width, height);

    
    if(window.localStorage.getItem("winState") == null){
        console.log("Error retreving winning state from game.");
    }else{
        winState = window.localStorage.getItem("winState");
    }
    
}

function draw(){
    if(winState == 1){
        background(0, 255, 0);
    }else if(winState == 2){
        background(bg);

        //win button
        imageMode(CENTER);
        image(playImg, width/2, height/2+height/3.5);
        imageMode(CORNER);
        //win button collision box indicator
        buffer.background(0);
        buffer.fill(255, 0, 0);
        buffer.stroke(255, 0, 0);
        buffer.strokeWeight(2);
        buffer.rectMode(CENTER);
        buffer.rect(width/2, height/2+height/3.5, width/4, height/7, 30);
        let mouseLocRedness = red(buffer.get(mouseX, mouseY));
        //console.log(mouseLocRedness);
        if(mouseLocRedness == 255 && mouseIsPressed){
            window.localStorage.setItem("winState", 0);
            winState = 0;
            window.location.href = "index.html";
        }
        // image(buffer,0,0);
    }
}