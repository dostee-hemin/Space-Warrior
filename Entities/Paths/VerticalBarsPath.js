class VerticalBarsPath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath() {
        let x = 50;
        let barGap = 25;
        let downwards = true;
        let direction = 1;
        do{
            if(downwards) {
                this.points.push(createVector(x,50));
                this.points.push(createVector(x,150));
            } else {
                this.points.push(createVector(x,150));
                this.points.push(createVector(x,50));
            }
            downwards = !downwards;
    
            if (x >= W-50-barGap) direction *= -1;

            x += direction * barGap;
        } while (x >= 50+barGap);
        return this.points;
    }
}