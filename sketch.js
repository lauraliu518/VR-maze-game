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
let level;

let octahedronCount;
let coinCount;
let spiderWebCount;
let portalCount;

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
let followerCount;

//tree variables
let trees = [];

//mini map hud variables
let buffer1;
let texture1;
let buffer2;
let texture2;

//localStorage variables for winning or losing the game. 0 for playing, 1 for lose, 2 for win.
let win = 0;

// localStorage variables for starting the game. game state variable: 1 for playing, 0 for not playing
let game = 0;

//weapon
let weapon;

//exit door variables
let exitDoor;
let doorX = 48;
let doorY = 0;
let doorZ = 0;

let speed = 0.10;

//inventory variables
let inventory, inventoryBuffer, inventoryTexture; //size 256x32
//size 32x32
let icons = []; //sprinterIcon, slowIcon, teleportIcon, coinIcon, swingCount
let totalCoinCount = 0;
let totalSwing;
let speedUpFlag = false;
let slowDownFlag = false;
let teleportFlag = false;
let flags = [false, false, false];

let myfont;

let nonWallPos = [];

//time variables
let startingTime;
let elapsedTime;
let timeTaked = false;

let coinCollected = 0;

function preload(){
    level1 = loadImage("sources/maps/level1.png");
    level2 = loadImage("sources/maps/level2.png");
    level3 = loadImage("sources/maps/level3.png");
    icons[0] = loadImage("sources/icons/sprinter.png");
    icons[1] = loadImage("sources/icons/slowIcon.webp");
    icons[2] = loadImage("sources/icons/teleportIcon.png");
    icons[3] = loadImage("sources/icons/coinIcon.png");
    icons[4] = loadImage("sources/icons/swordIcon.png");
    //myfont = loadFont("sources/fontResource/Tiny5/Tiny5-Regular.ttf"); 
    myfont = loadFont("sources/fontResource/Orbitron/Orbitron-VariableFont_wght.ttf"); 
}

