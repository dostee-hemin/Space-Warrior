class AchievementScene extends Scene {
    constructor() {
        super();
    }

    draw() {
        // Simply draws the title as the "Achievements"
        fill(0);
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Achievements', width/2, height/6);
    }
}