let attacks = [];
let entities = [];
let player;

class LevelScene extends Scene {
    constructor() {
        super();

        player = new Player();
        this.hasPlayerEnteredScene = false;
        this.shipEntranceAnimation = 0;
        this.UIEntranceAnimation = 0;
        p5.tween.manager.addTween(this)
            .addMotion('shipEntranceAnimation', 1, 1500, 'easeOutQuad')
            .addMotion('UIEntranceAnimation', 1, 1000, 'easeInOutQuad')
            .startTween()

        this.waves = [];
        this.waveStructures = [{
            waitDuration: 4000,
            troops: [
                {type: 'small', amount: 5, path: 'XP'},
                {type: 'medium', amount: 3, path: 'HBP'},
            ]
        },
        {
            waitDuration: 2000,
            troops: [
                {type: 'small', amount: 10, path: 'RP'},
            ]
        }];
        this.currentWaveIndex = 0;
        this.currentWave = null;
        this.canAddTroops = true;
    }

    draw() {
        if(this.UIEntranceAnimation == 1) {
            if (this.canAddTroops) {
                if(this.currentWaveIndex >= this.waveStructures.length) {
                    console.log('Level completed!');
                } else this.currentWave = new Wave(this.waveStructures[this.currentWaveIndex++]);
            }
            this.canAddTroops = entities.length == 1 && this.currentWave.hasReleasedTroops();
            this.currentWave.draw();
        }



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
            player.position.y = height+600 - this.shipEntranceAnimation*800;
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


         // Draw a health bar for the player in the bottom left corner
         player.displayHealthBar(20+this.UIEntranceAnimation*100, height-25, this.UIEntranceAnimation * 200, 20, CORNER);
         stroke(0);
         strokeWeight(this.UIEntranceAnimation*3);
         noFill();
         rect(20, height-35, this.UIEntranceAnimation * 200, 20);
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