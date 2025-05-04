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
    /**
     * Initializes the forest.
     * @param { Object } config - the forest configuration
     * @param { CGFscene } config.scene - the scene the forest will be displayed in
     * @param { number } config.width - the dimension of the forest along the X-axis
     * @param { number } config.depth - the dimension of the forest along the Z-axis
     * @param { number } config.rows - the number of rows of the forest
     * @param { number } config.columns - the number of columns of the forest
     * @param { number } config.maxRows - the maximum number of rows of the forest
     * @param { number } config.maxColumns - the maximum number of columns of the forest
     * @param { Object } config.colors - the base colors to be applied to the trees
     * @param { number[4] } config.colors.crown - the base color of the trees' crown
     * @param { number[4] } config.colors.trunk - the base color of the trees' trunk
     * @param { Object } config.textures - the textures to be applied to the trees
     * @param { string } config.textures.crown - the texture to be applied to the trees' crowns
     * @param { string } config.textures.trunk - the texture to be applied to the trees' trunks
     */
    constructor({
        scene,
        width,
        depth,
        rows,
        columns,
        maxRows,
        maxColumns,
        colors,
        textures,
    }) {
        super(scene);

        /** The dimension of the forest along the X-axis */
        this.width = width;
        /** The dimension of the forest along the Z-axis */
        this.depth = depth;
        /** The number of rows of the forest */
        this.rows = rows;
        /** The number of columns of the forest */
        this.columns = columns;
        /** The maximum number of tree rows */
        this.maxRows = maxRows ?? rows;
        /** The maximum number of tree columns */
        this.maxColumns = maxColumns ?? columns;

        const numTrees = this.maxRows * this.maxColumns;
        /** The trees */
        this.trees = Array(numTrees);
        /** The offsets */
        this.treeOffsets = Array(numTrees);

        this.#initTrees(colors, textures);
    }

    /**
     * Initializes the trees.
     */
    #initTrees(colors, textures) {
        const patchWidth = this.width / this.maxColumns;
        const patchDepth = this.depth / this.maxRows;

        const patchMin = Math.min(patchWidth, patchDepth);
        const patchMax = Math.max(patchWidth, patchDepth);

        for (let index = 0; index < this.trees.length; ++index) {
            // create the pseudo-random tree
            const tree = new MyTree({
                scene: this.scene,
                tilt: {
                    angle: randomBetween(-Math.PI / 27, Math.PI / 27),
                    axis: Math.random() < 0.5 ? 'X' : 'Z',
                },
                trunkRadius: patchMin / randomBetween(7, 8),
                height: patchMax * randomBetween(2, 3),
                slices: randomBetween(4, 8),
                stacks: randomBetween(3, 6),
                colors: {
                    crown: colors.crown.map(
                        (value) => value + randomBetween(-0.08, 0.08),
                    ),
                    trunk: colors.trunk.map(
                        (value) => value + randomBetween(-0.05, 0.05),
                    ),
                },
                textures,
            });

            this.trees[index] = tree;

            // compute the pseudo-random offsets
            this.treeOffsets[index] = {
                x: (patchWidth / 2 - tree.radius) * randomBetween(-1, 1),
                z: (patchDepth / 2 - tree.radius) * randomBetween(-1, 1),
            };
        }
    }

    /**
     * Displays the trees.
     */
    render() {
        const deltaX = this.width / this.columns;
        const deltaZ = this.depth / this.rows;

        const widthRatio = this.maxColumns / this.columns;
        const depthRatio = this.maxRows / this.rows;

        const xCorner = (0.5 - this.columns / 2) * deltaX;
        const zCorner = (0.5 - this.rows / 2) * deltaZ;

        // display the trees
        for (let row = 0; row < this.rows; ++row) {
            const zRow = zCorner + row * deltaZ;
            const rowIndex = row * this.columns;

            for (let column = 0; column < this.columns; ++column) {
                const index = rowIndex + column;
                const { x: xOffset, z: zOffset } = this.treeOffsets[index];

                const x = xCorner + column * deltaX + xOffset * widthRatio;
                const z = zRow + zOffset * depthRatio;

                this.trees[index].translate(x, 0, z).display();
            }
        }
    }
}
