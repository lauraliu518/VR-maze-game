class Tree {
    constructor(
        // world, 
        x, y, z,
        scale = 8,
        rotationX = 180,
        asset = 'trees',
        mtl = 'tree_mtl') {
        this.tree = new AFrameP5.OBJ({
          asset: asset,        
          mtl: mtl,            
          x: x,                
          y: y,                
          z: z,                
          rotationX: rotationX,
          scaleX: scale,       
          scaleY: scale,       
          scaleZ: scale,       
        });
        world.add(this.tree);
      }
}