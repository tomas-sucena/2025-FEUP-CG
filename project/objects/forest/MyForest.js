import { MyObject } from '../MyObject.js';
import { MyTree } from './MyTree.js';

export class MyForest extends MyObject {
    constructor({ scene, width, depth, rows, columns }) {
        super(scene);

        this.width = width;
        this.depth = depth;
        this.rows = rows;
        this.columns = columns;

        this.#initTrees();
    }

    /**
     * Returns a pseudo-random number in an interval.
     * @param { number } min a number
     * @param { number } max a number
     * @returns a pseudo-random number in an interval
     */
    #randomBetween(min, max) {
        return min + (max - min) * Math.random();
    }

    #initTrees() {
        const deltaX = this.width / this.columns;
        const deltaZ = this.depth / this.rows;
        const minDelta = Math.min(deltaX, deltaZ);
        const maxDelta = Math.max(deltaX, deltaZ);

        const xCorner = -this.width / 2 + deltaX / 2;
        const zCorner = -this.depth / 2 + deltaZ / 2;

        // generate the trees and their coordinates
        this.trees = [];

        for (let row = 0; row < this.rows; ++row) {
            const z = -zCorner + row * deltaZ;

            for (let column = 0; column < this.columns; ++column) {
                const x = -xCorner + column * deltaX;

                // compute the pseudo-random variables
                const radius = (Math.random() * minDelta) / 2;

                const tree = new MyTree({
                    scene: this.scene,
                    radius,
                    height: this.#randomBetween(minDelta, maxDelta),
                    stacks: Math.floor(10 * Math.random()),
                });

                const position = [
                    x + this.#randomBetween(-radius, radius),
                    0,
                    z + this.#randomBetween(-radius, radius),
                ];

                this.trees.push({ tree, position });
            }
        }
    }

    render() {
        this.trees.forEach(({ tree, position }) => {
            tree.translate(...position).display();
        });
    }
}
