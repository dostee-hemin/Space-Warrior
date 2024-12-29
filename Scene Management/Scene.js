// Defines structure of each scene implementation
class Scene {
    constructor() {
        this.preloadComplete = false;
        this.waitForPreload();
    }

    waitForPreload() {
        this.preload().then(() => {
            this.preloadComplete = true;
        });
    }

    // Called before start to load necessary files
    preload() {return Promise.resolve();}
    setup() {}   // Called to initialize values
    start() {}   // Called when transition is complete
    draw() {}    // Called once per frame to update and draw scene elements
    close() {}   // Called before switching scenes to reset values
    keyPressed() {}     // Called to handle player inputs when a key is pressed
    keyReleased() {}    // Called to handle player inputs when a key is released
}