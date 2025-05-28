import { MyObject } from '../MyObject.js';
import { MyTree } from './MyTree.js';
import { MyPyramid } from '../solids/MyPyramid.js';
import { CGFshader } from '../../../lib/CGF.js';

function randomBetween(min, max) {
    return min + (max - min) * Math.random();
}

export class MyForest extends MyObject {
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
        fireCount = 5, // Number of fires to generate
    }) {
        super(scene);

        this.width = width;
        this.depth = depth;
        this.rows = rows;
        this.columns = columns;
        this.maxRows = maxRows ?? rows;
        this.maxColumns = maxColumns ?? columns;
        this.fireCount = fireCount;

        const numTrees = this.maxRows * this.maxColumns;
        this.trees = Array(numTrees);
        this.treeOffsets = Array(numTrees);
        
        this.fires = [];
        this.firePositions = []; 
        this.fireShader = null;
        this.fireTime = 0; 

        this.#initTrees(colors, textures);
        this.#initFires();
    }

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

    #initFires() {
        this.fireShader = new CGFshader(
            this.scene.gl,
            './shaders/fire.vert',
            './shaders/fire.frag',
        );

        this.fireShader.setUniformsValues({ uTime: this.fireTime });

        for (let i = 0; i < this.fireCount; i++) {
            const fire = new MyPyramid({
                scene: this.scene,
                radius: randomBetween(1, 3),
                height: randomBetween(2, 5),
                slices: Math.floor(randomBetween(4, 8)),
            });
            
            const x = randomBetween(-this.width/2, this.width/2);
            const z = randomBetween(-this.depth/2, this.depth/2);
            this.firePositions.push([x, 0, z]);
            
            this.fires.push(fire);
        }
    }

    /**
     * Updates the fire animations
     * @param {number} elapsedTime - Time since last update in milliseconds
     */
    update(elapsedTime) {
        this.fireTime += elapsedTime / 1000;
    }

    render() {
        // Render trees
        const deltaX = this.width / this.columns;
        const deltaZ = this.depth / this.rows;
        const widthRatio = this.maxColumns / this.columns;
        const depthRatio = this.maxRows / this.rows;
        const xCorner = (0.5 - this.columns / 2) * deltaX;
        const zCorner = (0.5 - this.rows / 2) * deltaZ;

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

        this.scene.setActiveShader(this.fireShader);
        
        this.fireShader.setUniformsValues({ uTime: this.fireTime });

        for (let i = 0; i < this.fires.length; i++) {
            const [x, y, z] = this.firePositions[i];
            this.fires[i].translate(x, y, z).display();
        }
        
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}