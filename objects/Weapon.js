class Weapon {
    static isSwinging = false; 
    constructor() {
      // Create a parent container entity
      this.container = document.createElement('a-entity');
      this.container.setAttribute('position', '0 0 0');
      world.scene.appendChild(this.container);
  
      // Create the weapon object
      this.weapon = new AFrameP5.GLTF({
        x: 0.5, // Position relative to the container
        y: 0,
        z: -1.3,
        scaleX: 1.5,
        scaleY:1.5,
        asset: "weapon_model",
        rotationX: 90, // Initial rotation
      });
  
      // Add the weapon to the container
      this.container.appendChild(this.weapon.tag);
  
      // Swing state
      Weapon.isSwinging = false;
      this.swingStartTime = 0;
      this.swingDuration = 500; // Swing duration in ms
  
      // Store the initial rotation
      this.initialRotationX = 90; // Degrees
  
      // Event listener for swinging

      //window.addEventListener('click', () => this.swing());
    }
  
    swing() {
      if (Weapon.isSwinging || totalSwing <= 0) return; // Avoid overlapping swings
      this.swingStartTime = millis();
      Weapon.isSwinging = true;
      totalSwing--;
    }
  
    update(userPosition, userRotation) {
      if(keyIsDown(32)){
        this.swing();
      }
      // Update the container position to match the user position
      this.container.object3D.position.set(userPosition.x, userPosition.y, userPosition.z);
  
      // Update the container rotation to match the user rotation
      this.container.object3D.rotation.y = userRotation.y;
  
      // If swinging, calculate and apply swing rotation
      if (Weapon.isSwinging) {
        const elapsedTime = millis() - this.swingStartTime;
        const swingAngle = -Math.sin((elapsedTime / this.swingDuration) * Math.PI) * 60; // Swing -60 to +60
        const totalRotationX = this.initialRotationX + swingAngle; // Add the initial offset
        this.weapon.tag.object3D.rotation.set((totalRotationX * Math.PI) / 180, 0, (-swingAngle * Math.PI*0.8) / 180); // Apply swing rotation
  
        if (elapsedTime >= this.swingDuration) {
            Weapon.isSwinging = false;        }
        }
    }
  }
  