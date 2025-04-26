import { MyObject } from '../MyObject.js';
import { MyTree } from './MyTree.js';

export class MyForest extends MyObject {
    constructor({ scene, size, rows, columns }) {
        super(scene);

        /** The dimensions of the forest along the X and Z-axis */
        this.size = size;
        /** The number of rows of the forest */
        this.rows = rows;
        /** The number of columns of the forest */
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
        const deltaX = this.size / this.columns;
        const deltaZ = this.size / this.rows;
        const halfSize = this.size / 2;

        // generate the trees and their coordinates
        this.trees = [];

        for (let row = 0; row < this.rows; ++row) {
            const z = -halfSize + row * deltaZ;

            for (let column = 0; column < this.columns; ++column) {
                const x = -halfSize + column * deltaX;

                // compute the pseudo-random variables
                const radius = (Math.random() * this.size) / 2;

                const tree = new MyTree({
                    scene: this.scene,
                    radius,
                    height: this.size * this.#randomBetween(3, 7),
                    stacks: Math.floor(10 * Math.random()),
                });

                const position = [x, 0, z];

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
