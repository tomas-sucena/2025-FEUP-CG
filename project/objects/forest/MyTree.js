import { MyObject } from '../MyObject.js';
import { MyCone } from '../solids/MyCone.js';
import { MyPyramid } from '../solids/MyPyramid.js';

export class MyTree extends MyObject {
    constructor({ scene, radius, height, colors, textures }) {
        super(scene);

        /** The tree's height */
        this.height = height;

        /** The tree's trunk */
        this.trunk = new MyCone({
            scene,
            radius,
            height: 0.8 * height,
            material: {
                diffuse: colors?.log,
                specular: [0, 0, 0, 1],
            },
            texture: textures?.log,
        });

        this.ruler = new MyCone({
            scene,
            radius,
            height: this.height,
        });

        /** The bottomost pyramid that constitutes the tree's crown */
        this.crown = new MyPyramid(scene, 6);
    }

    render() {
        const stacks = (0.8 * this.height) / this.trunk.radius;
        const deltaRadius = (3 * this.trunk.radius) / stacks;
        const deltaY = (0.8 * this.height) / stacks;

        // display the trunk
        this.trunk.display();

        // display the crown
        for (let stack = 1; stack < stacks - 1; ++stack) {
            const radius = 3 * this.trunk.radius - stack * deltaRadius;
            const y = 0.2 * this.height + stack * deltaY;

            this.crown.scale(radius, 1, radius).translate(0, y, 0).display();
        }

        // display the ruler
        this.ruler.translate(2, 0, 0).display();
    }
}
