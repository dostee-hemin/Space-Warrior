// Defines structure of each scene implementation
class Scene {
    constructor() {
        preload();
    }

    preload() {} // Called before start to load necessary files
    start() {}   // Called to initialize values
    draw() {}    // Called once per frame to update and draw scene elements
    close() {}   // Called before switching scenes to reset values
}