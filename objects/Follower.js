class Follower {
    constructor(x, y, z, speed) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed;

        this.createEnemy();
    }

    createEnemy() {
        const enemyInstance = this;

        this.enemy = new AFrameP5.Box({
            x: this.x,
            y: this.y,
            z: this.z,
            red: 255,
            green: 0,
            blue: 0,
            height: 1,
            width: 1,
            depth: 1,

            tickFunction: function (box) {
                const userPosition = world.getUserPosition();
                const distance = dist(userPosition.x, userPosition.z, box.x, box.z);

                if (distance <= 5) {
                    const angle = atan2(userPosition.z - box.z, userPosition.x - box.x);
                    box.x += enemyInstance.speed * cos(angle);
                    box.z += enemyInstance.speed * sin(angle);
                    box.setPosition(box.x, box.y, box.z);
                }

                if (distance <= 1) {
                    world.remove(box);
                    hudBuffer.clear();
                    updateHudColor(255, 0, 0);
                    hudBuffer.textSize(50);
                    hudBuffer.textAlign(CENTER, CENTER);
                    hudBuffer.fill(255);
                    hudBuffer.text("GG...\n Don't be too close to the monsters!!!", 512 / 2, 512 / 2);
                }
            },
        });

        world.add(this.enemy);
    }
}