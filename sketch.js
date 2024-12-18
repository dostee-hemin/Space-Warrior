let currentScene;
let nextScene;

function setup() {
  windowResized();

  currentScene = new MainMenuScene();
}

function draw() {
  background(200);

  // Switch scenes if the next one is selected
  if(nextScene) {
    currentScene = nextScene;
    nextScene = null;
  }

  currentScene.draw();
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
  if (currentScene instanceof MainMenuScene) nextScene = new AchievementScene();
  else nextScene = new MainMenuScene();
}
