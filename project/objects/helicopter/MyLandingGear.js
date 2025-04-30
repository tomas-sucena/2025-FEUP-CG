import { MyBox } from "../solids/MyBox.js";
import { MyObject } from "../MyObject.js";


export class MyLandingGear extends MyObject {
    constructor({ scene, width, height, distance }) {
        super(scene);

        /** The width of each landing skid  */
        this.skid = new MyBox({
            scene,
            width,
            height: 0.05 * width,
            depth: 0.05 * width,
        });
    }
}
