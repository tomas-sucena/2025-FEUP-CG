import { MyObject } from '../MyObject.js';
import { MyTree } from './MyTree.js';

export class MyForest extends MyObject {
    constructor({ scene, rows, columns, patchSize, maxTrees }) {
        super(scene);

        /** The dimensions of the forest along the X and Z-axis */
        this.patchSize = patchSize;
        /** The number of rows of the forest */
        this.rows = rows;
        /** The number of columns of the forest */
        this.columns = columns;
        /** The trees */
        this.trees = Array(maxTrees ?? (rows * columns));

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

    /**
     * Initializes the trees.
     */
    #initTrees() {
        for (let index = 0; index < this.trees.length; ++index) {
            // compute the pseudo-random variables
            const trunkRadius = this.patchSize / this.#randomBetween(4, 6);
            const height = this.patchSize * this.#randomBetween(2, 3);
            const slices = this.#randomBetween(4, 8);
            const stacks = this.#randomBetween(4, 8);

            // create the tree
            this.trees[index] = new MyTree({
                scene: this.scene,
                radius: trunkRadius,
                height,
                slices,
            })
        };

        console.log(this.trees);
    }

    /**
     * Displays the object geometry.
     */
    render() {
        const halfWidth = this.patchSize * this.columns / 2;
        const halfDepth = this.patchSize * this.rows / 2;

        // display the trees
        for (let row = 0; row < this.rows; ++row) {
            const z = -halfDepth + row * this.patchSize;
            const rowIndex = row * this.rows;

            for (let column = 0; column < this.columns; ++column) {
                const x = -halfWidth + column * this.patchSize;
                const index = rowIndex + column;

                this.trees[index]
                    .translate(x, 0, z)
                    .display();
            }
        }
    }
}
