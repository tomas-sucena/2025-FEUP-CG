import { MyObject } from '../MyObject.js';
import { MyBox } from '../solids/MyBox.js';
import { MyCylinder } from '../solids/MyCylinder.js';

export class MyRotor extends MyObject {
    constructor({ scene, height, radius, blades }) {
        super(scene);

        /** The number of blades of the rotor */
        this.blades = blades ?? 4;

        /** The bottomost gear, which is connected to the rotor blades */
        this.bottomGear = new MyCylinder({
            scene,
            radius: radius,
            height: height / 2,
        });

        /** The topmost gear */
        this.topGear = new MyCylinder({
            scene,
            bottomRadius: this.bottomGear.radius,
            topRadius: this.bottomGear.radius / 3,
            height: height / 2,
        });

        /** A rotor blade */
        this.rotorBlade = new MyBox({
            scene,
            width: 3,
            height: this.bottomGear.height,
            depth: height / 2,
        });
    }

    get height() {
        return this.rotorMast.height;
    }

    render() {
        // display the gears
        this.bottomGear.display();
        this.topGear.translate(0, this.bottomGear.height, 0).display();

        // display the mast

        // display the blades
        const halfBladeWidth = this.rotorBlade.width / 2;
        const deltaAng = (2 * Math.PI) / this.blades;

        for (let blade = 0; blade < this.blades; ++blade) {
            const ang = blade * deltaAng;

            this.rotorBlade
                .translate(halfBladeWidth, 0, 0)
                .rotate(ang, 0, 1, 0)
                .display();
        }
    }
}
