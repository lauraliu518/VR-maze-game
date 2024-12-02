//This class is adopted from Professor Kapp's code with some modifications
class Sensor{
    constructor() {
        // raycasters
        this.rayCaster = new THREE.Raycaster();
        this.userPosition = new THREE.Vector3(0, 0, 0);
        this.downVector = new THREE.Vector3(0, -1, 0);
        this.behindVector = new THREE.Vector3(0, 0, 1);
        this.leftVector = new THREE.Vector3(-1, 0, 0);
        this.rightVector = new THREE.Vector3(1, 0, 0);

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
            let camera = false;
            for (let child of world.camera.cameraEl.object3D.children) {
                if (child.type == 'PerspectiveCamera') {
                    camera = child;
                    break;
                }
            }
            if (!camera) {
                return;
            }
            // cast a ray in front of the user 
            this.rayCasterFront.setFromCamera(this.cursorPosition, camera);
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

    getEntityBehindUser() {
        // update the user's current position
        let cp = world.getUserPosition();
        this.userPosition.x = cp.x;
        this.userPosition.y = cp.y;
        this.userPosition.z = cp.z;

        this.rayCaster.set(this.userPosition, this.behindVector);
        this.intersects = this.rayCaster.intersectObjects(world.threeSceneReference.children, true);

        // determine which "solid" or "stairs" items are below
        for (let i = 0; i < this.intersects.length; i++) {
            if (!(this.intersects[i].object.el.object3D.userData.solid || this.intersects[i].object.el.object3D.userData.stairs)) {
                this.intersects.splice(i, 1);
                i--;
            }
        }

        if (this.intersects.length > 0) {
            return this.intersects[0];
        }
        return false;
    }

    getEntityLeftOfUser() {
        // update the user's current position
        let cp = world.getUserPosition();
        this.userPosition.x = cp.x;
        this.userPosition.y = cp.y;
        this.userPosition.z = cp.z;
    
        this.rayCaster.set(this.userPosition, this.leftVector);
        this.intersects = this.rayCaster.intersectObjects(world.threeSceneReference.children, true);
    
        // determine which "solid" or "stairs" items are below
        for (let i = 0; i < this.intersects.length; i++) {
            if (!(this.intersects[i].object.el.object3D.userData.solid || this.intersects[i].object.el.object3D.userData.stairs)) {
                this.intersects.splice(i, 1);
                i--;
            }
        }
    
        if (this.intersects.length > 0) {
            return this.intersects[0];
        }
        return false;
    }

    getEntityRightOfUser() {
        // update the user's current position
        let cp = world.getUserPosition();
        this.userPosition.x = cp.x;
        this.userPosition.y = cp.y;
        this.userPosition.z = cp.z;
    
        this.rayCaster.set(this.userPosition, this.rightVector);
        this.intersects = this.rayCaster.intersectObjects(world.threeSceneReference.children, true);
    
        // determine which "solid" or "stairs" items are below
        for (let i = 0; i < this.intersects.length; i++) {
            if (!(this.intersects[i].object.el.object3D.userData.solid || this.intersects[i].object.el.object3D.userData.stairs)) {
                this.intersects.splice(i, 1);
                i--;
            }
        }
    
        if (this.intersects.length > 0) {
            return this.intersects[0];
        }
        return false;
    }
}