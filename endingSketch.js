//image variables
let playImg, bg, brick;
//font variable
let myfont;

let buffer;
let canvas;

//win state variable passed in from game play webpage. 1 for lose, 2 for win, 0 for playing
let winState;
let timeTaken = 0;
let totalCoins = 0;

//particle system array
let bricks = [];

let colorFactor = 1;

function preload(){
    playImg = loadImage("sources/playBtn.png");
    bg = loadImage("sources/endBg.jpg");
    myfont = loadFont('sources/fontResource/Silkscreen/Silkscreen-Regular.ttf');
    brick = loadImage("sources/brick.jpg");
}

function setup(){
    //canvas and buffer setup
    buffer = createGraphics(window.innerWidth, window.innerHeight);
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    //process graphics and other resources
    textFont(myfont);
    playImg.resize(width/4, height/7);
    bg.resize(width, height);
    brick.resize(20, 20);

    if(window.localStorage.getItem("winState") == null){
        console.log("Error retreving winning state from game.");
    }else{
        winState = window.localStorage.getItem("winState");
    }
    if(window.localStorage.getItem("timeTaken") == null){
        console.log("Error retreving time taken from game.");
    }else{
        timeTaken = window.localStorage.getItem('timeTaken');
    } 
    if(window.localStorage.getItem("coinsCollected") == null){
        console.log("Error retreving time taken from game.");
    }else{
        totalCoins = window.localStorage.getItem('coinsCollected');
    } 
}

function draw(){
    if(winState == 1){
        lose();
    }else if(winState == 2){
        win();
    }
}

function win(){
    background(bg);

    //falling bricks
    for(let i = 0; i < 30; i++){
        bricks.push(new Brick);
        bricks[i].fall();
        if(bricks[i].left()){
            bricks.splice(i, 1);
            i--;
            bricks.push(new Brick);
        }
    }

    //YOU WIN! headline
    textToRotate = " YOU WIN!";
    strokeWeight(20);
    stroke(50, 30, 30);
    textSize(50);
    fill(150, 75, 0);
    rotateText(width/2, height/2+height/15, 300, textToRotate);

    //center info panel tint
    rectMode(CENTER);
    fill(255, 255, 255, 50);
    noStroke();
    rect(width/2, height/2, width/1.5, height/3, 30);

    //center info
    textSize(50);
    fill(150, 75, 0);
    stroke(50, 30, 30);
    strokeWeight(8);
    textStyle(BOLD);
    textAlign(CENTER);
    text("Time Taken: " + timeTaken + " seconds", width/2, height/2-1*height/15);
    text("Coins collected: " + totalCoins + " coins", width/2, height/2-1*height/15+60);
    push();
    if(frameCount % 30 == 0){
        colorFactor *= -1;
    }
    if(colorFactor == 1){
        fill(75, 180, 0);
        stroke(100, 30, 30);
        text("Press PLAY to replay", width/2, height/2+1*height/15+10);
    }else if(colorFactor == -1){
        // fill(0);
        // stroke(0);
        fill(150, 75, 0);
        stroke(50, 30, 30);
        text("Press PLAY to replay", width/2, height/2+1*height/15+10);
    }
    pop();

    //PLAY button
    imageMode(CENTER);
    image(playImg, width/2, height/2+height/3.5);
    imageMode(CORNER);

    //PLAY button collision box indicator
    buffer.background(0);
    buffer.fill(255, 0, 0);
    buffer.stroke(255, 0, 0);
    buffer.strokeWeight(2);
    buffer.rectMode(CENTER);
    buffer.rect(width/2, height/2+height/3.5, width/4, height/7, 30);
    //page jump back to game play
    let mouseLocRedness = red(buffer.get(mouseX, mouseY));
    if(mouseLocRedness == 255 && mouseIsPressed){
        window.localStorage.setItem("winState", 0);
        winState = 0;
        window.location.href = "gameplay.html";
    }
}

