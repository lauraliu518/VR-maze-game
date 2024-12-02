class Follower {
    constructor(x, y, z, speed) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed;

        this.caughtUser = false;

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
                const weaponPosition = weapon.weapon.tag.object3D.position; // Access weapon position
                //console.log(weaponPosition);
                const userDistance = dist(userPosition.x, userPosition.z, box.x, box.z);
                const weaponDistance = dist(weaponPosition.x, weaponPosition.z, box.x, box.z);
                //console.log(weaponDistance);

                // Follow user if within a certain range
                if (userDistance <= 5) {
                    const angle = atan2(userPosition.z - box.z, userPosition.x - box.x);
                    box.x += enemyInstance.speed * cos(angle);
                    box.z += enemyInstance.speed * sin(angle);
                    box.setPosition(box.x, box.y, box.z);
                    console.log("Coming");
                }

                // Check collision with the user
                if (userDistance <= 1) {
                    enemyInstance.caughtUser = true;
                    world.remove(box);

                    hudBuffer.clear();
                    updateHudColor(255, 0, 0);
                    hudBuffer.textSize(50);
                    hudBuffer.textAlign(CENTER, CENTER);
                    hudBuffer.fill(255);
                    hudBuffer.text("GG...\n Don't be too close to the monsters!!!", 512 / 2, 512 / 2);
                }

                // Check collision with the weapon
                if (weaponDistance <= 1) {
                    console.log("Enemy hit by weapon!");
                    world.remove(box);
                }
            },
        });

        world.add(this.enemy);
    }
}
