// world variable referencing to A-Frame world
let world;

//wall mapping variables
//wall mapping map
let map;
//offset for map parsing, offset = cubeSideLength/2
let offset = 0.5;
//3D world width and depth
let worldSize = 100;
//wall height
let wallHeight = 5;
//wall block width and depth
let blockSize = 1;

//enemy variables
let enemies = [];
let initialEnemyCount = 2;

function preload(){
    map = loadImage("sources/mazemap.png");
}

function setup(){
    // no canvas needed
    noCanvas();
    // construct A-Frame world
    world = new AFrameP5.World('VRScene');
    //disable flying
    world.setFlying(false);

    //create grass ground plane
    let grass = new AFrameP5.Plane({
        x:0,
        y:0,
        z:0,
        width: 100,
        height: 100,
        asset:"grassPic",
        rotationX: -90,
        repeatX: 100,
        repeatY:100,
    })
    world.add(grass);

    //create sky
    let sky = new AFrameP5.Sky({
        asset:"skyPic"
    })
    world.add(sky);

    //create walls based on wall map
    mapWalls();

    //enemies
    //adding enemies
    for(let i = 0; i < initialEnemyCount; i++){
        //syntax: enemy(x, y, z, moveAxis, moveDirection, maxMoveAmount)
        enemies.push(new Enemy(random(-15, 15), 2, random(-10, -20), 0, -1, random(300, 500)));
    }
}

function draw(){
    for(let i = 0; i < initialEnemyCount; i++){
        enemies[i].move();
    }
}


