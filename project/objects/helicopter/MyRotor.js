import { MyObject } from '../MyObject.js';
import { MyBox } from '../solids/MyBox.js';
import { MyCylinder } from '../solids/MyCylinder.js';

export class MyRotor extends MyObject {
    constructor({ scene, height, radius, blades }) {
        super(scene);

        /** The number of blades of the rotor */
        this.blades = blades ?? 4;

        /** The cylinder that connects the blades */
        this.rotorMast = new MyCylinder({
            scene,
            radius: 0.02 * radius,
            height,
        });

        /** A rotor blade */
        this.rotorBlade = new MyBox({
            scene,
            width: radius,
            height: 0.05 * height,
            depth: 2 * this.rotorMast.radius,
        });
    }

    get height() {
        return this.rotorMast.height;
    }

    render() {
        const halfBladeWidth = this.rotorBlade.width / 2;
        const bladeY = 0.8 * this.height;

        const deltaAng = (2 * Math.PI) / this.blades;

        // display the mast
        this.rotorMast.display();

        // display the blades
        for (let blade = 0; blade < this.blades; ++blade) {
            const ang = blade * deltaAng;

            this.rotorBlade
                .translate(halfBladeWidth, bladeY, 0)
                .rotate(ang, 0, 1, 0)
                .display();
        }
    }
}
