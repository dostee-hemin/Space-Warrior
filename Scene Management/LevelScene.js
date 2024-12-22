let attacks = [];
let entities = [];
let player;

class LevelScene extends Scene {
    constructor() {
        super();

        player = new Player();
        this.hasPlayerEnteredScene = false;
        this.wave = new Wave();
    }

    draw() {
        this.wave.draw();

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
        
        if(!this.hasPlayerEnteredScene) {
            player.position.y = lerp(player.position.y, height-200, 0.05);
            if(player.position.y < height-199) this.hasPlayerEnteredScene = true;
        }
        else player.update();
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
        if(!this.hasPlayerEnteredScene) return;
        
        player.keyPressed();
    }
    
    keyReleased() {
        if(!this.hasPlayerEnteredScene) return;

        player.keyReleased();
    }
}