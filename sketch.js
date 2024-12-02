// world variable referencing to A-Frame world
let world;

//create global sensor
let sensor;
//note: use obj.tag.object3D.userData.solid = true; to tag objects that should stop user from moving forward

//conversion offset for converting 2D coordinates into 3D: x3d = x2d + conversionOffset; y3d; z3d = y2d + conversionOffset
let conversionOffset;

//specify user positions
//initial position
let userX, userY, userZ;

//wall mapping variables
//wall mapping map
let map;
let mazeMap;
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

//hud variables
let hudCanvas;

//localStorage variables for winning or losing the game. 0 for playing, 1 for lose, 2 for win.
let win = 0;

//weapon
let weapon;


function preload(){
    map = loadImage("sources/mazeMap.png");
    mazeMap = loadImage("sources/mazeMap.png");
}

function setup(){
    // no canvas needed
    noCanvas();
    // construct A-Frame world
    world = new AFrameP5.World('VRScene');
//     //disable flying
//     world.setFlying(false);
//     //disable WASD navigation
//    world.camera.cameraEl.removeAttribute('wasd-controls');

    //HUD
    createFullScreenHud();
    
    //set conversion offset and set initial user position value
    conversionOffset = -(worldSize/2);
    userX = 52 + conversionOffset;
    userY = 2;
    userZ = 99 + conversionOffset;
    //set initial user position
    world.setUserPosition(userX, userY, userZ);

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
    grass.tag.object3D.userData.solid = true;
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
        //arguments: enemy(x, y, z, moveAxis, moveDirection, maxMoveAmount)
        enemies.push(new Enemy(random(-15, 15), 2, random(-10, -20), 0, -1, random(300, 500)));
    }

    //create sensors
    sensor = new Sensor();
    for (let i = 0; i < 100; i++) {
        let coinType = random([1, 2]) == 1 ? "octahedron" : "cylinder";
        let x = random(-48, 48);
        let z = random(-48, 48);
        new Coin(coinType, x, z);
    }

    //waiting to be replaced into real exit door objects later, using a box for placeholder
    let exitDoor = new AFrameP5.Box({
        x: 2,
        y: 2,
        z: 40,
        width: 1,
        height: 10,
        depth: 1,
        red:255, green: 255, blue: 0,
        clickFunction: function (theBox) {
            win = 2;
        },
    })
    world.add(exitDoor);

    for (let i = 0; i < 100; i++) {
        let x = random(-48, 48);
        let z = random(-48, 48);
        let f = new Follower(x,1,z,0.01);
        if(f.caughtUser){
            win = 1; //lose the game
        }
    }

    let canvasElement = document.getElementById('hudCanvas');
    hudCanvas = canvasElement.getContext('2d');

    weapon = new Weapon();
}

function draw(){

    const userPosition = world.getUserPosition();
    const userRotation = world.getUserRotation();

    if (weapon) {
        weapon.update(userPosition,userRotation);
    }

    for(let i = 0; i < initialEnemyCount; i++){
        enemies[i].move();
    }

    //update winning state
    if(win != 0){
        //redirect to ending webpage
        window.localStorage.setItem("winState", win);
        window.location.href = "ending.html";
    }

    let objectAhead = sensor.getEntityInFrontOfUser();
    // let userPos = world.getUserPosition();
    // userX = userPos.x;
    // userZ = userPos.z;
    // //console.log(userX  + "\n" + userY + "\n" + userZ);
    // //if the W key is pressed
    // if (keyIsDown(87)) {
    //     // assume we can move forward
    //     let noObstacle = true;
    //     console.log(objectAhead);
    //     // if there is an object, it is close and it is solid, prevent motion
    //     if (objectAhead && objectAhead.distance < 0.01 && objectAhead.object.el.object3D.userData.solid) {
    //         noObstacle = false;
    //     }
    //     if (noObstacle) {
    //         world.moveUserForward(0.01);
    //     }
    // }
    // //if the S key is pressed
    // if (keyIsDown(83)) {
    //     let noObstacle = true;
    //     //console.log(objectAhead);
    //     if (objectAhead && objectAhead.distance < 0.01 && objectAhead.object.el.object3D.userData.solid) {
    //         noObstacle = false;
    //     }
    //     if (noObstacle) {
    //         world.moveUserBackward(0.05);
    //     }
    // }
    // //if the A key is pressed
    // if (keyIsDown(65)) {
    //     let noObstacle = true;
    //     //console.log(objectAhead);
    //     if (objectAhead && objectAhead.distance < 0.01 && objectAhead.object.el.object3D.userData.solid) {
    //         noObstacle = false;
    //     }
    //     if (noObstacle) {
    //         world.moveUserLeft(0.05);
    //     }
    // }
    // //if the D key is pressed
    // if (keyIsDown(68)) {
    //     let noObstacle = true;
    //     //console.log(objectAhead);
    //     // if there is an object, it is close and it is solid, prevent motion
    //     if (objectAhead && objectAhead.distance < 0.01 && objectAhead.object.el.object3D.userData.solid) {
    //         noObstacle = false;
    //     }
    //     if (noObstacle) {
    //         world.moveUserRight(0.05);
    //     }
    // }
    // moveUserForward
    // rotate
    // A left
    // D right
    
}

// world.getuserposition
// map function in the minimap
