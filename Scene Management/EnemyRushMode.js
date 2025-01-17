class EnemyRushMode extends GameScene {
    constructor() {
        super();
        
        this.levelInfo = [];
        this.currentWaveIndex = 0;
        this.currentLevelIndex = 0;
    }

    setup() {
        super.setup();
        this.createNextLevel();
        
        super.implementPanelButtonLogic({
            "Leave": ()=>{nextScene = new MainMenuScene(); transition = new FadeTransition();},
            "Retry": ()=>{nextScene = new EnemyRushMode(); transition = new FadeTransition();}
        })
    }

    createNextLevel() {
        if(this.currentLevelIndex == levelStructures.length) {
            this.currentLevelIndex++;    // Increasing it one more time so we don't enter this block again
            super.playerWon(0);            
        } else if(this.currentLevelIndex < levelStructures.length) {
            this.currentWaveIndex = 0;
            this.levelInfo = getLevelInfo(this.currentLevelIndex++);
            this.waves = this.levelInfo.waveStructure;

            // Load all the appropriate spawners
            this.obstacleSpawners = [];
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
        }
    }

    createNextWave() {
        if(this.currentWaveIndex == this.waves.length) {
            this.currentWaveIndex++;    // Increasing it one more time so we don't enter this block again
            this.createNextLevel();            
        } else if(this.currentWaveIndex < this.waves.length)
            this.currentWave = new Wave(this.waves[this.currentWaveIndex++]);
    }

    playerWon() {

    }

    display() {
        super.display();
        
        this.levelCompletePanel.display();

        if(this.currentWaveIndex < this.waves.length+1) {
            fill(0);
            noStroke();
            textSize(30);
            textAlign(RIGHT,CENTER);
            text("Level "+this.currentLevelIndex+"/"+levelStructures.length,W-10,-70+100*this.UIEntranceAnimation);
            text("Wave "+this.currentWaveIndex+"/"+this.waves.length,W-10,-40+100*this.UIEntranceAnimation);
        }
    }
}