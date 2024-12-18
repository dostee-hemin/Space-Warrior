let currentScene;
let nextScene;
let transition;

function setup() {
  windowResized();

  currentScene = new MainMenuScene();
}

function draw() {
  background(200);

  currentScene.draw();

  handleSceneSwitching();
}

function switchToNextScene() {
  currentScene.close();
  currentScene = nextScene;
}

function handleSceneSwitching() {
  // If we don't want to change scenes, leave the function
  if (!nextScene) return;
  
  // If we haven't set a transition, simply switch the scenes directly
  if (!transition) {
    switchToNextScene();
    currentScene.start();
    nextScene = null;
    return;
  }
  
  // If the transition is complete, reset all values and begin the new scene
  if (transition.isDone()) {
    currentScene.start();
    nextScene = null;
    transition = null;
    return;
  }

  // Display the transition on top of the sketch
  transition.draw();
}

function windowResized() {
  // Standard dimensions used for pixel art games on various display sizes
  let originalSize = {"w": 360, "h": 640};

  // Calculate the amount to scale each dimension to fill the window
  let heightRatio = windowHeight / originalSize.h;
  let widthRatio = windowWidth / originalSize.w;
  let ratio = Math.min(heightRatio, widthRatio);

  // Scaled dimensions for window
  let newSize = {"w": originalSize.w * ratio, "h": originalSize.h * ratio};

  // If it's the first time running this function, create a new canvas. Otherwise, resize the existing canvas
  frameCount == 0 ? createCanvas(newSize.w, newSize.h) : resizeCanvas(newSize.w, newSize.h);
}

// Alternates between scenes when clicking the mouse
function mousePressed() {
  if (currentScene instanceof MainMenuScene) nextSceneClass = new AchievementScene();
  else {
    nextSceneClass = new MainMenuScene();
    transition = new FadeTransition();
  }
}
