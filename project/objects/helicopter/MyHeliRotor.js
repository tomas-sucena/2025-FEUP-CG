import { MyObject } from '../MyObject.js';
import { MyBox } from '../solids/MyBox.js';
import { MyCylinder } from '../solids/MyCylinder.js';

export class MyHeliRotor extends MyObject {
    constructor({ scene, gearHeight, gearRadius, bladeLength, numBlades }) {
        super(scene);

        /** The number of blades of the rotor */
        this.numBlades = numBlades ?? 4;

        /** The bottomost gear, which is connected to the rotor blades */
        this.bottomGear = new MyCylinder({
            scene,
            radius: gearRadius,
            height: gearHeight / 2,
        });

        /** The topmost gear */
        this.topGear = new MyCylinder({
            scene,
            bottomRadius: gearRadius,
            topRadius: gearRadius / 4,
            height: gearHeight / 2,
        });

        /** A rotor blade */
        this.rotorBlade = new MyBox({
            scene,
            width: bladeLength,
            height: this.bottomGear.height,
            depth: gearHeight / 2,
        });
    }

    get height() {
        return this.rotorMast.height;
    }

    render() {
        // display the gears
        this.bottomGear.display();
        this.topGear.translate(0, this.bottomGear.height, 0).display();

        // display the blades
        const x = this.rotorBlade.width / 2 + this.bottomGear.radius - 0.05;
        const deltaAng = (2 * Math.PI) / this.numBlades;

        for (let blade = 0; blade < this.numBlades; ++blade) {
            const ang = blade * deltaAng;
            this.rotorBlade.translate(x, 0, 0).rotate(ang, 0, 1, 0).display();
        }
    }
}
