// Defines structure of each scene implementation
class Scene {
    constructor() {
        this.preload();
    }

    preload() {} // Called before start to load necessary files
    start() {}   // Called to initialize values
    draw() {}    // Called once per frame to update and draw scene elements
    close() {}   // Called before switching scenes to reset values
    keyPressed() {}     // Called to handle player inputs when a key is pressed
    keyReleased() {}    // Called to handle player inputs when a key is released
}