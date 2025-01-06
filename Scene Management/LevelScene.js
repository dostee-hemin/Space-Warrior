let attacks = [];
let entities = [];
let player;

class LevelScene extends Scene {
    constructor(levelNumber) {
        super();

        this.shipEntranceAnimation = 0;
        this.shipExitAnimation = 0;
        this.UIEntranceAnimation = 0;
        
        this.levelNumber = levelNumber;
        this.levelInfo = null;
        this.currentWaveIndex = 0;
        this.currentWave = null;
        this.canAddTroops = true;
        this.isPaused = false;
        this.levelCurrency = 0;

        // Get all pieces of armor that haven't been unlocked yet
        this.lockedArmorPieces = [];
        this.totalEnemies = 0;
        this.numArmorPiecesLeft = 0;
        this.obstacleSpawners = [];
    }

    preload() {
        return Promise.all([loadLevelStructure(), loadUpgradeInfo(), loadArmorInfo(), loadAchievementInfo()]);
    }

    setup() {
        player = new Player();

        this.levelCompletePanel = new LevelCompletePanel();
        this.levelInfo = getLevelInfo(this.levelNumber);
        this.waves = this.levelInfo.waveStructure;
        for(let i=0; i<this.waves.length; i++) {
            for(let j=0; j<this.waves[i].troops.length; j++) {
                if(this.waves[i].troops[j].type == "boss") continue;
                this.totalEnemies += this.waves[i].troops[j].amount;
            }
        }

        for(let spawnerType of this.levelInfo.obstacles) {
            switch(spawnerType) {
                case "asteroid":
                    this.obstacleSpawners.push(new AsteroidSpawner());
                    break;
                case "asteroidWall":
                    this.obstacleSpawners.push(new AsteroidWallSpawner());
                    break;
                case "debris":
                    this.obstacleSpawners.push(new DebrisSpawner());
                    break;
            }
        }

        let continueButton = createButton("Continue", -100, this.levelCompletePanel.h/2 - 215, 200, 50);
        continueButton.onPress = () => {
            nextScene = new StoryScene(this.levelNumber+1);
            transition = new FadeTransition();
        };
        let mapButton = createButton("Map", -100, this.levelCompletePanel.h/2 - 145, 200, 50);
        mapButton.onPress = () => {
            nextScene = new MapScene();
            transition = new FadeTransition();
        };
        let retryButton = createButton("Retry", -100, this.levelCompletePanel.h/2 - 75, 200, 50);
        retryButton.onPress = () => {
            nextScene = new LevelScene(this.levelNumber);
            transition = new FadeTransition();
        };
        this.levelCompletePanel.addUI([continueButton, mapButton, retryButton]);
        
        this.pausePanel = new Panel('Paused', width/2, height/2, width*0.8, height*0.6);
        let resumeButton = createButton("Resume", -100, -this.pausePanel.h/2 + 75, 200, 50);
        resumeButton.onPress = () => {this.resumeGame();}
        let retryButton2 = createButton("Retry", -100, -this.pausePanel.h/2 + 145, 200, 50);
        retryButton2.onPress = () => {
            nextScene = new LevelScene(this.levelNumber);
            transition = new FadeTransition();
        };
        let mapButton2 = createButton("Map", -100, -this.pausePanel.h/2 + 215, 200, 50);
        mapButton2.onPress = () => {
            nextScene = new MapScene();
            transition = new FadeTransition();
        };
        this.pausePanel.addUI([resumeButton,mapButton2,retryButton2]);

        this.pauseButton = createButton("", 10,10,50,50);
        this.pauseButton.onPress = () => {this.pauseGame();}
        this.pauseButton.setStyle(emptyButtonStyle);

        this.gameOverPanel = new Panel('Game Over', width/2, height/2, width*0.8, height*0.6);
        this.gameOverPanel.addUI([mapButton, retryButton]);
        this.gameOverAnimation = 0;

        
        for(let i=0; i<armorInfo.length; i++) {
            for(let j=0; j<armorInfo[i].pieces.length; j++) {
                if(armorInfo[i].pieces[j].unlocked) continue;

                this.lockedArmorPieces.push(armorInfo[i].pieces[j]);
            }
        }
        this.numArmorPiecesLeft = this.levelInfo.numArmorCollectables - this.levelInfo.numArmorCollected; 
    }

    start() {
        p5.tween.manager.addTween(this)
            .addMotion('shipEntranceAnimation', 1, 1500, 'easeOutQuad')
            .addMotion('UIEntranceAnimation', 1, 1000, 'easeInOutQuad')
            .startTween()
    }

    draw() {
        // Split into update and display for pausing logic
        this.update();
        this.display();
    }
    
