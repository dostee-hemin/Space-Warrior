let attacks = [];
let entities = [];
let player;

class LevelScene extends Scene {
    constructor() {
        super();

        player = new Player();
        new TroopGroup(1, LargeTroop, HorizontalLinePath);
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
            if(entity == player) continue;
            
            entity.update();
            entity.display();
            
            // Remove the entity once it's done
            if (entity.isFinished()) entities.splice(i,1);
        }
        
        player.update();
        player.display();
        
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
    }

    keyPressed() {
        player.keyPressed();
    }
    
    keyReleased() {
        player.keyReleased();
    }
}