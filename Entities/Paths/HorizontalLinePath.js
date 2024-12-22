class HorizontalLinePath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath() {
        this.points.push(createVector(50,20));
        this.points.push(createVector(width-50,20));
        return this.points;
    }
}