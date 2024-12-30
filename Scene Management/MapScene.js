class MapScene extends Scene {
    constructor() {
        super();
    }

    preload() {
        return Promise.all([loadLevelStructure()]);
    }

    setup() {
        let backButton = createButton("Home", 20, height-70, 100, 50);
        backButton.onPress = () => {nextScene = new MainMenuScene();};
        
        let upgradeButton = createButton("Upgrades", 30,10,100,40);
        upgradeButton.onPress = () => {nextScene = new UpgradeScene();};

        for(let i=0; i<levelStructures.length; i++) {
            let currentLevel = levelStructures[i];

            let button = createButton("", currentLevel.x-25, currentLevel.y-25, 50, 50);
            button.onPress = ()=>{
                nextScene = new StoryScene(i); 
                transition = new FadeTransition();};
            button.visible = currentLevel.unlocked;
            button.setStyle(emptyButtonStyle);
        }
    }

    draw() {
        // Scene Title
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Map', width/2, height/6);

        // Level Paths
        for(let i=1; i<levelStructures.length; i++) {
            let currentLevel = getLevelInfo(i);
            let previousLevel = getLevelInfo(i-1);
            stroke(currentLevel.unlocked ? 100 : 50);
            strokeWeight(5);
            line(previousLevel.x, previousLevel.y, currentLevel.x, currentLevel.y);
        }

        // Level Buttons
        for(let i=0; i<levelStructures.length; i++) {
            let currentLevel = getLevelInfo(i);
            if(currentLevel.completed) fill(0,200,50);
            else fill(currentLevel.unlocked ? 255 : 225);
            stroke(0);
            strokeWeight(2);
            rectMode(CENTER);
            rect(currentLevel.x,currentLevel.y,50,50,8);

            fill(0);
            textSize(30);
            textAlign(CENTER,CENTER);
            text(i+1, currentLevel.x, currentLevel.y);
        }

        // Currency
        fill(0);
        noStroke();
        textSize(24);
        textAlign(CENTER,CENTER);
        text("Total $", width/2, 20);
        textSize(50);
        text(currency, width/2, 55);
    }
}