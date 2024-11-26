//win state variable passed in from game play webpage. 0 for lose, 1 for win
let winState;
let playImg;

function preload(){
    playImg = loadImage("sources/playBtn.png");
    bg = loadImage("sources/endBg.jpg");
}

function setup(){
    //create responsive canvas
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);

    playImg.resize(width/2.3, height/2.5);
    bg.resize(width, height);

    
    if(window.localStorage.getItem("winState") == null){
        console.log("Error retreving winning state from game.");
    }else{
        winState = window.localStorage.getItem("winState");
    }

    if(winState == 0){
        background(0, 255, 0);
    }else if(winState == 1){
        //background(0, 150, 0);
        background(bg);

        //win button
        imageMode(CENTER);
        image(playImg, width/2, height/2+height/7);
    }
    
}

function draw(){
   //image(playImg, 100, 100);
}