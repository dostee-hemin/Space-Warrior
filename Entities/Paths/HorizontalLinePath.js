class HorizontalLinePath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath(startsAtLeft = true) {
        let a = createVector(50,40);
        let b = createVector(W-50,40);
        if(startsAtLeft) {
            this.points.push(a);
            this.points.push(b);
        } else {
            this.points.push(b);
            this.points.push(a);
        }
        return this.points;
    }
}