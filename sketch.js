let currentScene;
let nextScene;
let transition;
let achievementManager;
let selectedDifficulty = 0;
let currency = 0;
let gui;
let prevGUIObjects = [];
let emptyButtonStyle;
let prevRes = 1;
let res = 1;
let W = 518.625;
let H = 914;


function setup() {
  gui = createGui();
  windowResized();

  achievementManager = new AchievementManager();

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
  scale(res);
  background(200);
  
  currentScene.draw();
  
  // GUI needs to be drawn with no transformations
  push();
  scale(1/res);
  drawGui();
  pop();
  
  achievementManager.displayNotification();
  handleSceneSwitching();
}

function switchToNextScene() {
  gui.objects = [];
  currentScene.close();
  currentScene = nextScene;
  currentScene.setup();
  nextScene = null;

  // Adjust newly created GUI objects
  prevRes = 1;
  if(!arraysAreEqual(gui.objects, prevGUIObjects)) {
    scaleUI();
    prevGUIObjects = gui.objects;
  }
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
  // Calculate the amount to scale each dimension to fill the window
  let heightRatio = windowHeight / H;
  let widthRatio = windowWidth / W;
  let ratio = Math.min(heightRatio, widthRatio);

  // Scaled dimensions for window
  let newSize = {"w": W * ratio, "h": H * ratio};

  // If it's the first time running this function, create a new canvas. Otherwise, resize the existing canvas
  frameCount == 0 ? createCanvas(newSize.w, newSize.h) : resizeCanvas(newSize.w, newSize.h);

  // Update the resolution values and scale the GUI objects accordingly
  prevRes = res;
  res = heightRatio;
  scaleUI();
}

function resetGameData() {
  currency = 0;
  levelStructures = null;
  upgradeInfo = null;
  armorInfo = null;
}

function scaleUI() {
  for(let object of gui.objects) {
    object.x *= res/prevRes;
    object.y *= res/prevRes;
    object.w *= res/prevRes;
    object.h *= res/prevRes;
    object._style.textSize *= res/prevRes;
    object._style.strokeWeight *= res/prevRes;
    object._style.rounding *= res/prevRes;
  }
}