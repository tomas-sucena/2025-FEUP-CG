import { MyBox } from '../solids/MyBox.js';
import { MyObject } from '../MyObject.js';
import { MyCylinder } from '../solids/MyCylinder.js';

export class MyLandingGear extends MyObject {
    constructor({ scene, width, height, depth, material, texture }) {
        super(scene);

        /** The height of the landing gear */
        this.height = height;

        /** The depth of both landing skids plus the distance between them **/
        this.depth = depth;

        /** A landing skid */
        this.skid = new MyBox({
            scene,
            width,
            height: 0.05 * height,
            depth: 0.05 * depth,
            material,
            texture,
        });

        /** The tubes that connect the landing skids to the cockpit */
        this.crosstube = new MyBox({
            scene,
            width: 0.03 * depth,
            depth: 0.03 * depth,
            height: Math.sqrt(2) * height,
        });
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
            .rotate(-Math.PI / 4, 1, 0, 0)
            .translate(
                halfCrosstubeDistance,
                this.skid.height,
                halfSkidDistance,
            )
            .display()
            .rotate(-Math.PI / 4, 1, 0, 0)
            .translate(
                -halfCrosstubeDistance,
                this.skid.height,
                halfSkidDistance,
            )
            .display();

        // display the back skid and the corresponding crosstubes
        this.skid.translate(0, 0, -halfSkidDistance).display();
        this.crosstube
            .rotate(Math.PI / 4, 1, 0, 0)
            .translate(
                -halfCrosstubeDistance,
                this.skid.height,
                -halfSkidDistance,
            )
            .display()
            .rotate(Math.PI / 4, 1, 0, 0)
            .translate(
                halfCrosstubeDistance,
                this.skid.height,
                -halfSkidDistance,
            )
            .display();
    }
}
