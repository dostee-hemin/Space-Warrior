const DATA_FOLDER_PATH = "./Data/"
let levelStructures;
let upgradeInfo;
let storyInfo;
let armorInfo;
let achievementInfo;

function loadLevelStructure() {
    if(isLevelInfoLoaded()) return Promise.resolve();

    const promise = new Promise((resolve) => {
        loadJSON(DATA_FOLDER_PATH+"levelStructures.json", (loadedData) => {
            levelStructures = Object.values(loadedData);
            for(let i=0; i<levelStructures.length; i++) {
                let x = Math.sin(2.36*i) * W*0.3 + W/2;
                let y = 200 + i*100;

                levelStructures[i].levelNumber = i;
                levelStructures[i].x = x;
                levelStructures[i].y = y;
                levelStructures[i].unlocked = i==0;
                levelStructures[i].completed = false;
                levelStructures[i].numArmorCollected = 0;
            }
            resolve();
        });
    });

    return promise;
}

function loadUpgradeInfo() {
    if(upgradeInfo != null) return Promise.resolve();

    const promise = new Promise((resolve) => {
        loadJSON(DATA_FOLDER_PATH+"upgradeInfo.json", (loadedData) => {
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
        loadJSON(DATA_FOLDER_PATH+"storyInfo.json", (loadedData) => {
            storyInfo = Object.values(loadedData);
            resolve();
        });
    });

    return promise;
}

function loadArmorInfo() {
    if(armorInfo != null) return Promise.resolve();

    const promise = new Promise((resolve) => {
        loadJSON(DATA_FOLDER_PATH+"armorInfo.json", (loadedData) => {
            armorInfo = Object.values(loadedData);
            for(let i=0; i<armorInfo.length; i++) {
                armorInfo[i].equipped = false;
                armorInfo[i].numPieces = 0;
                for (let j = 0; j < armorInfo[i].pieces.length; j++) {
                    armorInfo[i].pieces[j].icon = loadImage("./Assets/Images/"+armorInfo[i].pieces[j].iconPath);
                    armorInfo[i].pieces[j].unlocked = false;
                }
            }
            resolve();
        });
    });

    return promise;
}

function loadAchievementInfo() {
    if(achievementInfo != null) return Promise.resolve();

    const promise = new Promise((resolve) => {
        loadJSON(DATA_FOLDER_PATH+"achievementInfo.json", (loadedData) => {
            achievementInfo = Object.values(loadedData);
            for(let i=0; i<achievementInfo.length; i++) {
                achievementInfo[i].unlocked = false;
                achievementInfo[i].icon = loadImage("./Assets/Images/test_icon.png");
            }
            resolve();
        });
    });

    return promise;
}