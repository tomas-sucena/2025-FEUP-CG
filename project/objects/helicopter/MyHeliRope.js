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
            radiusX: radius,
            radiusY: (0.6 * length) / this.knots,
            radiusZ: radius,
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
        const deltaY = this.length / this.knots;

        for (let knot = 0; knot < this.knots; ++knot) {
            const y = this.knot.radiusY + knot * deltaY;
            this.knot.translate(0, y, 0).display();
        }
    }
}
