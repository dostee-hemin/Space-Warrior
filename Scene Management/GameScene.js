let attacks = [];
let entities = [];
let player;

class GameScene extends Scene {
    constructor() {
        super();

        this.shipEntranceAnimation = 0;
        this.shipExitAnimation = 0;
        this.UIEntranceAnimation = 0;
        this.gameOverAnimation = 0;    
        
        this.currentWave = null;
        this.canAddTroops = true;
        this.isPaused = false;
        this.currencyGained = 0;

        this.obstacleSpawners = [];

        this.numTroopsKilledWithoutTakingDamage = 0;
        this.isDamageFree = true;
    }

    preload() {
        return Promise.all([loadLevelStructure(), loadUpgradeInfo(), loadArmorInfo(), loadAchievementInfo()]);
    }

    setup() {
        player = new Player();

        this.levelCompletePanel = new LevelCompletePanel();
        let continueButton = createButton("Continue", W/2-100, H/2+this.levelCompletePanel.h/2 - 215, 200, 50);
        let leaveButton = createButton("Leave", W/2-100, H/2+this.levelCompletePanel.h/2 - 145, 200, 50);
        let retryButton = createButton("Retry", W/2-100, H/2+this.levelCompletePanel.h/2 - 75, 200, 50);
        this.levelCompletePanel.addUI([continueButton, leaveButton, retryButton]);
        
        this.pausePanel = new Panel('Paused', W/2, H/2, W*0.8, H*0.6);
        let resumeButton = createButton("Resume", W/2-100, H/2-this.pausePanel.h/2 + 75, 200, 50);
        let leaveButton2 = createButton("Leave", W/2-100, H/2-this.pausePanel.h/2 + 215, 200, 50);
        let retryButton2 = createButton("Retry", W/2-100, H/2-this.pausePanel.h/2 + 145, 200, 50);
        resumeButton.onPress = () => {this.resumeGame();}
        this.pausePanel.addUI([resumeButton, leaveButton2, retryButton2]);
        
        this.gameOverPanel = new Panel('Game Over', W/2, H/2, W*0.8, H*0.6);
        this.gameOverPanel.addUI([leaveButton, retryButton]);

        this.pauseButton = createButton("", 10,10,50,50);
        this.pauseButton.setStyle(emptyButtonStyle);
        this.pauseButton.onPress = () => {this.pauseGame();}
    }

    start() {
        p5.tween.manager.addTween(this)
            .addMotion('shipEntranceAnimation', 1, 1500, 'easeOutQuad')
            .addMotion('UIEntranceAnimation', 1, 1000, 'easeInOutQuad')
            .startTween()
    }

    implementPanelButtonLogic(logicInfo) {
        let setButtonLogic = (buttons) => {
            for(let button of buttons) {
                // If the button isn't mentioned in the logicInfo dictionary, remove it from the panel
                if(!(button.label in logicInfo)) {
                    // Only the "Resume" button is safe from this
                    if (button.label != "Resume") buttons.splice(buttons.indexOf(button),1);
                    continue;
                }
    
                // Implement the appropriate logic for the current button
                button.onPress = logicInfo[button.label];
            }
        };
        setButtonLogic(this.levelCompletePanel.getUI());
        setButtonLogic(this.pausePanel.getUI());
        setButtonLogic(this.gameOverPanel.getUI());       
    }

    draw() {
        // Split into update and display for pausing logic
        this.update();
        this.display();
    }
    
    update() {
        player.isPlayable = this.hasPlayerEnteredScene() && !this.hasLevelFinished() && !this.hasPlayerLost();

        // Pausing logic
        this.isPaused = this.pausePanel.isActive();
        this.pauseButton.visible = !this.isPaused && player.isPlayable;
        if(this.isPaused) return;

        for(let spawner of this.obstacleSpawners) spawner.update();

        // Wave logic
        if(this.UIEntranceAnimation == 1 && this.shipExitAnimation == 0) {
            if (this.canAddTroops) this.createNextWave();
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
                    this.numTroopsKilledWithoutTakingDamage++;
                    if(this.numTroopsKilledWithoutTakingDamage == 10) 
                        achievementManager.unlock(AchievementManager.GET_10_KILLS_WITH_NO_DAMAGE)
                    
                    this.totalEnemies--;
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
                this.currencyGained += entity.currencyPoints;
            }
        }

        // Player logic
        if(!this.hasPlayerEnteredScene())
            player.position.y = H+600 - this.shipEntranceAnimation*800;
        else if(this.hasLevelFinished()) 
            player.position.y -= this.shipExitAnimation*(min(player.position.y+400,H*0.6)/20);
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

                    if(entity == player) {
                        this.numTroopsKilledWithoutTakingDamage = 0;
                        this.isDamageFree = false;
                    }
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

        if(player.isFinished() && player.isPlayable) {
            p5.tween.manager.addTween(this)
                .addMotion('gameOverAnimation', 1, 3000)
                .onEnd(() => {this.gameOverPanel.open();})
                .startTween();
        }
    }

    createNextWave() {}

    playerWon(changeInCurrency=this.currencyGained) {
        currency += changeInCurrency;
        p5.tween.manager.addTween(this)
            .addMotion('shipExitAnimation', 0, 2000)
            .addMotion('shipExitAnimation', -0.2, 300)
            .addMotion('shipExitAnimation', 1, 1500, 'easeInQuad')
            .onEnd(() => {this.levelCompletePanel.open(changeInCurrency);})
            .startTween()
    }
    
    display() {
        if(this.currentWave) this.currentWave.draw();
        for (let entity of entities) entity.display();
        player.display();
        for (let attack of attacks) attack.display();

        // Draw the ability cooldown
        fill(100, this.UIEntranceAnimation*255);
        stroke(0, this.UIEntranceAnimation*255);
        strokeWeight(3);
        rectMode(CORNER);
        rect(20,H-35-this.UIEntranceAnimation*60,60,this.UIEntranceAnimation *60);
        noStroke();
        fill(0,100);
        rect(20,H-35-player.specialAbilityCooldown*60,60,player.specialAbilityCooldown*60);

        // Draw a health bar for the player in the bottom left corner
        player.displayHealthBar(20+this.UIEntranceAnimation*player.baseHealth*3, H-25, this.UIEntranceAnimation * player.baseHealth*6, 20);
        stroke(0);
        strokeWeight(this.UIEntranceAnimation*3);
        noFill();
        rect(20, H-35, this.UIEntranceAnimation * (player.baseHealth+player.baseSheildHealth)*6, 20);

        // Draw the pause button UI
        fill(255);
        stroke(0);
        strokeWeight(2);
        rectMode(CORNER);
        rect(10,-90+100*this.UIEntranceAnimation,50,50,8);
        strokeWeight(5);
        line(27,-80+100*this.UIEntranceAnimation,27,-50+100*this.UIEntranceAnimation);
        line(43,-80+100*this.UIEntranceAnimation,43,-50+100*this.UIEntranceAnimation);
        
        // Black cover when paused
        if(this.isPaused) {
            fill(0, 100);
            noStroke();
            rectMode(CORNER);
            rect(0,0,W,H);
        }

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
        if(!player.isPlayable) return;

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