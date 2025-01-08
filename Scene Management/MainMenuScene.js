class MainMenuScene extends Scene {
    constructor() {
        super();
    }

    preload() {
        return Promise.all([loadLevelStructure()]);
    }

    setup() {
        let y = H/2-100;

        if(hasCompletedFirstLevel()) {
            let continueButton = createButton("Continue Game", W/2-100, y, 200,70);
            continueButton.onPress = () => {nextScene = new MapScene();};
            y+=100;
        }
        let newGameButton = createButton("New Game", W/2-125, y,250,70);
        newGameButton.onPress = () => {nextScene = new SelectDifficultyScene('newGame');};
        y+=100;
        let survivalButton = createButton("Survival", W/2-125, y,250,70);
        survivalButton.onPress = () => {nextScene = new SelectDifficultyScene('survival');};
        y+=100;
        let enemyRushButton = createButton("Enemy Rush", W/2-125, y,250,70);
        enemyRushButton.onPress = () => {nextScene = new SelectDifficultyScene('enemyRush');};
        y+=100;
        let achievementsButton = createButton("Achievements", W/2-125, y,250,70);
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
        text('Main Menu', W/2, H/6);
    }
}