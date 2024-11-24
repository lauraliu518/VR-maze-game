class Enemy{
    //constructor takes six arguments:
    //initial starting position x, y, z: float value  
    //moveAxis is the axis enemy moves in: int value 0 for 'x' and 1 for 'z' (the enemies cannot move up or down)
    //moveDirection is the direction of the moving axis the enemy moves in: -1 to move towards negative, and 1 to move towards positive
    //maxMoveAmount is the max number of meters the enemy can move in the movement direction
    constructor(xi, yi, zi, moveAxis, moveDirection, maxMoveAmount){
        this.myEnemy = new AFrameP5.GLTF({
            asset: "creeper_model",
            x: xi,
            y: yi,
            z: zi,
        })
        world.add(this.myEnemy);

        this.moveAxis = moveAxis;
        this.moveDirection = moveDirection;
        this.maxMoveAmount = maxMoveAmount;
        this.stepCount = 0;

    }
    
    move(){
        let xSpeed, zSpeed;
        let xDir, zDir;

        if(this.moveAxis == 0){
            xSpeed = 0.01;
            xDir = this.moveDirection;
            zSpeed = 0;
            zDir = 0;
        }else if(this.moveAxis == 1){
            xSpeed = 0;
            xDir = 0;
            zSpeed = 0.01;
            zDir = this.moveDirection;
        }
        this.myEnemy.nudge(xSpeed * xDir, 0, zSpeed * zDir);
        this.stepCount++;
        if(this.stepCount % this.maxMoveAmount == 0){
            this.moveDirection *= -1;
        }
    }

}
