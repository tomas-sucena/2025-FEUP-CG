import { MyObject } from '../MyObject.js';
import { MyEllipsoid } from '../solids/MyEllipsoid.js';

export class MyHeliRope extends MyObject {
    constructor({ scene, radius, length, knots, color }) {
        super(scene);

        /** The length of the rope */
        this.length = length;

        /** The number of knots that constitute the rope */
        this.knots = knots ?? 2 * length;

        /** A knot of the rope */
        this.knot = new MyEllipsoid({
            scene,
            width: 2 * radius,
            height: 1.2 * (length / this.knots),
            depth: 2 * radius,
            slices: 16,
            stacks: 8,
            material: {
                ambient: color,
                diffuse: color,
            },
        });
    }

    /**
     * Displays the rope's geometry.
     */
    render() {
        const halfKnotHeight = this.knot.height / 2;
        const deltaY = this.length / this.knots;

        for (let knot = 0; knot < this.knots; ++knot) {
            const y = halfKnotHeight + knot * deltaY;
            this.knot.translate(0, y, 0).display();
        }
    }
}
