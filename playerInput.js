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
let doubleClickTime = 200;     // In milliseconds
let keyHoldTime = 500;         // In milliseconds
let keyPressTimes = [];        // Dictionary to store the time each key was pressed

function keyPressed() {
    currentScene.keyPressed();

    // Record this key and the time it was pressed to test for double clicks in the future
    previousKeyTimePressed = millis();
    previousKey = keyCode;
    keyPressTimes.push([previousKey, previousKeyTimePressed]);
}

function keyReleased() {
    currentScene.keyReleased();

    // Remove the key from the list of pressed keys
    for (let i=0; i<keyPressTimes.length; i++) {
        if (keyPressTimes[i][0] == keyCode) {
            keyPressTimes.splice(i,1);
            break;
        }
    }
}

// Returns true if the currently pressed key was also pressed very recently
function isDoubleClick() {
    return keyCode == previousKey && millis() - previousKeyTimePressed < doubleClickTime;
}

// Returns the duration the given key has been held down for in milliseconds
// (Returns null if the key isn't being held down)
function getHeldDownDuration(heldKeyCode) {
    for (let i=0; i<keyPressTimes.length; i++) {
        let duration = millis() - keyPressTimes[i][1];
        if (keyPressTimes[i][0] == heldKeyCode && duration > keyHoldTime) {
            return duration;
        }
    }
    return null;
}