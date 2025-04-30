import { MyObject } from '../MyObject.js';
import { MyTree } from './MyTree.js';

export class MyForest extends MyObject {
    constructor({ scene, size, rows, columns, maxTrees }) {
        super(scene);

        /** The dimensions of the forest along the X and Z-axis */
        this.size = size;
        /** The number of rows of the forest */
        this.rows = rows;
        /** The number of columns of the forest */
        this.columns = columns;
        /** The trees */
        this.trees = Array(maxTrees ?? (rows * columns));
        console.log('trees:', this.trees);

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
        for (let index = 0; index < this.trees.length; ++index) {
            // compute the pseudo-random variables
            const trunkRadius = this.size / this.#randomBetween(3, 6);
            const height = this.size * this.#randomBetween(5, 10);
            const slices = this.#randomBetween(4, 8);

            // create the tree
            this.trees[index] = new MyTree({
                scene: this.scene,
                radius: trunkRadius,
                height,
                slices,
            })
        };
    }

    render() {
        const halfSize = this.size / 2;
        const deltaX = this.size / this.columns;
        const deltaZ = this.size / this.rows;

        // display the trees
        for (let row = 0; row < this.rows; ++row) {
            const zCorner = -halfSize + row * deltaZ;

            for (let column = 0; column < this.columns; ++column) {
                
            }
        }
    }
}
