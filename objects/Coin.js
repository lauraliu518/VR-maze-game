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
                    if (dist(userPosition.x, userPosition.z, myPosition.x, myPosition.z)+ dist(userPosition.x, userPosition.y, myPosition.x, myPosition.y)< 4) {
                        coinInstance.collected = true;

                        
                        // coinInstance.buffer.clear();
                        // coinInstance.buffer.text("Points: " + points, 512 / 2, 512 / 2);
                        // if (points >= 10) {
                        //     coinInstance.buffer.clear();
                        //     coinInstance.buffer.text("Nice!", 512 / 2, 512 / 2);
                        //     points = 0;
                        // }

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
        } else {
            this.coin = new AFrameP5.Cylinder({
                asset: "coinImg",
                x: this.x,
                z: this.z,
                rotationZ: 90,
                scaleY: 0.1,
                red: 255,
                green: 255,
                blue: 0,

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

                        // points++;
                        // coinInstance.buffer.clear();
                        // coinInstance.buffer.text("Points: " + points, 512 / 2, 512 / 2);
                        // if (points >= 10) {
                        //     coinInstance.buffer.clear();
                        //     coinInstance.buffer.text("Nice!", 512 / 2, 512 / 2);
                        //     points = 0;
                        // }

                        // Remove the coin from the world
                        world.remove(coins);
                    }
                },

                overFunction: function (coins) {
                    coins.setScale(2, 0.2, 2);
                },

                leaveFunction: function (coins) {
                    coins.setScale(1, 0.1, 1);
                },
            });
        }
        // Add coin to the world
        world.add(this.coin);
    }
}