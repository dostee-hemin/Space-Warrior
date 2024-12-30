class UpgradeScene extends Scene {
    constructor() {
        super();

        this.upgradeButtons = [];
    }

    preload() {
        return Promise.all([loadUpgradeInfo()]);
    }

    setup() {
        let backButton = createButton("Back", 20, height-70, 100, 50);
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
            
            let improveButton = createButton("",0,0, 100, 30);
            improveButton.onPress = ()=>{
                let cost = upgrade.prices.toImprove[upgrade.currentLevel];
                if(currency < cost) return;

                currency -= cost;
                upgrade.currentLevel++;
            };

            this.upgradeButtons.push({
                "unlock": unlockButton,
                "improve": improveButton
            });
        }
    }

    draw() {
        // Currency
        fill(0);
        noStroke();
        textSize(24);
        textAlign(CENTER,CENTER);
        text("Total $", width/2, 20);
        textSize(50);
        text(currency, width/2, 55);

        for(let i=0; i<upgradeInfo.length; i++) {
            let upgrade = upgradeInfo[i];

            // Calculate the center position of the upgrade icon
            let x = width*(0.3+i%2*0.4);
            let y = 200 + int(i/2)*250;

            // Set the positions of the upgrade buttons accordingly
            let unlockButton = this.upgradeButtons[i].unlock;
            let improveButton = this.upgradeButtons[i].improve;
            unlockButton.x = x-50;
            unlockButton.y = y-50;
            improveButton.x = x-50;
            improveButton.y = y-90;

            // Only show the improveButton if the upgrade is unlocked and not maxed out
            if(upgrade.unlocked) {
                unlockButton.visible = false;
                improveButton.visible = upgrade.currentLevel != upgrade.maxLevel;
                improveButton.label = "$"+upgrade.prices.toImprove[upgrade.currentLevel];
            } 
            // Only show the unlockButton if the upgrade has not been unlocked yet
            else {
                unlockButton.visible = true;
                improveButton.visible = false;
            }
            
            // Icon
            imageMode(CENTER);
            noTint();
            image(upgrade.icon, x,y,100,100);

            // Upgrade Name
            fill(0);
            noStroke();
            textSize(20);
            textAlign(CENTER,CENTER);
            text(upgrade.name, x,y+80);

            // Black tint when locked
            if(!upgrade.unlocked) {
                fill(0,200);
                noStroke();
                rectMode(CENTER);
                rect(x,y,100,100);
                continue;
            }
            
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
    }
}