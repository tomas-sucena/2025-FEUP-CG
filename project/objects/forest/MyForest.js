import { MyObject } from '../MyObject.js';
import { MyTree } from './MyTree.js';
import { MyColor } from '../../utils/MyColor.js';

export class MyForest extends MyObject {
    constructor({ scene, size, rows, columns, maxRows, maxColumns }) {
        super(scene);
        maxRows ??= rows;
        maxColumns ??= columns;

        /** The dimensions of the forest along the X and Z-axis */
        this.size = size;
        /** The number of rows of the forest */
        this.rows = rows;
        /** The number of columns of the forest */
        this.columns = columns;
        /** The trees */
        this.trees = Array(maxRows * maxColumns);

        this.#initTrees(maxRows, maxColumns);
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
     * Returns a pseudo-random element in an array.
     * @param { Array } array - the array
     * @returns a pseudo-random element in the array
     */
    #randomElement(array) {
        return array[Math.floor(array.length * Math.random())];
    }

    /**
     * Initializes the trees.
     */
    #initTrees(maxRows, maxColumns) {
        const patchSize = this.size / Math.max(maxRows, maxColumns);
        const axis = ['X', 'Z'];
        const crownColors = [
            MyColor.hex('#77a37a'),
            MyColor.hex('#5f926a'),
            MyColor.hex('#587e60'),
            MyColor.hex('#485e52'),
            MyColor.hex('#3a4f3f'),
        ];
        const trunkColors = [
            MyColor.hex('#271810'),
            MyColor.hex('#332211'),
            MyColor.hex('#4f200f'),
            MyColor.hex('#553311'),
            MyColor.hex('#664433'),
        ];

        for (let index = 0; index < this.trees.length; ++index) {
            // compute the pseudo-random variables
            const tilt = {
                angle: this.#randomBetween(-Math.PI / 36, Math.PI / 36),
                axis: this.#randomElement(axis),
            };
            const trunkRadius = patchSize / this.#randomBetween(7, 8);
            const height = patchSize * this.#randomBetween(2, 3);
            const slices = this.#randomBetween(4, 8);
            const stacks = this.#randomBetween(3, 6);
            const colors = {
                crown: this.#randomElement(crownColors),
                trunk: this.#randomElement(trunkColors),
            };

            // create the tree
            this.trees[index] = new MyTree({
                scene: this.scene,
                tilt,
                trunkRadius,
                height,
                slices,
                stacks,
                colors,
            });
        }
    }

    /**
     * Displays the object geometry.
     */
    render() {
        const deltaX = this.size / this.columns;
        const deltaZ = this.size / this.rows;

        const xCorner = (0.5 - this.columns / 2) * deltaX;
        const zCorner = (0.5 - this.rows / 2) * deltaZ;

        // display the trees
        for (let row = 0; row < this.rows; ++row) {
            const z = zCorner + row * deltaZ;
            const rowIndex = row * this.rows;

            for (let column = 0; column < this.columns; ++column) {
                const x = xCorner + column * deltaX;
                const index = rowIndex + column;

                this.trees[index].translate(x, 0, z).display();
            }
        }
    }
}
