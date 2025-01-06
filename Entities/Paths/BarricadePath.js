class BarricadePath extends PathGenerator {
    constructor() {
        super();
    }

    generatePath() {
        let dir = p5.Vector.fromAngle(HALF_PI+PI/3).mult(width*0.6);
        for(let i=0; i<36; i++) {
            let x = dir.x + width/2;
            let y = dir.y + 200;
            this.points.push(createVector(x,y));

            dir.rotate(-TWO_PI/36);
        }
        return this.points;
    }
}