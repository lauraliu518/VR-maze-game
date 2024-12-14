class Follower {
    constructor(x, y, z, speed) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed;

        this.caughtUser = false;
        this.noiseOffset = Math.random() * 1000; // Unique noise offset for each enemy
        this.createEnemy();
    }

    createEnemy() {
        const enemyInstance = this;

        this.enemy = new AFrameP5.GLTF({
            asset: "ghost",
            x: this.x,
            y: this.y,
            z: this.z,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            tickFunction: function (enemy) {
                this.lookAtUser();
                const userPosition = world.getUserPosition();
                const weaponPosition = weapon.weapon.getWorldPosition(); // Access weapon position
                
                //use Perlin Noise for smooth vertical movement
                const time = frameCount*0.01; // Adjust speed of noise evolution
                enemyInstance.y = map(noise(enemyInstance.noiseOffset + time), 0, 1, 1, 5);
                enemy.setY(enemyInstance.y);

                const userDistance = dist(userPosition.x, userPosition.z, enemy.x, enemy.z);
                const weaponDistance = dist(weaponPosition.x, weaponPosition.z, enemy.x, enemy.z);

                //follow user if within a certain range
                if (userDistance <= 8) {
                    const angle = atan2(userPosition.z - enemy.z, userPosition.x - enemy.x);
                    enemy.x += enemyInstance.speed * cos(angle);
                    enemy.z += enemyInstance.speed * sin(angle);
                    enemy.setPosition(enemy.x, enemy.y, enemy.z);
                }

                //check collision with the user
                if (userDistance <= 1) {
                    enemyInstance.caughtUser = true;
                    // win = 1;
                    // window.localStorage.setItem("winState", win);
                    // window.location.href = "ending.html";
                    world.remove(enemy);

                    hudBuffer.clear();
                    updateHudColor(255, 0, 0);
                    hudBuffer.textSize(50);
                    hudBuffer.textAlign(CENTER, CENTER);
                    hudBuffer.fill(255);
                }

                //check collision with the weapon
                if (Weapon.isSwinging && weaponDistance <= 1.5) {
                    console.log("Enemy hit by weapon!");
                    world.remove(enemy);
                }
            },
        });

        world.add(this.enemy);
    }
}
