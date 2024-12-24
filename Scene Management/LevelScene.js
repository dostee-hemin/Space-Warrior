let attacks = [];
let entities = [];
let player;

class LevelScene extends Scene {
    constructor() {
        super();

        this.shipEntranceAnimation = 0;
        this.shipExitAnimation = 0;
        this.UIEntranceAnimation = 0;
        
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
        this.isPaused = false;
    }

    start() {
        player = new Player();
        p5.tween.manager.addTween(this)
            .addMotion('shipEntranceAnimation', 1, 1500, 'easeOutQuad')
            .addMotion('UIEntranceAnimation', 1, 1000, 'easeInOutQuad')
            .startTween()

        this.levelCompletePanel = new Panel('Level Complete', width/2, height/2, width*0.8, height*0.6);

        let homeButton = createButton("Home", -100, this.levelCompletePanel.h/2 - 145, 200, 50);
        homeButton.onPress = () => {
            nextScene = new MainMenuScene();
            transition = new FadeTransition();
        };
        let retryButton = createButton("Retry", -100, this.levelCompletePanel.h/2 - 75, 200, 50);
        retryButton.onPress = () => {
            nextScene = new LevelScene();
            transition = new FadeTransition();
        };
        this.levelCompletePanel.addUI([homeButton,retryButton]);
        
        this.pausePanel = new Panel('Paused', width/2, height/2, width*0.8, height*0.6);
        let resumeButton = createButton("Resume", -100, -this.pausePanel.h/2 + 75, 200, 50);
        resumeButton.onPress = () => {this.resumeGame();}
        let retryButton2 = createButton("Retry", -100, -this.pausePanel.h/2 + 145, 200, 50);
        retryButton2.onPress = () => {
            nextScene = new LevelScene();
            transition = new FadeTransition();
        };
        let homeButton2 = createButton("Home", -100, -this.pausePanel.h/2 + 215, 200, 50);
        homeButton2.onPress = () => {
            nextScene = new MainMenuScene();
            transition = new FadeTransition();
        };
        this.pausePanel.addUI([resumeButton,homeButton2,retryButton2]);

        this.pauseButton = createButton("", 10,10,50,50);
        this.pauseButton.onPress = () => {this.pauseGame();}
        this.pauseButton.setStyle({
            fillBg: color(0,0),
            fillBgHover: color(0,50),
            fillBgActive: color(0,100),
            strokeWeight: 0
        });

        this.gameOverPanel = new Panel('Game Over', width/2, height/2, width*0.8, height*0.6);
        this.gameOverPanel.addUI([homeButton, retryButton]);
        this.gameOverAnimation = 0;
    }

    draw() {
        // Split into update and display for pausing logic
        this.update();
        this.display();
    }
    
    update() {
        // Pausing logic
        this.isPaused = this.pausePanel.isActive();
        this.pauseButton.visible = !this.isPaused && this.hasLevelStarted() && !this.hasLevelFinished();
        if(this.isPaused) return;

        // Wave logic
        if(this.UIEntranceAnimation == 1 && this.shipExitAnimation == 0) {
            if (this.canAddTroops) {
                if(this.currentWaveIndex == this.waveStructures.length) {
                    this.currentWaveIndex++;
                    p5.tween.manager.addTween(this)
                    .addMotion('shipExitAnimation', 0, 2000)
                    .addMotion('shipExitAnimation', -0.2, 300)
                    .addMotion('shipExitAnimation', 1, 1500, 'easeInQuad')
                    .onEnd(() => {this.levelCompletePanel.open();})
                    .startTween()
                } else if(this.currentWaveIndex < this.waveStructures.length) 
                    this.currentWave = new Wave(this.waveStructures[this.currentWaveIndex++]);
            }
            this.canAddTroops = entities.length == 1 && this.currentWave.hasReleasedTroops();
        }

        // Entity logic
        for (let i=entities.length-1; i>=0; i--) {
            let entity = entities[i];
            if(entity == player) continue;
            
            entity.update();
            
            if (entity.isFinished()) entities.splice(i,1);
        }

        // Player logic
        if(!this.hasPlayerEnteredScene())
            player.position.y = height+600 - this.shipEntranceAnimation*800;
        else if(this.hasLevelFinished()) 
            player.position.y -= this.shipExitAnimation*(min(player.position.y+400,height*0.6)/20);
        else if(this.hasPlayerLost())
            player.position.y += 1;
        else
            player.update();

        // Attack logic
        for (let i=attacks.length-1; i>=0; i--) {
            let attack = attacks[i];
            
            attack.update();
            
            for(let j=0; j<entities.length && !this.hasPlayerLost(); j++) {
                let entity = entities[j];
                if(attack.hits(entity)) {
                    attack.interact(entity);
                }
            }

            if (attack.isFinished()) attacks.splice(i,1);
        }

        if(player.isFinished() && !this.hasPlayerLost()) {
            p5.tween.manager.addTween(this)
                .addMotion('gameOverAnimation', 1, 3000)
                .onEnd(() => {this.gameOverPanel.open();})
                .startTween();
        }
    }
    
    display() {
        // Draw the title as "Level"
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Level', width/2, height/6);

        if(this.currentWave) this.currentWave.draw();
        for (let entity of entities) entity.display();
        player.display();
        for (let attack of attacks) attack.display();

        // Draw a health bar for the player in the bottom left corner
        player.displayHealthBar(20+this.UIEntranceAnimation*100, height-25, this.UIEntranceAnimation * 200, 20, CORNER);
        stroke(0);
        strokeWeight(this.UIEntranceAnimation*3);
        noFill();
        rect(20, height-35, this.UIEntranceAnimation * 200, 20);

        // Draw the pause button UI
        fill(255);
        stroke(0);
        strokeWeight(2);
        rectMode(CORNER);
        rect(10,10,50,50,8);
        strokeWeight(5);
        line(27,20,27,50);
        line(43,20,43,50);
        
        // Black cover when paused
        if(this.isPaused) {
            fill(0, 100);
            noStroke();
            rectMode(CORNER);
            rect(0,0,width,height);
        }

        this.levelCompletePanel.display();
        this.gameOverPanel.display();
        this.pausePanel.display();
    }

    hasPlayerEnteredScene() {
        return this.shipEntranceAnimation == 1;
    }

    hasPlayerLost() {
        return this.gameOverAnimation != 0;
    }

    hasLevelStarted() {
        return this.UIEntranceAnimation == 1;
    }

    hasLevelFinished() {
        return this.shipExitAnimation != 0;
    }

    pauseGame() {
        this.pausePanel.open();
        if(this.currentWave) this.currentWave.pause();
    }
    
    resumeGame() {
        this.pausePanel.close();
        if(this.currentWave) this.currentWave.resume();
    }

    keyPressed() {
        if(!this.hasPlayerEnteredScene() || this.hasLevelFinished() || this.hasPlayerLost()) return;

        player.keyPressed();

        if(!this.hasLevelStarted()) return;

        if(keyCode == ESCAPE && this.pausePanel.startAnimation == int(this.pausePanel.startAnimation)) {
            if(this.isPaused) this.resumeGame();
            else this.pauseGame();
        }
        
    }
    
    keyReleased() {
        player.keyReleased();
    }

    close() {
        attacks = [];
        entities = [];
        player = null;
    }
}