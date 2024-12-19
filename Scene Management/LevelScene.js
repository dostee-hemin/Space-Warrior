class LevelScene extends Scene {
    constructor() {
        super();

        this.player = new Player();
    }

    draw() {
        // Draw the title as "Level"
        fill(0);
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Level', width/2, height/6);

        this.player.update();
        this.player.display();
    }

    keyPressed() {
        this.player.keyPressed();
    }
    
    keyReleased() {
        this.player.keyReleased();
    }
}