import { MyObject } from '../MyObject.js';
import { MyEllipsoid } from '../solids/MyEllipsoid.js';

/**
 * The helicopter's rope.
 * @extends MyObject
 */
export class MyHeliRope extends MyObject {
    /**
     * Initializes the helicopter's rope.
     * @param { Object } config - the rope configuration
     * @param { CGFscene } config.scene - the scene the rope will be displayed in
     * @param { number } config.radius - the horizontal radius of the rope
     * @param { number } config.length - the vertical length of the rope
     * @param { number } config.knots - the number of knots that constitute the rope
     * @param { number[4] } config.color - the color of the rope
     */
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
            radiusY: 0.6 * (length / this.knots),
            radiusZ: radius,
            slices: 16,
            stacks: 8,
            material: {
                ambient: color,
                diffuse: color,
            },
        });

        /** The child objects */
        this.children = [this.knot];
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
