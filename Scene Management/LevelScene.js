let attacks = [];
let entities = [];
let player;

class LevelScene extends Scene {
    constructor() {
        super();

        player = new Player();
        this.shipEntranceAnimation = 0;
        this.shipExitAnimation = 0;
        this.UIEntranceAnimation = 0;
        p5.tween.manager.addTween(this)
            .addMotion('shipEntranceAnimation', 1, 1500, 'easeOutQuad')
            .addMotion('UIEntranceAnimation', 1, 1000, 'easeInOutQuad')
            .startTween()

        this.waves = [];
        this.waveStructures = [{
            waitDuration: 0,
            troops: [
                {type: 'small', amount: 1, path: 'XP'}
            ]
        }];
        this.currentWaveIndex = 0;
        this.currentWave = null;
        this.canAddTroops = true;

        this.endPanel = new Panel('Level Complete', width/2, height/2, width*0.8, height*0.6);

        let closePanelButton = createButton("Close Panel", -100, this.endPanel.h/2 - 75, 200, 50);
        closePanelButton.onPress = () => {this.endPanel.close();};
        this.endPanel.addUI([closePanelButton]);
    }

    draw() {
        if(this.UIEntranceAnimation == 1 && this.shipExitAnimation == 0) {
            if (this.canAddTroops) {
                if(this.currentWaveIndex == this.waveStructures.length) {
                    this.currentWaveIndex++;
                    p5.tween.manager.addTween(this)
                    .addMotion('shipExitAnimation', 0, 2000)
                    .addMotion('shipExitAnimation', -0.2, 300)
                    .addMotion('shipExitAnimation', 1, 1500, 'easeInQuad')
                    .onEnd(() => {
                        this.endPanel.open();
                    })
                    .startTween()
                } else if(this.currentWaveIndex < this.waveStructures.length) 
                    this.currentWave = new Wave(this.waveStructures[this.currentWaveIndex++]);
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
        
        if(!this.hasLevelStarted())
            player.position.y = height+600 - this.shipEntranceAnimation*800;
        else if(this.shipExitAnimation == 0) player.update();
        else player.position.y -= this.shipExitAnimation*(min(player.position.y+400,height*0.6)/20);

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

         if(this.endPanel) this.endPanel.display();
    }

    hasLevelStarted() {
        return this.shipEntranceAnimation == 1;
    }

    hasLevelFinished() {
        return this.shipExitAnimation != 0;
    }

    keyPressed() {
        if(!this.hasLevelStarted() || this.hasLevelFinished()) return;
        
        player.keyPressed();
    }
    
    keyReleased() {
        player.keyReleased();
    }
}