function lose(){
    background(bg);

    //falling bricks
    for(let i = 0; i < 30; i++){
        bricks.push(new Brick);
        bricks[i].fall();
        if(bricks[i].left()){
            bricks.splice(i, 1);
            i--;
            bricks.push(new Brick);
        }
    }

    //YOU WIN! headline
    textToRotate = "  GAME OVER!";
    strokeWeight(20);
    stroke(100, 30, 30);
    textSize(50);
    fill(255, 75, 0);
    rotateText(width/2, height/2+height/15, 300, textToRotate);

    //center info panel tint
    rectMode(CENTER);
    fill(255, 255, 255, 50);
    noStroke();
    rect(width/2, height/2, width/1.5, height/3, 30);

    //center info
    //time taken
    textSize(50);
    fill(255, 75, 0);
    stroke(100, 30, 30);
    strokeWeight(8);
    textStyle(BOLD);
    textAlign(CENTER);
    timeTaken = int(timeTaken);
    text("Time Taken: " + timeTaken + " seconds", width/2, height/2-1*height/15);
    text("Coins collected: " + totalCoins + " coins", width/2, height/2-1*height/15+60);
    //flashing effet
    push();
    if(frameCount % 30 == 0){
        colorFactor *= -1;
    }
    if(colorFactor == 1){
        fill(255, 75, 0);
        stroke(100, 30, 30);
        text("Press PLAY to replay", width/2, height/2+1*height/15);
    }else if(colorFactor == -1){
        // fill(0);
        // stroke(0);
        fill(150, 75, 0);
        stroke(50, 30, 30);
        text("Press PLAY to replay", width/2, height/2+1*height/15);
    }
    pop();

    //PLAY button
    imageMode(CENTER);
    image(playImg, width/2, height/2+height/3.5);
    imageMode(CORNER);

    //PLAY button collision box indicator
    buffer.background(0);
    buffer.fill(255, 0, 0);
    buffer.stroke(255, 0, 0);
    buffer.strokeWeight(2);
    buffer.rectMode(CENTER);
    buffer.rect(width/2, height/2+height/3.5, width/4, height/7, 30);
    // image(buffer,0,0);
    //page jump back to game play
    let mouseLocRedness = red(buffer.get(mouseX, mouseY));
    //console.log(mouseLocRedness);
    if(mouseLocRedness == 255 && mouseIsPressed){
        window.localStorage.setItem("winState", 0);
        winState = 0;
        window.location.href = "index.html";
    }
}

//This function is adopted from P5 open source code by Arkimedz. Reference to link: https://editor.p5js.org/Arkimedz/sketches/0VHgrQruB
function rotateText(x, y, radius, txt) {
    // Comment the following line to hide debug objects
    //drawDebug(x, y, radius)

    // Split the chars so they can be printed one by one
    chars = txt.split("")

    // Decide an angle
    charSpacingAngleDeg = 10;

    // https://p5js.org/reference/#/p5/textAlign
    textAlign(CENTER, BASELINE)
    textSize(100)

    // https://p5js.org/reference/#/p5/push
    // Save the current translation matrix so it can be reset
    // before the end of the function
    push()

    // Let's first move to the center of the circle
    translate(x, y)

    // First rotate half back so that middle char will come in the center
    rotate(radians(-chars.length * charSpacingAngleDeg / 2))

    for (let i = 0; i < chars.length; i++) {
        text(chars[i], 0, -radius)

        // Then keep rotating forward per character
        rotate(radians(charSpacingAngleDeg))
    }

    pop()
}

class Brick{
    constructor(){
        this.x = random(width);
        this.y = random(-height, 0);
        this.speed = random(3, 5);
    }

    fall(){
        this.y += this.speed;
        image(brick, this.x, this.y);
    }

    left(){
        if(this.y >= height){
            return true;
        }else{
            return false;
        }
    }
}


