const typeToTime = {
    'small': 300,
    'medium': 500,
    'large': 1000
}

const typeToClass = {
    'small': SmallTroop,
    'medium': MediumTroop,
    'large': LargeTroop
}

const pathToClass = {
    'XP': XPath,
    'HBP': HorizontalBarsPath,
    'HLP': HorizontalLinePath,
    'VBP': VerticalBarsPath,
    'RP': RandomPath
}

class Wave {
    constructor(waveStructure) {
        this.waitDuration = 2000;    // In milliseconds
        this.shipEntranceDuration = 2000;    // In milliseconds
        this.shipExitDuration = 2000;    // In milliseconds
        this.startTime = millis();
        
        this.battleshipAnimation = 0;       
        this.waveStructure = waveStructure;
        this.hasSpawnedTroops = false;

        // Used to calculate how long it takes to release all troops
        let maxTroopTime = 0;
        for(let troop of waveStructure.troops) {
            if(troop.type == "boss") {
                new Boss();
                this.battleshipAnimation = 1;
                return;
            }
            let troopTime = troop.amount * typeToTime[troop.type] + 300;
            maxTroopTime = Math.max(maxTroopTime, troopTime);
        }

        this.tween = p5.tween.manager.addTween(this)
            .addMotion('battleshipAnimation', 0, waveStructure.waitDuration)
            .addMotion('battleshipAnimation', 0.5, 2000, 'easeOutQuad')
            .addMotion('battleshipAnimation', 0.5, maxTroopTime)
            .addMotion('battleshipAnimation', 1, 2000, 'easeInQuad')
            .startTween()
    }

    pause() {
        this.tween.pause();
    }

    resume() {
        this.tween.resume();
    }

    hasReleasedTroops() {
        return this.battleshipAnimation == 1;
    }

    draw() {
        push();
        translate(W*(-1+3*this.battleshipAnimation), 0);
        rotate(-HALF_PI+this.battleshipAnimation*PI);
        fill(255);
        stroke(0);
        strokeWeight(5);
        rectMode(CENTER);
        rect(0, 0, W*1.4, 100);
        fill(0);
        noStroke();
        rect(0,0,W*0.8,100);
        pop();


        if(!this.hasSpawnedTroops && this.battleshipAnimation == 0.5) {
            for(let troop of this.waveStructure.troops) {
                if(troop.type == "boss") continue;
                let number = troop.amount;
                let type = typeToClass[troop.type];
                let path = pathToClass[troop.path];
                new TroopGroup(number, type, path);
            }
            this.hasSpawnedTroops = true;
        }
    }
}