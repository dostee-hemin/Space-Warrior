let currentScene;
let nextScene;
let transition;
let selectedDifficulty = 0;
let currency = 120;
let levelStructures;
let storyInfo;
let gui;
let emptyButtonStyle;

function setup() {
  windowResized();

  gui = createGui();

  emptyButtonStyle = {
    fillBg: color(0,0),
    fillBgHover: color(0,50),
    fillBgActive: color(0,100),
    strokeWeight: 0
  };

  nextScene = new MainMenuScene();
  currentScene = new Scene();
}

function draw() {
  background(200);

  currentScene.draw();
  
  drawGui();
  
  handleSceneSwitching();
}

function switchToNextScene() {
  gui.objects = [];
  currentScene.close();
  currentScene = nextScene;
  currentScene.setup();
  nextScene = null;
}

function handleSceneSwitching() {
  // If we don't want to change scenes, leave the function
  if (!nextScene && !transition) return;
  
  // If we haven't set a transition, simply switch the scenes directly
  if (!transition) {
    if(nextScene.preloadComplete) {
      switchToNextScene();
      currentScene.start()
    }
    return;
  }
  
  // If the transition is complete, reset all values and begin the new scene
  if (transition.isDone()) {
    currentScene.start();
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

// Function to return the distance sqaured between two x and y points
function distSq(x1, y1, x2, y2) {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

// Function to return the distance sqaured between two vectors
function distSqVector(v1, v2) {
  return distSq(v1.x, v1.y, v2.x, v2.y);
}

// Function to return true if a point is in a rectangle (the rectangle has a center x y and a width and height)
function pointInRect(pointX, pointY, rectX, rectY, rectWidth, rectHeight) {
  return pointX > rectX - rectWidth / 2 &&
         pointX < rectX + rectWidth / 2 &&
         pointY > rectY - rectHeight / 2 &&
         pointY < rectY + rectHeight / 2;
}