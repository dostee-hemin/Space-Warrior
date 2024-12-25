class MainMenuScene extends Scene {
    constructor() {
        super();
    }

    start() {
        let y = height/2-100;

        if(hasCompletedFirstLevel()) {
            let continueButton = createButton("Continue Game", width/2-100, y, 200,70);
            continueButton.onPress = () => {nextScene = new MapScene();};
            y+=100;
        }
        let newGameButton = createButton("New Game", width/2-100, y,200,70);
        newGameButton.onPress = () => {nextScene = new SelectDifficultyScene('newGame');};
        y+=100;
        let survivalButton = createButton("Survival", width/2-100, y,200,70);
        y+=100;
        let enemyRushButton = createButton("Enemy Rush", width/2-100, y,200,70);
        y+=100;
        let achievementsButton = createButton("Achievements", width/2-100, y,200,70);
        achievementsButton.onPress = () => {nextScene = new AchievementScene();};

        if(!hasCompletedAllLevels()) {
            survivalButton.enabled = false;
            enemyRushButton.enabled = false;
        }
    }

    draw() {
        // Simply draws the title as the "Main Menu"
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Main Menu', width/2, height/6);
    }
}