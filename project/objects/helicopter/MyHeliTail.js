import { MyCylinder } from '../solids/MyCylinder.js';
import { MyHeliRotor } from './MyHeliRotor.js';

export class MyHeliTail extends MyCylinder {
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
    }

    render() {
        this.rotate(Math.PI / 2, 0, 0, 1).translate(0, this.radius / 2, 0);

        // display the cylinder
        super.render();

        // display the rotor
        this.rotor.translate(0, this.height, 0).display();
    }
}
