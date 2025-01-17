class UpgradeScene extends Scene {
    constructor() {
        super();

        this.upgradeButtons = [];
    }

    preload() {
        return Promise.all([loadUpgradeInfo()]);
    }

    setup() {
        let backButton = createButton("Back", 20, H-70, 100, 50);
        backButton.onPress = () => {nextScene = new MapScene();};

        for(let i=0; i<upgradeInfo.length; i++) {
            let upgrade = upgradeInfo[i];

            let unlockButton = createButton("$"+upgrade.prices.toUnlock, 0,0, 100, 100);
            unlockButton.setStyle(emptyButtonStyle);
            unlockButton.setStyle({
                textSize: 30,
                fillLabel: color(255),
                fillLabelHover: color(225),
                fillLabelActive: color(200)
            })
            unlockButton.onPress = ()=>{
                let cost = upgrade.prices.toUnlock;
                if(currency < cost) return;

                currency -= cost;
                upgrade.unlocked = true
            };
            
            let improveButton = createButton("",0,0, 80, 30);
            improveButton.onPress = ()=>{
                let cost = upgrade.prices.toImprove[upgrade.currentLevel];
                if(currency < cost) return;

                currency -= cost;
                upgrade.currentLevel++;

                // Check to see if achievement is unlocked
                let allWeaponsMaxedOut = true;
                for(let j=0; j<upgradeInfo.length; j++) {
                    if(!upgradeInfo[j].type.includes("weapon")) continue;
                    if(upgradeInfo[j].currentLevel != upgradeInfo[j].maxLevel) allWeaponsMaxedOut = false;
                }
                if(allWeaponsMaxedOut) achievementManager.unlock(AchievementManager.MAX_OUT_ALL_WEAPONS)
            };

            let equipButton = createButton("Equip",0,0,80,25);
            equipButton.setStyle("textSize", 14);
            equipButton.onPress = ()=>{
                if(!upgrade.isEquipable || upgrade.equipped) return;

                for(let j=0; j<upgradeInfo.length; j++) {
                    if(upgradeInfo[j].type == upgrade.type) {
                        upgradeInfo[j].equipped = false;
                    }
                }

                upgrade.equipped = true;
            };

            this.upgradeButtons.push({
                "unlock": unlockButton,
                "improve": improveButton,
                "equip": equipButton
            });
        }
    }

    draw() {
        // Currency
        fill(0);
        noStroke();
        textSize(24);
        textAlign(CENTER,CENTER);
        text("Total $", W-100, 20);
        textSize(50);
        text(currency, W-100, 55);

        let x = W*0.15;
        let y = 180;
        let prevType = upgradeInfo[0].type;

        for(let i=0; i<upgradeInfo.length; i++) {
            let upgrade = upgradeInfo[i];

            if(prevType != upgrade.type && !upgrade.type.includes("weapon")) {
                y += 280;
                x = W*0.15;
            }

            // Set the positions of the upgrade buttons accordingly
            let unlockButton = this.upgradeButtons[i].unlock;
            let improveButton = this.upgradeButtons[i].improve;
            let equipButton = this.upgradeButtons[i].equip;
            unlockButton.x = (x-50) * res;
            unlockButton.y = (y-50) * res;
            improveButton.x = (x-40) * res;
            improveButton.y = (y-90) * res;
            equipButton.x = (x-40) * res;
            equipButton.y = (y+90) * res;

            // Only show the improveButton if the upgrade is unlocked and not maxed out
            if(upgrade.unlocked) {
                unlockButton.visible = false;
                improveButton.visible = upgrade.currentLevel != upgrade.maxLevel;
                equipButton.visible = upgrade.isEquipable && !upgrade.equipped;
                improveButton.label = "$"+upgrade.prices.toImprove[upgrade.currentLevel];
            } 
            // Only show the unlockButton if the upgrade has not been unlocked yet
            else {
                unlockButton.visible = true;
                improveButton.visible = false;
                equipButton.visible = false;
            }

            // Yellow highlight when equipped
            if(upgrade.equipped) {
                fill(200,200,0,150);
                noStroke();
                rectMode(CENTER);
                rect(x,y+32,110,175);
            }
            
            // Icon
            imageMode(CENTER);
            noTint();
            image(upgrade.icon, x,y,100,100);

            // Upgrade Name
            fill(0);
            noStroke();
            textSize(16);
            textAlign(CENTER,CENTER);
            text(upgrade.name, x,y+80);

            // Black tint when locked
            if(!upgrade.unlocked) {
                fill(0,200);
                noStroke();
                rectMode(CENTER);
                rect(x,y,100,100);
            } else {
                // Level indicators
                for(let j=0; j<upgrade.maxLevel; j++) {
                    let x2 = x-50+j%5*20+10;
                    let y2 = y+50+int(j/5)*10+5;

                    stroke(0);
                    strokeWeight(2);
                    if(j < upgrade.currentLevel) {
                        // Gold if fully upgraded, red if partially upgraded
                        if(upgrade.currentLevel == upgrade.maxLevel) fill(255,255,0);
                        else fill(255,0,0);
                    }
                    else fill(0);
                    rectMode(CENTER);
                    rect(x2,y2,16,6);
                }
            }

            x += W*0.233;
            prevType = upgrade.type;
        }

        fill(0);
        noStroke();
        textSize(40);
        textAlign(LEFT,CENTER);
        text("Weapons", 20, 65);
        text("Abilities", 20, 345);
        text("Stats", 20, 625);
    }
}