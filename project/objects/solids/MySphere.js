import { MyObject } from '../MyObject.js';

/**
 * MySphere
 * @constructor
 * @param scene - Reference to the MyScene object
 * @param slices - number of divisions around the Z axis
 * @param stacks - number of divisions along the Z axis
 */
export class MySphere extends MyObject {
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
        this.texCoords = [];

        const sliceAngOffset = (2 * Math.PI) / this.slices;
        const stackAngOffset = (2 * Math.PI) / this.stacks;

        // define the slices
        for (let stack = 0; stack <= this.stacks; ++stack) {
            const stackAng = stack * stackAngOffset;
            const y = Math.cos(stackAng);
            const mult = Math.sin(stackAng);

            // define the stacks
            for (let slice = 0; slice <= this.slices; ++slice) {
                const sliceAng = stack * sliceAngOffset;
                const x = mult * Math.cos(sliceAng);
                const z = mult * Math.sin(sliceAng);

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
                this.vertices.push(x, y, z);

                // define the normals
                this.normals.push(x, y, z);

                // define the texture coordinates
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }

        console.log(this.vertices);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
