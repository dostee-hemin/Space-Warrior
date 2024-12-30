class UpgradeScene extends Scene {
    constructor() {
        super();
    }

    setup() {
        let backButton = createButton("Back", 20, height-70, 100, 50);
        backButton.onPress = () => {nextScene = new MapScene();};
    }

    draw() {
        // Scene Title
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Upgrade', width/2, height/6);

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