let hudBuffer, hudTexture, hudPlane;

function createFullScreenHud() {
    hudBuffer = createGraphics(window.innerWidth, window.innerHeight);
    hudBuffer.clear();
    hudBuffer.background(0, 0, 0, 0); // Initial transparent background

    hudTexture = world.createDynamicTextureFromCreateGraphics(hudBuffer);

    hudPlane = new AFrameP5.Plane({
        x: 0,
        y: 0,
        z: -1, // Close to the user
        dynamicTexture: true,
        dynamicTextureWidth: window.innerWidth,
        dynamicTextureHeight: window.innerHeight,
        asset: hudTexture,
        height: 3,
        width: 5,
        side: "double",
        opacity: 0.5
    });
}

function updateHudColor(r, g, b) {
    hudBuffer.clear();
    hudBuffer.background(r, g, b);
    world.addToHUD(hudPlane);
}