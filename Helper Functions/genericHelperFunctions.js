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