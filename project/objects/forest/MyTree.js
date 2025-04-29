import { MyObject } from '../MyObject.js';
import { MyCone } from '../solids/MyCone.js';
import { MyPyramid } from '../solids/MyPyramid.js';

export class MyTree extends MyObject {
    constructor({ scene, radius, height, stacks, slices, colors, textures }) {
        super(scene);
        const crownHeight = 0.8 * height;

        /** The tree's height */
        this.height = height;

        /** The number of stacks (pyramids) that constitute the tree's crown */
        this.stacks = stacks ?? Math.floor(crownHeight);

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
        this.crown = new MyPyramid({
            scene,
            radius: 3 * radius,
            height: crownHeight,
            slices: slices ?? 6,
            texture: textures?.crown,
        });
    }

    /**
     * Returns the radius of the tree, which corresponds to the radius of its crown.
     */
    get radius() {
        return this.crown.radius;
    }

    /**
     * Displays the geometry of the tree.
     */
    render() {
        const deltaHeightFactor = 1 / this.stacks;
        const deltaRadiusFactor = 0.6 / this.stacks;
        const deltaY = this.crown.height / this.stacks;

        const visibleLogHeight = 0.2 * this.height;

        // display the trunk
        this.trunk.translate(0, -visibleLogHeight, 0).display();

        // display the crown
        for (let stack = 0; stack < this.stacks; ++stack) {
            const radiusFactor = 1 - stack * deltaRadiusFactor;
            const heightFactor = 1 - stack * deltaHeightFactor;
            const Y = visibleLogHeight + stack * deltaY;

            this.crown
                .scale(radiusFactor, heightFactor, radiusFactor)
                .translate(0, Y, 0)
                .display();
        }

        // display the ruler
        this.ruler.translate(2, 0, 0).display();
    }
}
