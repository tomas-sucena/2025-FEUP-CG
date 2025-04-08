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
        const stackAngOffset = Math.PI / this.stacks;

        // define the slices
        for (let stack = 0; stack <= this.stacks; ++stack) {
            const stackAng = stack * stackAngOffset;
            const stackRadius = Math.cos(Math.PI / 2 - stackAng);
            const y = Math.cos(stackAng);

            // define the stacks
            for (let slice = 0; slice <= this.slices; ++slice) {
                const sliceAng = slice * sliceAngOffset;
                const x = stackRadius * Math.cos(sliceAng);
                const z = stackRadius * Math.sin(sliceAng);

                // define the indices
                if (stack < this.stacks && slice < this.slices) {
                    const index = this.vertices.length / 3;
                    const indexNextStack = index + this.slices + 1;
                    
                    this.indices.push(
                        index, index + 1, indexNextStack,
                        indexNextStack, index + 1, indexNextStack + 1,
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

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
