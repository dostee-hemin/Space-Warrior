function isLevelInfoLoaded() {
    return levelStructures != null;
}

function hasCompletedFirstLevel() {
    if(!isLevelInfoLoaded()) return false;

    return levelStructures[1].unlocked;
}

function hasCompletedAllLevels() {
    if(!isLevelInfoLoaded()) return false;

    return levelStructures[levelStructures.length-1].completed;
}

function completeLevel(levelNumber) {
    levelStructures[levelNumber].completed = true;
}

function unlockLevel(levelNumber) {
    if(levelNumber != levelStructures.length) levelStructures[levelNumber].unlocked = true;
}

function getLevelInfo(levelNumber) {
    return levelStructures[levelNumber];
}