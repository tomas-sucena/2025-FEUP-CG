import { MyObject } from '../MyObject.js';
import { MyTree } from './MyTree.js';

/**
 * Returns a pseudo-random number in an interval.
 * @param { number } min a number
 * @param { number } max a number
 * @returns a pseudo-random number in an interval
 */
function randomBetween(min, max) {
    return min + (max - min) * Math.random();
}

/**
 * A 2D grid of randomly generated trees.
 */
export class MyForest extends MyObject {
    constructor({
        scene,
        size,
        rows,
        columns,
        maxRows,
        maxColumns,
        colors,
        textures,
    }) {
        super(scene);

        /** The dimensions of the forest along the X and Z-axis */
        this.size = size;
        /** The number of rows of the forest */
        this.rows = rows;
        /** The number of columns of the forest */
        this.columns = columns;
        /** The maximum number of tree rows */
        this.maxRows = maxRows ?? rows;
        /** The maximum number of tree columns */
        this.maxColumns = maxColumns ?? columns;
        /** The trees */
        this.trees = Array(this.maxRows * this.maxColumns);

        this.#initTrees(colors, textures);
    }

    /**
     * Initializes the trees.
     */
    #initTrees(colors, textures) {
        const { crown: crownColor, trunk: trunkColor } = colors;
        const patchSize = this.size / Math.max(this.maxRows, this.maxColumns);

        for (let index = 0; index < this.trees.length; ++index) {
            // create the pseudo-random tree
            const tree = new MyTree({
                scene: this.scene,
                tilt: {
                    angle: randomBetween(-Math.PI / 27, Math.PI / 27),
                    axis: Math.random() < 0.5 ? 'X' : 'Z',
                },
                trunkRadius: patchSize / randomBetween(7, 8),
                height: patchSize * randomBetween(2, 3),
                slices: randomBetween(4, 8),
                stacks: randomBetween(3, 6),
                colors: {
                    crown: crownColor.map(
                        (value) => value + randomBetween(-0.08, 0.08),
                    ),
                    trunk: trunkColor.map(
                        (value) => value + randomBetween(-0.05, 0.05),
                    ),
                },
                textures,
            });

            // compute the pseudo-random offsets
            const xOffset =
                (patchSize / 2 - tree.radius) * randomBetween(-1, 1);
            const zOffset =
                (patchSize / 2 - tree.radius) * randomBetween(-1, 1);

            this.trees[index] = {
                tree,
                xOffset,
                zOffset,
            };
        }
    }

    /**
     * Displays the trees.
     */
    render() {
        const deltaX = this.size / this.columns;
        const deltaZ = this.size / this.rows;

        const widthRatio = this.maxColumns / this.columns;
        const depthRatio = this.maxRows / this.rows;

        const xCorner = (0.5 - this.columns / 2) * deltaX;
        const zCorner = (0.5 - this.rows / 2) * deltaZ;

        // display the trees
        for (let row = 0; row < this.rows; ++row) {
            const zRow = zCorner + row * deltaZ;
            const rowIndex = row * this.columns;

            this.trees
                .slice(rowIndex, rowIndex + this.columns)
                .forEach(({ tree, xOffset, zOffset }, column) => {
                    const x = xCorner + column * deltaX + xOffset * widthRatio;
                    const z = zRow + zOffset * depthRatio;

                    tree.translate(x, 0, z).display();
                });
        }
    }
}
