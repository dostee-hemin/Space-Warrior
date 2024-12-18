class Transition {
    constructor() {}

    draw() {}   // Called to update and display the transition animation
    isDone() {} // Returns whether or not the transition animation is complete

    // Called to switch scenes
    changeScene() {
        nextScene.start();
        currentScene.close();
        currentScene = nextScene;
    }
}