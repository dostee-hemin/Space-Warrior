class LevelScene extends Scene {
    constructor() {
        super();
    }

    draw() {
        // Draw the title as "Level"
        fill(0);
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Level', width/2, height/6);
    }
}