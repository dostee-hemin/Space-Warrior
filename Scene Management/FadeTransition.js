class FadeTransition extends Transition {
    constructor() {
        super();

        this.alpha = 0;         // The opacity of the black tinted rectangle covering the sketch
        this.fadeSpeed = 5;     // The speed by which we change the opacity value per frame
    }

    draw() {
        super.draw();

        // Display a tinted rectangle over the entire sketch
        fill(0, this.alpha);
        noStroke();
        rectMode(CORNER);
        rect(0,0,width,height);

        // Increase or decrease the alpha based on whether we're fading in or out
        let direction = this.hasSwitchedScenes ? 1 : -1;
        this.alpha += this.fadeSpeed * direction;
    }

    // Returns true once the tint is fully opaque
    isHalfwayDone() {
        return this.alpha >= 255;
    }

    // Returns true once the tint is fully transparent
    isDone() { return this.alpha < 0; }
}