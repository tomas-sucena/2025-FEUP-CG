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
            MyColor.hex('#3a4f3f'),
            MyColor.hex('#2b463c'),
            MyColor.hex('#688f4e'),
        ];
        const trunkColors = [
            MyColor.hex('#271810'),
            MyColor.hex('#332211'),
            MyColor.hex('#4f200f'),
            MyColor.hex('#553311'),
            MyColor.hex('#664433'),
        ];

        for (let index = 0; index < this.trees.length; ++index) {
            // create the pseudo-random tree
            const tree = new MyTree({
                scene: this.scene,
                tilt: {
                    angle: this.#randomBetween(-Math.PI / 27, Math.PI / 27),
                    axis: this.#randomElement(axis),
                },
                trunkRadius: patchSize / this.#randomBetween(7, 8),
                height: patchSize * this.#randomBetween(2, 3),
                slices: this.#randomBetween(4, 8),
                stacks: this.#randomBetween(3, 6),
                colors: {
                    crown: this.#randomElement(crownColors).map(
                        (value) => value + this.#randomBetween(-0.03, 0.03),
                    ),
                    trunk: this.#randomElement(trunkColors).map(
                        (value) => value + this.#randomBetween(-0.02, 0.02),
                    ),
                },
            });

            // compute the pseudo-random offsets
            const xOffset =
                (patchSize / 2 - tree.radius) * this.#randomBetween(-1, 1);
            const zOffset =
                (patchSize / 2 - tree.radius) * this.#randomBetween(-1, 1);

            this.trees[index] = {
                tree,
                xOffset,
                zOffset,
            };
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
            const zRow = zCorner + row * deltaZ;
            const rowIndex = row * this.columns;

            this.trees
                .slice(rowIndex, rowIndex + this.columns)
                .forEach(({ tree, xOffset, zOffset }, column) => {
                    const x = xCorner + column * deltaX + xOffset;
                    const z = zRow + zOffset;

                    tree.translate(x, 0, z).display();
                });
        }
    }
}
