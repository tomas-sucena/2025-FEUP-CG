import { MyObject } from "./MyObject.js";

export class MyPanorama extends MyObject {
    constructor(scene, config) {
        config.invert ??= true;
        super(scene, config);

        this.box = new config.box(scene, config);
        this.scaleFactor = config.scale;
        //this.position = config.position;
    }

    render() {
        this.box.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor)
            //.translate(...position)
            .display();
    }
}