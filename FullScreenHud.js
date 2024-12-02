let hudBuffer, hudTexture, hudPlane;

function createFullScreenHud() {
    hudBuffer = createGraphics(1024, 1024);
    hudBuffer.clear();
    hudBuffer.background(0, 0, 0, 0); // Initial transparent background

    hudTexture = world.createDynamicTextureFromCreateGraphics(hudBuffer);

    hudPlane = new AFrameP5.Plane({
        x: 0,
        y: 0,
        z: -0.5, // Close to the user
        dynamicTexture: true,
        dynamicTextureWidth: 1024,
        dynamicTextureHeight: 1024,
        asset: hudTexture,
        height: 2,
        width: 2,
        side: "double",
        opacity: 0.5
    });
}

function updateHudColor(r, g, b) {
    hudBuffer.clear();
    hudBuffer.background(r, g, b);
    world.addToHUD(hudPlane);
    
}