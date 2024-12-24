class Transition {
    constructor() {
        // This boolean guarantees we switch scenes only once
        this.hasSwitchedScenes = false;
        for (let object of gui.objects) object.enabled = false;
    }

    // Called to update and display the transition animation
    draw() {
        // All transitions must switch scenes when they reach the halfway point
        if(this.isHalfwayDone() && !this.hasSwitchedScenes) {
            switchToNextScene();
            this.hasSwitchedScenes = true;
        }
    }

    isHalfwayDone() {} // Returns true if the canvas is completely covered by the animation and ready to switch scenes
    isDone() {} // Returns true if the transition animation is complete
}