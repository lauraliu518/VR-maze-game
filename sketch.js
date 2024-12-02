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
let mapGraphic;

//offset for map parsing, offset = cubeSideLength/2
let offset = 0.5;
//3D world width and depth
let worldSize = 100;
//wall height
let wallHeight = 5;
//wall block width and depth
let blockSize = 1;

//follower variables
let followers = [];

//hud variables
let buffer1;
let texture1;

//localStorage variables for winning or losing the game. 0 for playing, 1 for lose, 2 for win.
let win = 0;

//weapon
let weapon;

//exit door variables
let doorX = 47;
let doorY = 1;
let doorZ = 0;

//number of followers -- depends on difficulty
let numFollower;

let speed;

function preload(){
    mapGraphic = loadImage("sources/maps/level1.png");
}

function setup(){
    // no canvas needed
    numFollower = 10;
    noCanvas();
    // construct A-Frame world
    world = new AFrameP5.World('VRScene');
    //disable flying
    world.setFlying(false);
    //disable WASD navigation
    world.camera.cameraEl.removeAttribute('wasd-controls');

    //HUD
    createFullScreenHud();
    
    //set conversion offset and set initial user position value
    conversionOffset = -(worldSize/2);
    userX = 52 + conversionOffset;
    userY = 2;
    userZ = 99 + conversionOffset;
    //set initial user position
    world.setUserPosition(userX, userY, userZ);

    //set exit door position
    doorX = doorX + conversionOffset;
    doorZ = doorZ + conversionOffset;
    //create exit door
    let exitDoor = new AFrameP5.Box({
        x: doorX,
        y: doorY,
        z: doorZ,
        width: 1,
        height: 10,
        depth: 1,
        red:255, green: 255, blue: 0,
        asset: "door",
        clickFunction: function (theBox) {
            win = 2;
        },
    })
    world.add(exitDoor);

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
    //add

    //create sensors
    sensor = new Sensor();
    for (let i = 0; i < 100; i++) {
        let coinType = random([1, 2]) == 1 ? "octahedron" : "cylinder";
        let x = random(-48, 48);
        let z = random(-48, 48);
        new Coin(coinType, x, z);
    }

    

    for (let i = 0; i < numFollower; i++) {
        let x = random(-48, 48);
        let z = random(-48, 48);
        followers.push(new Follower(x,1.5,z,0.01));
    }

    buffer1 = createGraphics(256, 256);

    texture1 = world.createDynamicTextureFromCreateGraphics(buffer1);

    // create a mini map in the top right corner of the game
    let mini = new AFrameP5.Plane({
        width: 1, height: 1,
        asset: texture1,
        side: "double",
        dynamicTexture: true,
        dynamicTextureWidth: 256,
        dynamicTextureHeight: 256,
    });
    // world.addToHUD(mini, 4.2, 1.8, -3);
    world.addToHUD(mini, 2, 1.8, -3);

    weapon = new Weapon();


}

function draw(){

    const userPosition = world.getUserPosition();
    const userRotation = world.getUserRotation();

    buffer1.background(128);
    buffer1.image(mapGraphic, 0, 0, 256, 256);

    //display enemy position
    for(let i = 0; i < numFollower; i++){
        let miniFollowerMapX = map(followers[i].x, -50, 50, 0, 256);
        let miniFollowerMapY = map(followers[i].z, -50, 50, 0, 256);
        buffer1.fill(255, 0, 0);
        buffer1.ellipse(miniFollowerMapX, miniFollowerMapY, 10, 10);
    }

    let miniMapX = map(userPosition.x, -50, 50, 0, 256);
    let miniMapY = map(userPosition.z, -50, 50, 0, 256);

    //console.log(miniMapX, miniMapY);
    buffer1.fill(0, 0, 255);
    buffer1.ellipse(miniMapX, miniMapY, 20, 20);

    

    if (weapon) {
        weapon.update(userPosition,userRotation);
    }
    console.log(win);
    //update winning state
    if(win != 0){
        //redirect to ending webpage
        window.localStorage.setItem("winState", win);
        window.location.href = "ending.html";
    }

    //if the W key is pressed
    if (keyIsDown(87)) {
        let objectAhead = sensor.getEntityInFrontOfUser();
        // assume we can move forward
        let noObstacle = true;
        console.log(objectAhead);
        // if there is an object, it is close and it is solid, prevent motion
        if (objectAhead && objectAhead.distance < 1 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
        }
        if (noObstacle) {
            world.moveUserForward(0.05);
        }
    }
    //if the S key is pressed
    if (keyIsDown(83)) {
        let objectAhead = sensor.getEntityBehindUser();
        let noObstacle = true;
        //console.log(objectAhead);
        if (objectAhead && objectAhead.distance < 1 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
        }
        if (noObstacle) {
            world.moveUserBackward(0.05);
        }
    }
    //if the A key is pressed
    if (keyIsDown(65)) {
        let objectAhead = sensor.getEntityLeftOfUser();
        let noObstacle = true;
        //console.log(objectAhead);
        if (objectAhead && objectAhead.distance < 0.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
        }
        if (noObstacle) {
            world.moveUserLeft(0.05);
        }
    }
    //if the D key is pressed
    if (keyIsDown(68)) {
        let objectAhead = sensor.getEntityRightOfUser();
        let noObstacle = true;
        //console.log(objectAhead);
        if (objectAhead && objectAhead.distance < 0.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
        }
        if (noObstacle) {
            world.moveUserRight(0.05);
        }
    }

    
    
}

// world.getuserposition
// map function in the minimap
