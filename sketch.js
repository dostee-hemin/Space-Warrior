function setup() {
  windowResized();
}

function draw() {
  background(200);
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
  let canvas = frameCount == 0 ? createCanvas(newSize.w, newSize.h) : resizeCanvas(newSize.w, newSize.h);
  canvas.parent('canvasContainer');
}
