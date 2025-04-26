import { MyObject } from '../MyObject.js';
import { MyCone } from '../solids/MyCone.js';
import { MyPyramid } from '../solids/MyPyramid.js';

export class MyTree extends MyObject {
    constructor({ scene, radius, height, stacks, colors, textures }) {
        super(scene);

        /** The tree's height */
        this.height = height;

        /** The number of stacks (pyramids) that constitute the tree's crown */
        this.stacks = stacks ?? Math.floor(0.8 * height);

        /** The tree's trunk */
        this.trunk = new MyCone({
            scene,
            radius: 1.2 * radius,
            height,
            material: {
                diffuse: colors?.log,
                specular: [0, 0, 0, 1],
            },
            texture: textures?.log,
        });

        this.ruler = new MyCone({
            scene,
            radius,
            height,
        });

        /** The bottomost pyramid that constitutes the tree's crown */
        this.crown = new MyPyramid(scene, 6);
    }

    render() {
        const crownHeight = 0.8 * this.height;
        const deltaRadius = (2 * this.trunk.radius) / this.stacks;
        const deltaY = crownHeight / this.stacks;

        // display the trunk
        this.trunk.translate(0, crownHeight - this.height, 0).display();

        // display the crown
        for (let stack = 0; stack < this.stacks; ++stack) {
            const radius = 3 * this.trunk.radius - stack * deltaRadius;
            const y = 0.2 * this.height + stack * deltaY;

            this.crown
                .scale(radius, this.height - y, radius)
                .translate(0, y, 0)
                .display();
        }

        // display the ruler
        this.ruler.translate(2, 0, 0).display();
    }
}
