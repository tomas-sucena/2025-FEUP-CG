import { MyObject } from '../MyObject.js';
import { MyTree } from './MyTree.js';
import { MyColor } from '../../utils/MyColor.js';

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
        this.trees = Array(maxTrees ?? rows * columns);

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
    #initTrees() {
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
            const trunkRadius = this.patchSize / this.#randomBetween(5, 8);
            const height = this.patchSize * this.#randomBetween(2, 3);
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
        const halfWidth = (this.patchSize * this.columns) / 2;
        const halfDepth = (this.patchSize * this.rows) / 2;

        // display the trees
        for (let row = 0; row < this.rows; ++row) {
            const z = -halfDepth + row * this.patchSize;
            const rowIndex = row * this.rows;

            for (let column = 0; column < this.columns; ++column) {
                const x = -halfWidth + column * this.patchSize;
                const index = rowIndex + column;

                this.trees[index].translate(x, 0, z).display();
            }
        }
    }
}
