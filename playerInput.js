function mousePressed() {
    if (mouseButton != RIGHT) return;

    // Alternates between scenes when clicking the mouse
    if (currentScene instanceof MainMenuScene) nextScene = new AchievementScene();
    else {
        nextScene = new MainMenuScene();
        transition = new FadeTransition();
    }
}

function keyPressed() {
    currentScene.keyPressed();
}

function keyReleased() {
    currentScene.keyReleased();
}