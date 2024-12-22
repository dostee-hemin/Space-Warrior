let attacks = [];
let entities = [];

class LevelScene extends Scene {
    constructor() {
        super();

        this.player = new Player();
        new TroopGroup(10, SmallTroop, HorizontalBarsPath);
    }

    draw() {
        // Draw the title as "Level"
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Level', width/2, height/6);

        for (let i=entities.length-1; i>=0; i--) {
            let entity = entities[i];
            if(entity == this.player) continue;
            
            entity.update();
            entity.display();
            
            // Remove the entity once it's done
            if (entity.isFinished()) entities.splice(i,1);
        }
        
        this.player.update();
        this.player.display();
        
        for (let i=attacks.length-1; i>=0; i--) {
            let attack = attacks[i];
            
            attack.update();
            attack.display();
            
            for(let j=0; j<entities.length; j++) {
                let entity = entities[j];
                if(attack.hits(entity)) {
                    attack.interact(entity);
                }
            }

            // Remove the attack once it's done
            if (attack.isFinished()) attacks.splice(i,1);
        }

        // Draw a health bar for the player in the bottom left corner
        fill(255,0,0); 
        noStroke();
        rectMode(CORNER);
        rect(20, height-40, 200, 20);
        fill(0,255,0);
        rect(20, height-40, max(0, map(this.player.health, 0, this.player.baseHealth, 0, 200)), 20);
        stroke(0);
        strokeWeight(3);
        noFill();
        rect(20, height-40, 200, 20);

    }

    keyPressed() {
        this.player.keyPressed();
    }
    
    keyReleased() {
        this.player.keyReleased();
    }
}