    update() {
        // Pausing logic
        this.isPaused = this.pausePanel.isActive();
        this.pauseButton.visible = !this.isPaused && this.hasLevelStarted() && !this.hasLevelFinished() && !this.hasPlayerLost();
        if(this.isPaused) return;

        for(let spawner of this.obstacleSpawners) spawner.update();

        // Wave logic
        if(this.UIEntranceAnimation == 1 && this.shipExitAnimation == 0) {
            if (this.canAddTroops) {
                if(this.currentWaveIndex == this.waves.length) {
                    this.currentWaveIndex++;    // Increasing it one more time so we don't enter this block again
                    if(this.levelNumber == 0) achievementManager.unlock(AchievementManager.COMPLETED_FIRST_LEVEL);
                    unlockLevel(this.levelNumber + 1);
                    completeLevel(this.levelNumber);
                    currency += this.levelCurrency;
                    p5.tween.manager.addTween(this)
                        .addMotion('shipExitAnimation', 0, 2000)
                        .addMotion('shipExitAnimation', -0.2, 300)
                        .addMotion('shipExitAnimation', 1, 1500, 'easeInQuad')
                        .onEnd(() => {this.levelCompletePanel.open(this.levelCurrency);})
                        .startTween()
                } else if(this.currentWaveIndex < this.waves.length)
                    this.currentWave = new Wave(this.waves[this.currentWaveIndex++]);
            }
            this.canAddTroops = this.currentWave.hasReleasedTroops();
            for(let entity of entities) {
                if(entity instanceof Troop || entity instanceof Boss) {
                    this.canAddTroops = false;
                    break;
                }
            }
        }

        // Entity logic
        for (let i=entities.length-1; i>=0; i--) {
            let entity = entities[i];
            if(entity == player) continue;
            
            entity.update();
            
            if (entity.isFinished()) {
                // If a troop is defeated, there's a slight chance it will drop a random armor piece
                if(entity instanceof Troop) {
                    this.totalEnemies--;
                    achievementManager.unlock(AchievementManager.KILLED_FIRST_ENEMY);
                    if(Math.random(1) <= this.numArmorPiecesLeft/this.totalEnemies) {
                        let armorPiece = this.lockedArmorPieces.splice(Math.floor(Math.random()*this.lockedArmorPieces.length),1)[0];
                        this.numArmorPiecesLeft--;
                        new ArmorPickupItem(entity.position.x, entity.position.y, armorPiece);
                    }
                } 
                // If an armor piece is collected, update how many have been collected in the level so far
                else if(entity instanceof ArmorPickupItem) {
                    if(entity.isPickedUp()) this.levelInfo.numArmorCollected++;
                }
                entities.splice(i,1);
                this.levelCurrency += entity.currencyPoints;
            }
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

                // This implements the logic where the warship's rockets damage its forcefield
                if(!(entity instanceof Boss)) continue
                if(entity.stage != entity.SHIELD_STAGE) continue
                if(attack.isFriendly) continue
                if(attack.position.y < entity.position.y+100) {
                    attack.interact(entity);
                    entity.changeToNextStage();
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
        text('Level ' + (this.levelNumber+1), width/2, height/6);

        if(this.currentWave) this.currentWave.draw();
        for (let entity of entities) entity.display();
        player.display();
        for (let attack of attacks) attack.display();

        // Draw the ability cooldown
        fill(100, this.UIEntranceAnimation*255);
        stroke(0, this.UIEntranceAnimation*255);
        strokeWeight(3);
        rectMode(CORNER);
        rect(20,height-35-this.UIEntranceAnimation*60,60,this.UIEntranceAnimation *60);
        noStroke();
        fill(0,100);
        rect(20,height-35-player.specialAbilityCooldown*60,60,player.specialAbilityCooldown*60);

        // Draw a health bar for the player in the bottom left corner
        player.displayHealthBar(20+this.UIEntranceAnimation*player.baseHealth*3, height-25, this.UIEntranceAnimation * player.baseHealth*6, 20);
        stroke(0);
        strokeWeight(this.UIEntranceAnimation*3);
        noFill();
        rect(20, height-35, this.UIEntranceAnimation * (player.baseHealth+player.baseSheildHealth)*6, 20);

        // Draw the pause button UI
        fill(255);
        stroke(0);
        strokeWeight(2);
        rectMode(CORNER);
        rect(10,10,50,50,8);
        strokeWeight(5);
        line(27,20,27,50);
        line(43,20,43,50);

        // Currency counter
        fill(0);
        noStroke();
        textSize(40);
        textAlign(CENTER,CENTER);
        text("$"+ this.levelCurrency, width/2,30);
        
        // Black cover when paused
        if(this.isPaused) {
            fill(0, 100);
            noStroke();
            rectMode(CORNER);
            rect(0,0,width,height);
        }

        this.levelCompletePanel.display(this.levelInfo.numArmorCollected, this.levelInfo.numArmorCollectables);
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