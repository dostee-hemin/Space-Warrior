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
        let backButton = createButton("Home", 20, height-70, 100, 50);
        backButton.onPress = () => {nextScene = new MainMenuScene();};

        let easyButton = createButton("Easy", width/2-75, height/2-200, 150, 70);
        easyButton.onPress = () => {
            selectedDifficulty = 0;
            this.switchSceneBasedOnMode();
            
        };
        let normalButton = createButton("Normal", width/2-75, height/2-100, 150, 70);
        normalButton.onPress = () => {
            selectedDifficulty = 0.5;
            this.switchSceneBasedOnMode();
        };
        let hardButton = createButton("Hard", width/2-75, height/2, 150, 70);
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
                nextScene = new EnemeyRushMode();
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
        text('Select Difficulty', width/2, height/6);
    }
}