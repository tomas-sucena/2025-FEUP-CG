import { MyObject } from '../MyObject.js';

/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Z axis
 * @param stacks - number of divisions along the Z axis
 */
export class MyCylinder extends MyObject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        const angOffset = (2 * Math.PI) / this.slices;
        const zOffset = 1 / this.stacks;

        // define the slices
        for (let slice = 0; slice < this.slices; ++slice) {
            const ang = slice * angOffset;
            const sa = Math.sin(ang);
            const ca = Math.cos(ang);

            // define the stacks
            for (let stack = 0; stack <= this.stacks; ++stack) {
                // define the indices (except for the last vertex of each stack)
                if (stack < this.stacks) {
                    const index = this.vertices.length / 3;
                    const indexNextSlice = (slice + 1 < this.slices)
                        ? index + this.stacks + 1
                        : stack;
                    
                    this.indices.push(
                        index, indexNextSlice, index + 1,
                        indexNextSlice, indexNextSlice + 1, index + 1,
                    );
                }

                // define the vertices
                this.vertices.push(ca, sa, stack * zOffset);

                // define the normals
                this.normals.push(ca, sa, 0);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity) {
        this.slices = Math.max(3, Math.round(16 * complexity));

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
