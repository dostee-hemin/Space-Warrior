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

function hitboxesCollide(x1, y1, hitbox1, x2, y2, hitbox2) {
    switch(hitbox1.type) {
        // For circles
        case 'circle':
            switch(hitbox2.type) {
                case 'circle':
                    return distSq(x1, y1, x2, y2) < (hitbox1.r + hitbox2.r) ** 2;
                case 'rect':
                    let closestX = constrain(x1, x2 - hitbox2.w / 2, x2 + hitbox2.w / 2);
                    let closestY = constrain(y1, y2 - hitbox2.h / 2, y2 + hitbox2.h / 2);
                    return distSq(x1, y1, closestX, closestY) < hitbox1.r ** 2;
                case 'point':
                    return hitboxesCollide(x2, y2, hitbox2, x1, y1, hitbox1);
            }
            break;
        // For rectangles
        case 'rect':
            switch(hitbox2.type) {
                case 'circle':
                    return hitboxesCollide(x2, y2, hitbox2, x1, y1, hitbox1);
                case 'rect':
                    return Math.abs(x1 - x2) < hitbox1.w/2 + hitbox2.w/2 && Math.abs(y1 - y2) < hitbox1.h/2 + hitbox2.h/2;
                case 'point':
                    return hitboxesCollide(x2, y2, hitbox2, x1, y1, hitbox1);
            }
            break;
        
        // For points that don't have a hitbox
        case 'point':
            switch(hitbox2.type) {
                case 'circle':
                    return distSq(x1, y1, x2, y2) < hitbox2.r ** 2;
                case 'rect':
                    return pointInRect(x1,y1,x2,y2,hitbox2.w,hitbox2.h);
            }
            break;
    }
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Get a random element from a list and remove it from the list
function popRandomElement(arr) {
    let chosenIndex = Math.floor(Math.random() * arr.length);
    let chosenElement = arr[chosenIndex];
    arr.splice(chosenIndex,1);
    return chosenElement;
}