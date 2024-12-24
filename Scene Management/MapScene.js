class MapScene extends Scene {
    constructor() {
        super();
    }

    start() {
        let backButton = createButton("Home", 20, height-70, 100, 50);
        backButton.onPress = () => {nextScene = new MainMenuScene();};
    }

    draw() {
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Map', width/2, height/6);
    }
}