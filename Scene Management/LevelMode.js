class LevelMode extends GameScene {
    constructor(levelNumber) {
        super();
        
        this.levelNumber = levelNumber;
        this.levelInfo = null;
        this.currentWaveIndex = 0;

        // Get all pieces of armor that haven't been unlocked yet
        this.lockedArmorPieces = [];
        this.totalEnemies = 0;
        this.numArmorPiecesLeft = 0;
    }

    setup() {
        super.setup();

        // Load the wave info for the troops
        this.levelInfo = getLevelInfo(this.levelNumber);
        this.waves = this.levelInfo.waveStructure;
        for(let i=0; i<this.waves.length; i++) {
            for(let j=0; j<this.waves[i].troops.length; j++) {
                if(this.waves[i].troops[j].type == "boss") continue;
                this.totalEnemies += this.waves[i].troops[j].amount;
            }
        }

        // Load all the appropriate spawners
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

        // Figure out what armor we can provide in this level
        for(let i=0; i<armorInfo.length; i++) {
            for(let j=0; j<armorInfo[i].pieces.length; j++) {
                if(armorInfo[i].pieces[j].unlocked) continue;

                this.lockedArmorPieces.push(armorInfo[i].pieces[j]);
            }
        }
        this.numArmorPiecesLeft = this.levelInfo.numArmorCollectables - this.levelInfo.numArmorCollected; 
    
        super.implementPanelButtonLogic({
            "Continue": ()=>{nextScene = new StoryScene(this.levelNumber+1); transition = new FadeTransition();},
            "Leave": ()=>{nextScene = new MapScene(); transition = new FadeTransition();},
            "Retry": ()=>{nextScene = new LevelMode(this.levelNumber); transition = new FadeTransition();}
        })
    }

    

    createNextWave() {
        if(this.currentWaveIndex == this.waves.length) {
            this.currentWaveIndex++;    // Increasing it one more time so we don't enter this block again
            this.playerWon();            
        } else if(this.currentWaveIndex < this.waves.length)
            this.currentWave = new Wave(this.waves[this.currentWaveIndex++]);
    }

    playerWon() {
       super.playerWon();

       if(this.levelNumber == 0) achievementManager.unlock(AchievementManager.COMPLETED_FIRST_LEVEL);
       unlockLevel(this.levelNumber + 1);
       completeLevel(this.levelNumber);
    }

    display() {
        super.display();

        // Currency counter
        fill(0);
        noStroke();
        textSize(40);
        textAlign(CENTER,CENTER);
        text("$"+ this.currencyGained, W/2,-70+100*this.UIEntranceAnimation);
        
        if(this.currentWaveIndex < this.waves.length+1) {
            fill(0);
            noStroke();
            textSize(30);
            textAlign(RIGHT,CENTER);
            text("Wave "+this.currentWaveIndex+"/"+this.waves.length,W-10,-70+100*this.UIEntranceAnimation);
        }

        this.levelCompletePanel.display(this.levelInfo.numArmorCollected, this.levelInfo.numArmorCollectables);
    }
}