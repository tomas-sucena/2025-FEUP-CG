import { MyObject } from '../MyObject.js';
import { MyCone } from '../solids/MyCone.js';
import { MyPyramid } from '../solids/MyPyramid.js';

export class MyTree extends MyObject {
    constructor({ scene, radius, height, colors, textures }) {
        super(scene);

        /** The tree's trunk */
        this.trunk = new MyCone({
            scene,
            radius,
            height: 0.4 * height,
            material: {
                diffuse: colors?.log,
                specular: [0, 0, 0, 1],
            },
            texture: textures?.log,
        });

        this.crown = new MyPyramid(scene, 6);
    }

    render() {
        this.trunk.display();
    }
}
