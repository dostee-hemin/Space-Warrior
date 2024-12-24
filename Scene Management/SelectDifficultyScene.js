class SelectDifficultyScene extends Scene {
    constructor() {
        super();
    }

    start() {
        let backButton = createButton("Home", 20, height-70, 100, 50);
        backButton.onPress = () => {nextScene = new MainMenuScene();};

        let easyButton = createButton("Easy", width/2-75, height/2-200, 150, 70);
        easyButton.onPress = () => {
            selectedDifficulty = 0;
            nextScene = new LevelScene();
            transition = new FadeTransition();
        };
        let normalButton = createButton("Normal", width/2-75, height/2-100, 150, 70);
        normalButton.onPress = () => {
            selectedDifficulty = 0.5;
            nextScene = new LevelScene();
            transition = new FadeTransition();
        };
        let hardButton = createButton("Hard", width/2-75, height/2, 150, 70);
        hardButton.onPress = () => {
            selectedDifficulty = 1;
            nextScene = new LevelScene();
            transition = new FadeTransition();
        };
    }

    draw() {
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Select Difficulty', width/2, height/6);
    }
}