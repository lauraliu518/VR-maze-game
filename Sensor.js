//This class is adopted from Professor Kapp's code with some modifications
class Sensor{
    constructor() {
        // raycasters
        this.rayCaster = new THREE.Raycaster();
        this.userPosition = new THREE.Vector3(0, 0, 0);
        this.downVector = new THREE.Vector3(0, -1, 0);
        this.intersects = [];

        this.rayCasterFront = new THREE.Raycaster();
        this.cursorPosition = new THREE.Vector2(0, 0);
        this.intersectsFront = [];
    }

    getEntityInFrontOfUser() {
        // update the user's current position
        let cp = world.getUserPosition();
        this.userPosition.x = cp.x;
        this.userPosition.y = cp.y;
        this.userPosition.z = cp.z;

        let cameraDirection = new THREE.Vector3();
        world.camera.cameraEl.object3D.getWorldDirection(cameraDirection);

        // reset camera
        if (world.camera.cameraEl && world.camera.cameraEl.object3D && world.camera.cameraEl.object3D.children.length >= 2) {

            // cast a ray in front of the user 
            this.rayCasterFront.setFromCamera(this.cursorPosition, world.camera.cameraEl.object3D.children[1]);
            this.intersectsFront = this.rayCasterFront.intersectObjects(world.threeSceneReference.children, true);

            // determine which "solid" items are in front of the user
            for (let i = 0; i < this.intersectsFront.length; i++) {
                if (!this.intersectsFront[i].object.el.object3D.userData.solid) {
                    this.intersectsFront.splice(i, 1);
                    i--;
                }
            }

            if (this.intersectsFront.length > 0) {
                return this.intersectsFront[0];
            }
            return false;
        }
    }
}