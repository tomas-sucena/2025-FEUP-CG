import { MyObject } from '../MyObject.js';
import { MyBox } from '../solids/MyBox.js';
import { MyCylinder } from '../solids/MyCylinder.js';

/**
 * A helicopter's rotor.
 * @extends MyObject
 */
export class MyHeliRotor extends MyObject {
    /**
     * Initializes the helicopter's rotor.
     * @param { Object } config - the rotor's configuration
     * @param { CGFscene } config.scene - the scene the rotor will be displayed in
     * @param { number } config.gearHeight - the height of the rotor's gear
     * @param { number } config.gearRadius - the radius of the rotor's gear
     * @param { number } config.bladeLength - the length of each rotor's blade
     * @param { number } config.numBlades - the number of blades of the rotor
     * @param { Object } config.material - the material to be applied to the rotor
     * @param { Object } config.textures - the textures to be applied to the rotors
     */
    constructor({
        scene,
        gearHeight,
        gearRadius,
        bladeLength,
        numBlades = 4,
        material,
        textures,
    }) {
        super(scene);

        /** The number of blades of the rotor */
        this.numBlades = numBlades;

        /** The bottomost gear, which is connected to the rotor blades */
        this.bottomGear = new MyCylinder({
            scene,
            radius: gearRadius,
            height: gearHeight / 2,
            material,
            texture: textures?.metal,
        });

        /** The topmost gear */
        this.topGear = new MyCylinder({
            scene,
            bottomRadius: gearRadius,
            topRadius: gearRadius / 4,
            height: gearHeight / 2,
            material,
            texture: textures?.metal,
        });

        /** A rotor blade */
        this.rotorBlade = new MyBox({
            scene,
            width: bladeLength,
            height: this.bottomGear.height,
            depth: gearHeight / 2,
            material,
            texture: textures?.metal,
        });

        /** The child objects */
        this.children = [this.bottomGear, this.topGear, this.rotorBlade];
    }

    /**
     * Returns the height of the rotor.
     */
    get height() {
        return this.rotorMast.height;
    }

    /**
     * Displays the geometry of the rotor.
     */
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
