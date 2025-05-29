import { MyObject } from '../MyObject.js';
import { MyEllipsoid } from '../solids/MyEllipsoid.js';

export class MyHeliRope extends MyObject {
    constructor({ scene, radius = 0.1, length = 8, segments = 15, colors }) {
        super(scene);

        this.length = length;
        this.segments = Math.max(length, segments);

        /** A knot of the rope */
        this.knot = new MyEllipsoid({
            scene,
            radiusX: radius,
            radiusY: (0.6 * length) / segments,
            radiusZ: radius,
            slices: 16,
            stacks: 8,
            material: {
                ambient: colors?.rope || [0.3, 0.25, 0.2, 1],
                diffuse: colors?.rope || [0.3, 0.25, 0.2, 1],
            },
        });
    }

    /**
     * Displays the rope's geometry.
     */
    render() {
        const deltaY = this.length / this.segments;

        for (let segment = 0; segment < this.segments; ++segment) {
            const y = segment * deltaY;
            this.knot.translate(0, this.knot.radiusY + y, 0).display();
        }
    }
}
