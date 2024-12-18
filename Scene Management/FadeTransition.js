class FadeTransition extends Transition {
    constructor() {
        super();

        this.alpha = 0;         // The opacity of the black tinted rectangle covering the sketch
        this.fadingIn = true;   // Whether we're fading in or out
        this.fadeSpeed = 5;     // The speed by which we change the opacity value per frame
    }

    draw() {
        // Display a tinted rectangle over the entire sketch
        fill(0, this.alpha);
        noStroke();
        rectMode(CORNER);
        rect(0,0,width,height);

        // Increase or decrease the alpha based on whether we're fading in or out
        let direction = this.fadingIn ? 1 : -1;
        this.alpha += this.fadeSpeed * direction;

        // Once the fade becomes pitch black, switch scenes
        if (this.alpha >= 255) {
            super.changeScene();
            this.fadingIn = false;
        }
    }

    // Returns true once the tint has faded out completely
    isDone() { return this.alpha < 0; }
}