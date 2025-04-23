import { MyObject } from "./MyObject.js";
import { MySphere } from "./solids/MySphere.js";

export class MyHeli extends MyObject {
    constructor({ scene }) {
        super(scene);

        this.head = new MySphere({
            scene,
            slices: 16,
            stacks: 8,
        });
    }

    render() {
        const headHeight = 1.6 * this.head.radius;

        this.head
            .scale(1, 0.8, 1.5)
            .translate(0, headHeight / 2, 0)
            .display();
    }
}