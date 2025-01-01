class ArmorStationScene extends Scene {
    constructor() {
        super();

        this.equipButtons = [];
    }

    preload() {
        return Promise.all([loadArmorInfo()]);
    }

    setup() {
        let backButton = createButton("Back", 20, height-70, 100, 50);
        backButton.onPress = () => {nextScene = new MapScene();};

        for(let i=0; i<armorInfo.length; i++) {
            let armor = armorInfo[i];

            let equipButton = createButton("Equip", 0,0, 80, 30);
            equipButton.onPress = ()=>{
                if(armor.equipped) {
                    armor.equipped = false;
                    return;
                }

                for(let j=0; j<armorInfo.length; j++) {
                    armorInfo[j].equipped = false;
                }

                armor.equipped = true;
            };

            this.equipButtons.push(equipButton);
        }
    }

    draw() {
        // Scene title
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text('Armor Station', width/2, height/6);

        for(let i=0; i<armorInfo.length; i++) {
            let armor = armorInfo[i];
            let equipButton = this.equipButtons[i];

            let x = 20;
            let y = height/6 + 100 + i*230;

            equipButton.x = x;
            equipButton.y = y+20;
            equipButton.label = armor.equipped ? "Unequip" : "Equip";

            // Armor set panel
            if(armor.equipped) {
                fill(200,200,0,100);
                stroke(200,200,0,150);
            } else {
                fill(210);
                stroke(190);
            }
            strokeWeight(3);
            rectMode(CENTER);
            rect(width/2, y+40, width-20, 200, 8);

            
            // Title and description
            fill(0);
            noStroke();
            textSize(20);
            textAlign(LEFT, CENTER);
            text(armor.setName, x, y - 40);
            rectMode(CORNER);
            text("Full Set Buff: "+armor.description, x, y+100, width-20);

            

            let totalShieldAmount = 0;
            for(let j=0; j<armor.pieces.length; j++) {
                let piece = armor.pieces[j];

                let x2 = x + j*100 + 200;
                let y2 = y;

                // Empty spot when piece is not unlocked
                if(!piece.unlocked) {
                    fill(0);
                    rectMode(CENTER);
                    noStroke();
                    rect(x2, y2, 70, 70);
                    continue;
                }
                // Piece icon
                imageMode(CENTER);
                noStroke();
                noTint();
                image(piece.icon, x2, y2, 70, 70);

                // Piece stats
                fill(0);
                noStroke();
                textSize(30);
                textAlign(CENTER, CENTER);
                text("+"+piece.shieldAmount, x2, y2 + 60);
                totalShieldAmount += piece.shieldAmount;
            }

            // The player can only equip a set if it has at least one piece unlocked
            equipButton.visible = totalShieldAmount != 0;
            
            // The total strength of the shield made up of all the armor pieces
            if(totalShieldAmount != 0) {
                fill(0);
                noStroke();
                textSize(30);
                textAlign(LEFT, CENTER);
                text("+"+totalShieldAmount, x+20, y);
            }
        }
    }
}