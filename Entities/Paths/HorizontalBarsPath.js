class HorizontalBarsPath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath() {
        let y = 40;
        let barGap = 25;
        let right = true;
        let direction = 1;
        do{
            if(right) {
                this.points.push(createVector(50,y));
                this.points.push(createVector(W-50,y));
            } else {
                this.points.push(createVector(W-50,y));
                this.points.push(createVector(50,y));
            }
            right = !right;
    
            if (y >= 150-barGap) direction *= -1;

            y += direction * barGap;
        } while (y >= 20+barGap);
        return this.points;
    }
}