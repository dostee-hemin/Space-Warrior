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
        this.levelCompletePanel.addUI([continueButton, mapButton]);
        this.gameOverPanel.addUI([mapButton])

        let mapButton2 = createButton("Map", -100, -this.pausePanel.h/2 + 215, 200, 50);
        mapButton2.onPress = () => {
            nextScene = new MapScene();
            transition = new FadeTransition();
        };
        this.pausePanel.addUI([mapButton2]);

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

        this.levelCompletePanel.display(this.levelInfo.numArmorCollected, this.levelInfo.numArmorCollectables);

        if(this.currentWaveIndex > 0 && this.currentWaveIndex < this.waves.length+1) {
            fill(0);
            noStroke();
            textSize(30);
            textAlign(RIGHT,CENTER);
            text("Wave "+this.currentWaveIndex+"/"+this.waves.length,width-10,30);
        }
    }
}