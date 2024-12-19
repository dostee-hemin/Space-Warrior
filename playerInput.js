function mousePressed() {
    if (mouseButton != RIGHT) return;

    // Alternates between scenes when clicking the mouse
    if (currentScene instanceof MainMenuScene) nextScene = new AchievementScene();
    else {
        nextScene = new MainMenuScene();
        transition = new FadeTransition();
    }
}

let previousKey;
let previousKeyTimePressed;    // In milliseconds
let doubleClickTime = 300;     // In milliseconds

function keyPressed() {
    currentScene.keyPressed();

    // Record this key and the time it was pressed to test for double clicks in the future
    previousKeyTimePressed = millis();
    previousKey = keyCode;
}

function keyReleased() {
    currentScene.keyReleased();
}

// Returns true if the currently pressed key was also pressed very recently
function isDoubleClick() {
    return keyCode == previousKey && millis() - previousKeyTimePressed < doubleClickTime;
}