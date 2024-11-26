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

function preload(){
    map = loadImage("sources/mazeMap.png");
    mazeMap = loadImage("sources/mazeMap.png");
}

function setup(){
    // no canvas needed
    noCanvas();
    // construct A-Frame world
    world = new AFrameP5.World('VRScene');
    //disable flying
    world.setFlying(false);
    // disable WASD navigation
   //world.camera.cameraEl.removeAttribute('wasd-controls');
    
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
        //syntax: enemy(x, y, z, moveAxis, moveDirection, maxMoveAmount)
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

    let canvasElement = document.getElementById('hudCanvas');
    hudCanvas = canvasElement.getContext('2d');
}

function draw(){
    // let whatsBelow = sensor.getEntityBelowUser();
    let objectAhead = sensor.getEntityInFrontOfUser();
    let userPos = world.getUserPosition();
    userX = userPos.x;
    userZ = userPos.z;

    console.log(userX  + "\n" + userY + "\n" + userZ);
    
    for(let i = 0; i < initialEnemyCount; i++){
        enemies[i].move();
    }
    
    // if the W key is pressed
    // if (keyIsDown(87)) {
    //     // assume we can move forward
    //     let noObstacle = true;
    //     //console.log(objectAhead);
    if (keyIsDown(87)) {
        // assume we can move forward
        let noObstacle = true;
        
        //console.log(objectAhead);

    //     // if there is an object, it is close and it is solid, prevent motion
    //     if (objectAhead && objectAhead.distance < 0.01 && objectAhead.object.el.object3D.userData.solid) {
    //         noObstacle = false;
    //     }
        // if there is an object, it is close and it is solid, prevent motion
        if (objectAhead && objectAhead.distance < 0.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
            userZ += 0.1;
            world.setUserPosition(userX, userY, userZ);
        }

    //     if (noObstacle) {
    //         userZ -= 0.05;
    //         world.setUserPosition(userX, userY, userX);
    //     }
    // }
        if (noObstacle) {
            userZ -= 0.05;
            world.setUserPosition(userX, userY, userZ);
        }
    }

    // //if the S key is pressed
    // if (keyIsDown(83)) {
    //     // assume we can move forward
    //     let noObstacle = true;

    //     //console.log(objectAhead);

    //     // if there is an object, it is close and it is solid, prevent motion
    //     if (objectAhead && objectAhead.distance < 0.01 && objectAhead.object.el.object3D.userData.solid) {
    //         noObstacle = false;
    //     }
        // if there is an object, it is close and it is solid, prevent motion
        if (objectAhead && objectAhead.distance < 0.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
            userZ -= 0.1;
            world.setUserPosition(userX, userY, userZ);
        }

    //     if (noObstacle) {
    //         userZ += 0.05;
    //         world.setUserPosition(userX, userY, userX);
    //     }
    // }
        if (noObstacle) {
            userZ += 0.05;
            world.setUserPosition(userX, userY, userZ);
        }
    }

    // //if the A key is pressed
    // if (keyIsDown(65)) {
    //     // assume we can move forward
    //     let noObstacle = true;

    //     //console.log(objectAhead);

    //     // if there is an object, it is close and it is solid, prevent motion
    //     if (objectAhead && objectAhead.distance < 0.01 && objectAhead.object.el.object3D.userData.solid) {
    //         noObstacle = false;
    //     }
        // if there is an object, it is close and it is solid, prevent motion
        if (objectAhead && objectAhead.distance < 0.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
            userX += 0.1;
            world.setUserPosition(userX, userY, userZ);
        }

    //     if (noObstacle) {
    //         userX -= 0.05;
    //         world.setUserPosition(userX, userY, userX);
    //     }
    // }
        if (noObstacle) {
            userX -= 0.05;
            world.setUserPosition(userX, userY, userZ);
        }

    // //if the D key is pressed
    // if (keyIsDown(68)) {
    //     // assume we can move forward
    //     let noObstacle = true;

    //     //console.log(objectAhead);

    //     // if there is an object, it is close and it is solid, prevent motion
    //     if (objectAhead && objectAhead.distance < 0.01 && objectAhead.object.el.object3D.userData.solid) {
    //         noObstacle = false;
    //     }
        // if there is an object, it is close and it is solid, prevent motion
        if (objectAhead && objectAhead.distance < 0.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
            userX -= 0.1;
            world.setUserPosition(userX, userY, userZ);
        }

    //     if (noObstacle) {
    //         userX += 0.05;
    //         world.setUserPosition(userX, userY, userX);
    //     }
    // }

    
        if (noObstacle) {
            userX += 0.05;
            world.setUserPosition(userX, userY, userZ);
        }

    //moveUserForward
    //rotate
    //A left
    //D right