function setup(){
    //record time when game started
    startingTime = millis();

    // assign the corresponding map based on the 'level' parameter
    if(window.localStorage.getItem('level') == 1){
        mapGraphic = level1;
        followerCount = 10;
        totalSwing = 15;
        octahedronCount = 15;
        coinCount = 20;
        spiderWebCount = 10;
        portalCount = 5;
    } else if(window.localStorage.getItem('level') == 2){
        mapGraphic = level2;
        followerCount = 20;
        totalSwing = 25;
        octahedronCount = 15;
        coinCount = 20;
        spiderWebCount = 20;
        portalCount = 10;
    } else if(window.localStorage.getItem('level') == 3){
        mapGraphic = level3;
        followerCount = 50;
        totalSwing = 20;
        octahedronCount = 10;
        coinCount = 20;
        spiderWebCount = 30;
        portalCount = 5;
    };

    // no canvas needed
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
    exitDoor = new AFrameP5.GLTF({
        x: doorX,
        y: doorY,
        z: doorZ,
        rotationY: -90,
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

    // adding random trees into the platform
    for(let i = 0; i < 10; i++){
        let tree = new AFrameP5.OBJ({
            asset: "trees",        
            mtl: "tree_mtl",            
            x: random(-50, 50),                
            y: 0,                
            z: random(-50, 50),                
            scaleX: .5,       
            scaleY: .5,       
            scaleZ: .5,       
        });
        tree.tag.setAttribute("material", "color: rgb(95, 99, 68)");
        world.add(tree);
        trees.push(tree);
    }

    //create sensors
    sensor = new Sensor();

    for(let i = 0; i < worldSize; i++){  // ensure that the elements are not printed in the wall.
        for(let j = 0; j < worldSize; j++){
            if(!checkIfMapPositionIsBlack(offset + i, offset + j)){
                let x = convert2Dto3D(offset + i);
                let z = convert2Dto3D(offset + j);
                let bounds = 2;
                if(!checkIfMapPositionIsBlack(offset + i + bounds, offset + j)&&
                !checkIfMapPositionIsBlack(offset + i - bounds, offset + j)&&
                !checkIfMapPositionIsBlack(offset + i, offset + j + bounds)&&
                !checkIfMapPositionIsBlack(offset + i, offset + j - bounds)){
                    nonWallPos.push([x,z]);
                }
            }
        }
    }
    for (let i = 0; i < portalCount; i++) {
        let coinType = "portal";//random(["octahedron", "coin","spiderWeb","portal"]);
        let [x,z] = random(nonWallPos);
        new Coin(coinType, x, z);
    }

    for (let i = 0; i < octahedronCount; i++) {
        let coinType = "octahedron";//random(["octahedron", "coin","spiderWeb","portal"]);
        let [x,z] = random(nonWallPos);

        new Coin(coinType, x, z);
    }

    for (let i = 0; i < coinCount; i++) {
        let coinType = "coin";//random(["octahedron", "coin","spiderWeb","portal"]);
        let [x,z] = random(nonWallPos);

        new Coin(coinType, x, z);
    }

    for (let i = 0; i < spiderWebCount; i++) {
        let coinType = "spiderWeb";//random(["octahedron", "coin","spiderWeb","portal"]);
        let [x,z] = random(nonWallPos);

        new Coin(coinType, x, z);
    }

    // create followers
    for (let i = 0; i < followerCount; i++) {
        let [x,z] = random(nonWallPos);

        followers.push(new Follower(x,1.5,z,0.01));
    }

    // check if the mini map is not clicked on, default
    let isMiniActive = true;

    buffer1 = createGraphics(256, 256);
    texture1 = world.createDynamicTextureFromCreateGraphics(buffer1);

    // create a mini map in the top right corner of the game
    let mini = new AFrameP5.Plane({
        width: 0.15, height: 0.15,
        asset: texture1,
        side: "double",
        dynamicTexture: true,
        dynamicTextureWidth: 2,
        dynamicTextureHeight: 2,
        clickFunction: function (m) {
            // clicking on the plane
            mini.hide();
            largeMini.show();
            isMiniActive = false;
        },
        enterFunction: function (m) {
            // hover state, expand a little
            mini.setScale(1.2, 1.2, 1);
        },
        leaveFunction: function (m) {
            // leave hover state, back to original
            mini.setScale(1, 1, 1); 
        },
    });
    //world.addToHUD(mini, 3, 1.8, -3);
    world.addToHUD(mini, 0.5, 0.3, -0.5);

    buffer2 = createGraphics(1536, 1536);
    texture2 = world.createDynamicTextureFromCreateGraphics(buffer2);

    // create a expanded version of the mini map in the middle of the game
    let largeMini = new AFrameP5.Plane({
        width: 0.60, height: 0.60,
        asset: texture2,
        side: "double",
        dynamicTexture: true,
        dynamicTextureWidth: 6,
        dynamicTextureHeight: 6,
        clickFunction: function (L) {
            // clicking on the plane
            largeMini.hide();
            mini.show();
            isMiniActive = false;
        },
        enterFunction: function (L) {
            // hover state
            largeMini.setScale(1.1, 1.1, 1); 
        },
        leaveFunction: function (L) {
            // leave hover state
            largeMini.setScale(1, 1, 1); 
        },
    });
    world.addToHUD(largeMini, 0, 0, -0.4);

    // hide the large mini map at the beginning
    largeMini.hide();

    weapon = new Weapon();

    inventoryBuffer = createGraphics(152, 32);
    inventoryBuffer.textFont(myfont);
    inventoryBuffer.background(128, 0, 0);
    inventoryTexture = world.createDynamicTextureFromCreateGraphics(inventoryBuffer);
    let inventory = new AFrameP5.Plane({
        width: 0.5, height: 0.1,
        asset: inventoryTexture,
        dynamicTexture: true,
        dynamicTextureWidth: 5,
        dynamicTextureHeight: 1,
    })
    world.addToHUD(inventory, 0, -0.3, -0.5);
}

function draw(){
    //inventory bar
    //inventory buffer background set up
    inventoryBuffer.fill(212, 106, 106);
    inventoryBuffer.strokeWeight(2);
    inventoryBuffer.stroke(85, 0, 0);

    //create individual cubes
    for(let i = 0; i < 150; i += 30){
        inventoryBuffer.rect(1+i, 1, 30, 30);
    }

    //draw special effect items icon
    for(let i = 0; i < 90; i += 30){
        //center point (16+i, 16), icon index i/30
        inventoryBuffer.imageMode(CENTER);
        inventoryBuffer.image(icons[i/30], 1+15+i, 16, 25, 25);
        
    }

    //draw coin count and swing count
    for(let i = 90; i < 150; i += 30){
        inventoryBuffer.imageMode(CENTER);
        inventoryBuffer.image(icons[i/30], 1+15+i, 10, 12, 12);
    }

    //display coin count
    inventoryBuffer.textAlign(CENTER);
    inventoryBuffer.rectMode(CORNER);
    inventoryBuffer.noStroke();
    inventoryBuffer.textSize(10);
    inventoryBuffer.fill(0);
    inventoryBuffer.text(totalCoinCount, 16+90, 27);
    
    //display swing count with warning
    if(totalSwing <= 10){
        inventoryBuffer.fill(255, 0, 0);
        inventoryBuffer.stroke(0);
        inventoryBuffer.strokeWeight(1);
    }else{
        inventoryBuffer.fill(0);
    }
    inventoryBuffer.text(totalSwing, 16+120, 27);
    
    //display deactivation line for special effect items
    for(let i = 0; i < 3; i++){
        if(flags[i] == false){
            inventoryBuffer.strokeWeight(2);
            inventoryBuffer.stroke(0);
            inventoryBuffer.line(3+i*30, 3, 29+i*30, 29);
        }
    }
    
    // check user position
    const userPosition = world.getUserPosition();
    const userRotation = world.getUserRotation();
    
    // small mini map
    buffer1.background(128);
    buffer1.image(mapGraphic, 0, 0, 256, 256);
    // position to map user's position onto map
    let miniMapX = map(userPosition.x, -50, 50, 0, 256);
    let miniMapY = map(userPosition.z, -50, 50, 0, 256);
    // show user as a blue circle on map
    buffer1.fill(0, 0, 255);
    buffer1.stroke(0, 154, 238);
    buffer1.strokeWeight(5);
    buffer1.ellipse(miniMapX, miniMapY, 15, 15);

    // add border to small mini map
    buffer1.stroke(63, 155, 11);
    buffer1.strokeWeight(10);
    buffer1.noFill();
    buffer1.rect(0, 0, 256, 256);

    // big minimap
    buffer2.background(128);
    buffer2.image(mapGraphic, 0, 0, 1536, 1536);
    // position to map user's position onto map
    let largeminiMapX = map(userPosition.x, -50, 50, 0, 1536);
    let largeminiMapY = map(userPosition.z, -50, 50, 0, 1536);
    // show user as a blue circle on map
    buffer2.fill(0, 0, 1535);
    buffer2.stroke(0, 154, 238);
    buffer2.strokeWeight(20);
    buffer2.ellipse(largeminiMapX, largeminiMapY, 50, 50);

    // add border to large mini map
    buffer2.stroke(63, 155, 11);
    buffer2.strokeWeight(30);
    buffer2.noFill();
    buffer2.rect(0, 0, 1536, 1536);

    // map the followers/enemies onto the mini map as well
    for (let i = 0; i < followers.length; i++) {
        let follower = followers[i];

        // find the follower's postiions, map onto smaller mini map
        let miniFollowerX = map(follower.x, -50, 50, 0, 256);
        let miniFollowerY = map(follower.z, -50, 50, 0, 256);
        // draw followers as brown squares on mini map
        buffer1.fill(139, 69, 19);
        buffer1.noStroke();
        buffer1.rect(miniFollowerX, miniFollowerY, 10, 10); 
    
        // find the follower's postiions, map onto larger mini map
        let largeFollowerX = map(follower.x, -50, 50, 0, 1536);
        let largeFollowerY = map(follower.z, -50, 50, 0, 1536);
        // draw followers as brown squares on mini map
        buffer2.fill(139, 69, 19);
        buffer2.stroke(199, 0, 0);
        buffer2.strokeWeight(7);
        buffer2.rect(largeFollowerX, largeFollowerY, 50, 50); 
    }

    if (weapon) {
        weapon.update(userPosition, userRotation);
    }

    //if the W key is pressed
    if (keyIsDown(87)) {
        let objectAhead = sensor.getEntityInFrontOfUser();
        // assume we can move forward
        let noObstacle = true;
        //console.log(objectAhead);
        // if there is an object, it is close and it is solid, prevent motion
        if (objectAhead && objectAhead.distance < 1.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
        }
        if (noObstacle) {
            world.moveUserForward(speed);
        }
    }
    //if the S key is pressed
    if (keyIsDown(83)) {
        let objectAhead = sensor.getEntityBehindUser();
        let noObstacle = true;
        if (objectAhead && objectAhead.distance < 1.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
        }
        if (noObstacle) {
            world.moveUserBackward(speed);
        }
    }
    //if the A key is pressed
    if (keyIsDown(65)) {
        let objectAhead = sensor.getEntityLeftOfUser();
        let noObstacle = true;
        //console.log(objectAhead);
        if (objectAhead && objectAhead.distance < 1.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
        }
        if (noObstacle) {
            world.moveUserLeft(speed);
        }
    }
    //if the D key is pressed
    if (keyIsDown(68)) {
        let objectAhead = sensor.getEntityRightOfUser();
        let noObstacle = true;
        if (objectAhead && objectAhead.distance < 1.5 && objectAhead.object.el.object3D.userData.solid) {
            noObstacle = false;
        }
        if (noObstacle) {
            world.moveUserRight(speed);
        }
    }

    //checking winning/losing conditions
    //user attacked by enemy
    for(let i = 0; i < followerCount; i++){
        if(followers[i].caughtUser){
            win = 1; //lose the game
        }
    }
    //user reaches ending door
    if (dist(userPosition.x, userPosition.z, doorX, doorZ)+ dist(userPosition.x, userPosition.y, doorX, doorY)< 4) {
        win = 2; //win game
    }
    //update winning state
    if(win != 0){
        //redirect to ending webpage
        if(timeTaked == false){
            endingTime = millis();
            timeTaked = true;
            elapsedTime = int((endingTime - startingTime)/1000);//casting time taken to int
        }
        window.localStorage.setItem("timeTaken", elapsedTime);
        window.localStorage.setItem("coinsCollected", coinCollected);
        window.localStorage.setItem("winState", win);
        window.location.href = "ending.html";
    }
}

