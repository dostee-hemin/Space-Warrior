class SurvivalMode extends GameScene {
    constructor() {
        super();
        
        this.currentWaveNumber = 0;
    }

    setup() {
        super.setup();
        
        super.implementPanelButtonLogic({
            "Leave": ()=>{nextScene = new MainMenuScene(); transition = new FadeTransition();},
            "Retry": ()=>{nextScene = new SurvivalMode(); transition = new FadeTransition();}
        })
    }

    createNextWave() {
        this.waves = [{"waitDuration": 1000, "troops":[]}];
        let possiblePaths = ["HBP","HLP","RP","XP","VBP"];
        let minTroops = 1+Math.floor(this.currentWaveNumber/3); // Every 3 levels, add one more minimum troop
        do {
            if(Math.random() < 0.8) {
                let chosenPath = getRandomElement(possiblePaths);
                let numTroops = Math.floor(Math.random()*10)+minTroops
                this.waves[0].troops.push({"type": "small", "amount": numTroops, "path": chosenPath});
            }
            if(Math.random() < 0.5) {
                let chosenPath = getRandomElement(possiblePaths);
                let numTroops = Math.floor(Math.random()*5)+minTroops
                this.waves[0].troops.push({"type": "medium", "amount": numTroops, "path": chosenPath});
            }
            if(Math.random() < 0.3) {
                let chosenPath = getRandomElement(possiblePaths);
                let numTroops = Math.floor(Math.random()*3)+minTroops
                this.waves[0].troops.push({"type": "large", "amount": numTroops, "path": chosenPath});
            }
        } while(this.waves[0].troops.length == 0)

        this.obstacleSpawners = [];
        let possibleSpawners = [];
        if(Math.random() < 0.8) possibleSpawners.push("asteroid");
        if(Math.random() < 0.5) possibleSpawners.push("asteroidWall");
        if(Math.random() < 0.2) possibleSpawners.push("debris");

        for(let spawnerType of possibleSpawners) {
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

        this.currentWave = new Wave(this.waves[0]);
        this.currentWaveNumber++;
    }

    display() {
        super.display();

        if(this.gameOverPanel.isOpen()) {
            fill(0);
            noStroke();
            textSize(30);
            textAlign(CENTER,CENTER);
            text("You reached", W/2, H/2-100);
            textSize(60);
            text("Wave "+this.currentWaveNumber, W/2, H/2-40);
        }

        fill(0);
        noStroke();
        textSize(30);
        textAlign(RIGHT,CENTER);
        text("Wave "+this.currentWaveNumber,W-10,-70+100*this.UIEntranceAnimation);
    }
}