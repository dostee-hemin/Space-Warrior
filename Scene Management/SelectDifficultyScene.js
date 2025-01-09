class SelectDifficultyScene extends Scene {
    constructor(mode) {
        super();

        this.levelInfo = null;
        this.mode = mode;
    }

    preload() {
        return Promise.all([loadLevelStructure()]);
    }

    setup() {
        let backButton = createButton("Home", 20, H-70, 100, 50);
        backButton.onPress = () => {nextScene = new MainMenuScene();};

        let easyButton = createButton("Easy", W/2-75, H/2-200, 150, 70);
        easyButton.onPress = () => {
            selectedDifficulty = 0;
            this.switchSceneBasedOnMode();
            
        };
        let normalButton = createButton("Normal", W/2-75, H/2-100, 150, 70);
        normalButton.onPress = () => {
            selectedDifficulty = 0.5;
            this.switchSceneBasedOnMode();
        };
        let hardButton = createButton("Hard", W/2-75, H/2, 150, 70);
        hardButton.onPress = () => {
            selectedDifficulty = 1;
            this.switchSceneBasedOnMode();
        };
    }

    switchSceneBasedOnMode() {
        switch(this.mode) {
            case 'newGame':
                resetGameData();
                nextScene = new StoryScene(0);
                transition = new FadeTransition();
                break;
            case 'enemyRush':
                nextScene = new EnemyRushMode();
                transition = new FadeTransition();
                break;
            case 'survival':
                nextScene = new SurvivalMode();
                transition = new FadeTransition();
                break;
        }
    }

    draw() {
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Select Difficulty', W/2, H/6);
    }
}