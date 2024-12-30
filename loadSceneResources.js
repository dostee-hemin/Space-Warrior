function loadLevelStructure() {
    if(isLevelInfoLoaded()) return Promise.resolve();

    const promise = new Promise((resolve) => {
        loadJSON("./Levels/levelStructures.json", (loadedData) => {
            levelStructures = Object.values(loadedData);
            for(let i=0; i<levelStructures.length; i++) {
                let x = Math.sin(2.36*i) * width*0.3 + width/2;
                let y = 200 + i*100;

                levelStructures[i].levelNumber = i;
                levelStructures[i].x = x;
                levelStructures[i].y = y;
                levelStructures[i].unlocked = i==0;
                levelStructures[i].completed = false;
            }
            resolve();
        });
    });

    return promise;
}

function loadUpgradeInfo() {
    if(upgradeInfo != null) return Promise.resolve();

    const promise = new Promise((resolve) => {
        loadJSON("./Upgrades/upgradeInfo.json", (loadedData) => {
            upgradeInfo = Object.values(loadedData);
            for(let i=0; i<upgradeInfo.length; i++) {
                upgradeInfo[i].currentLevel = 0;
                upgradeInfo[i].maxLevel = upgradeInfo[i].prices.toImprove.length;
                upgradeInfo[i].icon = loadImage("./Assets/Images/"+upgradeInfo[i].iconPath);
                upgradeInfo[i].isEquipable = upgradeInfo[i].type != "stat";
            }
            resolve();
        });
    });

    return promise;
}

function loadStoryInfo() {
    if(storyInfo != null) return Promise.resolve();

    const promise = new Promise((resolve) => {
        loadJSON("./Stories/storyInfo.json", (loadedData) => {
            storyInfo = Object.values(loadedData);
            resolve();
        });
    });

    return promise;
}