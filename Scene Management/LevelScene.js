let attacks = [];

class LevelScene extends Scene {
    constructor() {
        super();

        this.player = new Player();
    }

    draw() {
        // Draw the title as "Level"
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Level', width/2, height/6);

        this.player.update();
        this.player.display();

        for (let i=attacks.length-1; i>=0; i--) {
            let attack = attacks[i];

            attack.update();
            attack.display();

            // Remove the attack once it's done
            if (attack.isFinished()) attacks.splice(i,1);
        }
    }

    keyPressed() {
        this.player.keyPressed();
    }
    
    keyReleased() {
        this.player.keyReleased();
    }
}