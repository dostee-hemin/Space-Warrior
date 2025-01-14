class VerticalBarsPath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath(startsAtLeft=true) {
        let x = startsAtLeft ? 50 : W-50;
        let barGap = 25;
        let numBars = (W-100)/barGap;
        let downwards = true;
        let direction = startsAtLeft ? 1 : -1;
        for(let i=0; i<numBars; i++) {
            if(downwards) {
                this.points.push(createVector(x,50));
                this.points.push(createVector(x,150));
            } else {
                this.points.push(createVector(x,150));
                this.points.push(createVector(x,50));
            }
            downwards = !downwards;
    
            if (x > W-50 || x < 50) {
                direction *= -1;
                x += direction * barGap;
            }

            x += direction * barGap;
        }
        return this.points;
    }
}