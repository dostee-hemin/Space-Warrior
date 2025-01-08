class AchievementScene extends Scene {
    constructor() {
        super();
    }

    setup() {
        let backButton = createButton("Home", 20, H-70, 100, 50);
        backButton.onPress = () => {nextScene = new MainMenuScene();};
    }

    preload() {
        return Promise.all([loadAchievementInfo()]);
    }

    draw() {
        // Simply draws the title as the "Achievements"
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Achievements', W/2, H/6);

        // Loop through all the achievements and display them vertically on the left, with their name and description shown on the right of the achievement icon, and the icon is either locked or unlocked
        for(let i=0; i<achievementInfo.length; i++) {
            let x = W/4;
            let y = H/4 + i*100;
            let achievement = achievementInfo[i];

            // Draw the achievement icon
            if(achievement.unlocked) {
                noTint();
                imageMode(CENTER);
                image(achievement.icon, x, y, 80, 80);
            } else {
                fill(100);
                stroke(100);
                strokeWeight(4);
                rectMode(CENTER);
                rect(x, y, 80, 80, 10);
            }
            fill(0);
            noStroke();
            textSize(20);
            textAlign(LEFT, CENTER);
            text(achievement.name, x+50, y-25);
            
            // Draw the achievement description
            fill(0);
            noStroke();
            textSize(16);
            textAlign(LEFT, TOP);
            rectMode(CORNER);
            text(achievement.description, x+50, y-15, W-x-50);
        }
    }
}