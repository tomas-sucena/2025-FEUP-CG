import { MyCylinder } from '../solids/MyCylinder.js';
import { MyHeliRotor } from './MyHeliRotor.js';

/**
 * The helicopter's tail.
 * @extends MyCylinder
 */
export class MyHeliTail extends MyCylinder {
    /**
     * Initializes the helicopter's tail.
     * @param { Object } config - the tail configuration
     * @param { CGFscene } config.scene - the scene the object will be displayed in
     * @param { number } config.width - the width of the tail
     * @param { number } config.radius - the radius of the tail's bottom base
     * @param { Object } config.materials - the materials to be applied to the tail
     * @param { Object } config.textures - the textures to be applied to the tail
     */
    constructor({ scene, width, radius, materials, textures }) {
        super({
            scene,
            bottomRadius: radius,
            topRadius: 0.2 * radius,
            height: 0.75 * width,
            material: materials.coat,
            texture: textures?.tail,
        });

        /** The tail's rotor */
        this.rotor = new MyHeliRotor({
            scene,
            gearHeight: 0.05 * width,
            gearRadius: this.topRadius,
            bladeLength: radius,
            numBlades: 6,
            material: materials.metal,
            textures,
        });

        /** The child objects */
        this.children = [this.rotor];
    }

    render() {
        this.rotate(Math.PI / 2, 0, 0, 1).translate(0, this.radius / 2, 0);

        // display the cylinder
        super.render();

        // display the rotor
        this.rotor.translate(0, this.height, 0).display();
    }
}
