import { MyBox } from '../solids/MyBox.js';
import { MyObject } from '../MyObject.js';

export class MyHeliLandingGear extends MyObject {
    constructor({ scene, width, height, depth, angle, material, texture }) {
        super(scene);

        /** The height of the landing gear */
        this.height = height;

        /** The depth of both landing skids plus the distance between them **/
        this.depth = depth;

        /** The angle between the crosstubes and the Y-axis */
        this.angle = angle;

        /** A landing skid */
        this.skid = new MyBox({
            scene,
            width,
            height: 0.1 * height,
            depth: 0.05 * depth,
            material,
            texture,
        });

        /** The tubes that connect the landing skids to the cockpit */
        this.crosstube = new MyBox({
            scene,
            width: 0.03 * width,
            depth: 0.03 * depth,
            height: (0.9 * height) / Math.cos(this.angle),
        });

        /** The child objects */
        this.children = [this.skid, this.crosstube];
    }

    /**
     * Returns the width of the landing gear.
     * @returns { number } - the width of the landing gear
     */
    get width() {
        return this.skid.width;
    }

    /**
     * Displays the geometry of the landing gear.
     */
    render() {
        const halfSkidDistance = 0.45 * this.depth;
        const halfCrosstubeDistance = this.width / 3;

        // display the front skid and the corresponding crosstubes
        this.skid.translate(0, 0, halfSkidDistance).display();
        this.crosstube
            .rotate(-this.angle, 1, 0, 0)
            .translate(
                halfCrosstubeDistance,
                this.skid.height,
                halfSkidDistance,
            )
            .display()
            .rotate(-this.angle, 1, 0, 0)
            .translate(
                -halfCrosstubeDistance,
                this.skid.height,
                halfSkidDistance,
            )
            .display();

        // display the back skid and the corresponding crosstubes
        this.skid.translate(0, 0, -halfSkidDistance).display();
        this.crosstube
            .rotate(this.angle, 1, 0, 0)
            .translate(
                -halfCrosstubeDistance,
                this.skid.height,
                -halfSkidDistance,
            )
            .display()
            .rotate(this.angle, 1, 0, 0)
            .translate(
                halfCrosstubeDistance,
                this.skid.height,
                -halfSkidDistance,
            )
            .display();
    }
}
