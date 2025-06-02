import { MyObject } from '../MyObject.js';
import { MyCone } from '../solids/MyCone.js';
import { MyPyramid } from '../solids/MyPyramid.js';
import { MyFire } from './MyFire.js';

/**
 * A tree.
 * @extends MyObject
 */
export class MyTree extends MyObject {
    /**
     * Initializes a tree.
     * @param { Object } config - the tree configuration
     * @param { CGFscene } config.scene - the scene the tree will be displayed in
     * @param { Object } config.tilt - describes the tilt of the tree relative to the vertical Y-axis.
     * @param { number } config.tilt.angle - the angle (in radians) by which the tree is tilted
     * @param { 'X' | 'Z' } config.tilt.axis - the axis around which the tree is tilted
     * @param { number } config.trunkRadius - the radius of the tree's trunk
     * @param { number } config.height - the tree's height
     * @param { number[3] } config.position - the tree's position
     * @param { boolean } config.isBurning - indicates if the tree is surrounded by fire
     * @param { MyForest } config.forest - the forest the tree is a part of
     * @param { number } config.stacks - the number of pyramids that constitute the tree's crown
     * @param { number } config.slices - the number of divisions around the Y-axis of the pyramids in the tree's crown
     * @param { Object } config.colors - the colors to be applied to the tree
     * @param { number[4] } config.colors.trunk - the color of the tree's trunk
     * @param { number[4] } config.colors.crown - the color of the tree's crown
     */
    constructor({
        scene,
        tilt,
        trunkRadius,
        height,
        position = [0, 0, 0],
        isBurning = false,
        forest,
        stacks,
        slices,
        colors,
        textures,
    }) {
        super(scene);
        const crownHeight = 0.8 * height;

        /** The tree's tilt */
        this.tilt = {
            angle: tilt?.angle ?? 0,
            axis: tilt?.axis === 'X' ? [1, 0, 0] : [0, 0, 1],
        };

        /** The tree's height */
        this.height = height;
        /** The tree's position */
        this.position = position;
        /** The forest the tree is a part of */
        this.forest = forest;
        /** The number of stacks (pyramids) that constitute the tree's crown */
        this.stacks = Math.floor(stacks ?? crownHeight / 2);

        /** The tree's trunk */
        this.trunk = new MyCone({
            scene,
            radius: 1.2 * trunkRadius,
            height,
            material: {
                ambient: colors?.trunk,
                diffuse: colors?.trunk,
                specular: [0, 0, 0, 1],
            },
            texture: textures?.log,
        });

        /** The bottomost pyramid that constitutes the tree's crown */
        this.crown = new MyPyramid({
            scene,
            radius: 3 * trunkRadius,
            height: crownHeight,
            slices: Math.floor(slices ?? 6),
            material: {
                ambient: colors?.crown,
                diffuse: colors?.crown,
                specular: [0, 0, 0, 1],
            },
            texture: textures?.crown,
        });

        /** The child objects */
        this.children = [this.trunk, this.crown];

        if (isBurning) {
            /** The fire that burns the tree */
            this.fire = new MyFire({
                scene,
                radius: 1.5 * this.crown.radius,
                height,
            });

            this.children.push(this.fire);
        }
    }

    /**
     * Returns the radius of the tree, which corresponds to the radius of its crown.
     */
    get radius() {
        return this.crown.radius;
    }

    /**
     * Determines if the helicopter is above this tree.
     * @param {MyHeli} helicopter - the helicopter
     * @return 'true' if the helicopter is above this tree, 'false' otherwise
     */
    isBelow(helicopter) {
        const treeCenter = [this.position[0], this.position[2]];
        const heliCenter = [helicopter.position[0], helicopter.position[2]];
        const bucketRadius = helicopter.bucket.topRadius;

        // compute the distance between centers
        const distance = vec2.dist(treeCenter, heliCenter);

        // check for horizontal overlap
        return Math.abs(distance) <= Math.max(this.fire.radius, bucketRadius);
    }

    /**
     * Puts out the fire that was burning this tree.
     */
    putOutFire() {
        if (this.fire) {
            this.fire.animation = 'putOut';
            /*delete this.fire;

            // remove this tree from the set of burning trees
            this.forest.burningTrees.delete(this);*/
        }
    }

    /**
     * Displays the geometry of the tree.
     */
    render() {
        // display the trunk
        const visibleLogHeight = 0.2 * this.height;
        this.trunk.translate(0, -visibleLogHeight, 0).display();

        // display the crown
        const deltaHeightFactor = 1 / this.stacks;
        const deltaRadiusFactor = 0.6 / this.stacks;
        const deltaY = this.crown.height / this.stacks;

        for (let stack = 0; stack < this.stacks; ++stack) {
            const radiusFactor = 1 - stack * deltaRadiusFactor;
            const heightFactor = 1 - stack * deltaHeightFactor;
            const Y = visibleLogHeight + stack * deltaY;

            this.crown
                .scale(radiusFactor, heightFactor, radiusFactor)
                .translate(0, Y, 0)
                .display();
        }

        // display the fire
        this.fire?.display();

        // tilt the tree
        this.rotate(this.tilt.angle, ...this.tilt.axis);
    }

    /**
     * Displays the tree.
     */
    display() {
        // position the tree
        this.translate(...this.position);

        super.display();
    }
}
