class MainMenuScene extends Scene {
    constructor() {
        super();
    }

    draw() {
        // Simply draws the title as the "Main Menu"
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Main Menu', width/2, height/6);
    }
}