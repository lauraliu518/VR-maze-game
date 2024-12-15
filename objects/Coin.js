class Coin {
    constructor(type, x, z) {
        this.type = type; // "octahedron" or "cylinder"
        this.x = x;
        this.z = z;

        this.collected = false;
        this.rotationDirection = random([-1, 1]);
        this.yPos = random(1, 2);
        this.ySpeed = 0.1;

        this.createCoin();
    }
    slowUser() {
        // Slow down the user's speed
        const reducedSpeed = 0.01; // Reduce speed by 50%
        speed = reducedSpeed; // Set reduced speed

        // Restore the original speed after 500ms
        setTimeout(() => {
            speed=0.10; // Reset to original speed
        }, 5000); // 5 sec
    }

    createCoin() {
        const coinInstance = this; // Store a reference to the current Coin instance

        if (this.type == "octahedron") {
            this.coin = new AFrameP5.Octahedron({
                x: this.x,
                z: this.z,
                opacity: 0.7,
                scaleX: 0.75,
                scaleZ: 0.75,
                rotationY: random(360),
                red: 0,
                green: 255,
                blue: 255,

                tickFunction: function (coins) {
                    if (coinInstance.yPos < 1) {
                        coinInstance.ySpeed = 0.005;
                    } else if (coinInstance.yPos > 1.5) {
                        coinInstance.ySpeed = -0.005;
                    }
                    coinInstance.yPos += coinInstance.ySpeed;
                    coins.setY(coinInstance.yPos);
                    coins.spinY(coinInstance.rotationDirection);

                    if (coinInstance.collected) return;

                    const userPosition = world.getUserPosition();
                    const myPosition = coins.getPosition();
                    if (dist(userPosition.x, userPosition.z, myPosition.x, myPosition.z)+ dist(userPosition.x, userPosition.y, myPosition.x, myPosition.y)< 4 ) {
                        coinInstance.collected = true;
                        const increasedSpeed = 0.20; 
                        speed = increasedSpeed; 
                        flags[0] = true;
                        setTimeout(() => {
                            flags[0] = false;
                            speed=0.10; // Reset to original flag
                        }, 5000);

                        // Remove the coin from the world
                        world.remove(coins);
                    }
                },

                overFunction: function (coins) {
                    coins.setScale(1.5, 2, 1.5);
                },

                leaveFunction: function (coins) {
                    coins.setScale(0.75, 1, 0.75);
                },
            });
        } else if(this.type == "coin"){
            this.coin = new AFrameP5.GLTF({
                asset: "coinImg",
                x: this.x,
                z: this.z,
                scaleX:5,
                scaleY:5,
                scaleZ:5,
                //rotationZ: 90,
                tickFunction: function (coins) {
                    if (coinInstance.yPos < 1) {
                        coinInstance.ySpeed = 0.005;
                    } else if (coinInstance.yPos > 1.5) {
                        coinInstance.ySpeed = -0.005;
                    }
                    coinInstance.yPos += coinInstance.ySpeed;
                    coins.setY(coinInstance.yPos);
                    coins.spinY(coinInstance.rotationDirection);

                    if (coinInstance.collected) return;

                    const userPosition = world.getUserPosition();
                    const myPosition = coins.getPosition();
                    if (dist(userPosition.x, userPosition.z, myPosition.x, myPosition.z) < 2) {
                        coinInstance.collected = true;
                        totalCoinCount++;

                        // Remove the coin from the world
                        world.remove(coins);
                    }
                },

                overFunction: function (coins) {
                    coins.setScale(8, 8, 8);
                },

                leaveFunction: function (coins) {
                    coins.setScale(5, 5, 5);
                },
            });
        }
        else if(this.type == "spiderWeb"){
            this.coin = new AFrameP5.GLTF({
                asset: "spiderWeb",
                x: this.x,
                z: this.z,
                scaleX:2,
                scaleY:2,
                scaleZ:2,
                //rotationZ: 90,
                tickFunction: function (coins) {
                    coins.lookAtUser(); // look at the user
                    if (coinInstance.yPos < 1) {
                        coinInstance.ySpeed = 0.005;
                    } else if (coinInstance.yPos > 1.5) {
                        coinInstance.ySpeed = -0.005;
                    }
                    coinInstance.yPos += coinInstance.ySpeed;
                    coins.setY(coinInstance.yPos);
                    //coins.spinY(coinInstance.rotationDirection);

                    if (coinInstance.collected) return;

                    const userPosition = world.getUserPosition();
                    const myPosition = coins.getPosition();
                    if (dist(userPosition.x, userPosition.z, myPosition.x, myPosition.z) < 2) {
                        coinInstance.collected = true;
                        const decreasedSpeed = 0.03; 
                        speed = decreasedSpeed; 
                        flags[1] = true;
                        setTimeout(() => {
                            flags[1] = false;
                            speed=0.10; // Reset to original flag
                        }, 5000);
                        
                        // Remove the coin from the world
                        world.remove(coins);
                    }
                },
            });
        }else if (this.type == "portal"){
            this.coin = new AFrameP5.GLTF({
                asset: "portal",
                x: this.x,
                z: this.z,
                y: 2,
                scaleX:0.4,
                scaleY:0.4,
                scaleZ:0.4,
                class: "clickable",
                 tickFunction: function (coins) {        
                     coins.spinY(coinInstance.rotationDirection);
                     coins.spinX(coinInstance.rotationDirection);
                     coins.spinZ(coinInstance.rotationDirection);

                     if (coinInstance.collected) return;

                     const userPosition = world.getUserPosition();
                     const myPosition = coins.getPosition();
                     if (dist(userPosition.x, userPosition.z, myPosition.x, myPosition.z) < 1) {
                         coinInstance.collected = true;
                         world.remove(coins);
                    }
                 },
                clickFunction: function(coins) {
                    console.log("Portal clicked!");
                    world.teleportToObject(coins, 1000);
                    flags[2] = true;
                    setTimeout(() => {
                        flags[2] = false;
                    }, 1000);
                }
            });
        }
        // Add coin to the world
        world.add(this.coin);
    }
}