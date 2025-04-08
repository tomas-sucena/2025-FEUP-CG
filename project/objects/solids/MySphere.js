import { MyObject } from '../MyObject.js';

/**
 * A unit sphere centered in the origin.
 */
export class MySphere extends MyObject {
    /**
     * Initializes the sphere.
     * @param { number } scene a reference to the MyScene object
     * @param { number } slices the number of divisions around the Z-axis
     * @param { number } stacks the number of divisions along the Z-axis
     * @param { Object } config the object configuration
     */
    constructor(scene, slices, stacks, config) {
        super(scene, config);

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

        // define the stacks
        for (let stack = 0; stack <= this.stacks; ++stack) {
            const stackAng = stack * stackAngOffset;
            const stackRadius = Math.cos(Math.PI / 2 - stackAng);
            const y = Math.cos(stackAng);

            // define the slices
            for (let slice = 0; slice <= this.slices; ++slice) {
                const sliceAng = slice * sliceAngOffset;
                const x = stackRadius * Math.cos(sliceAng);
                const z = stackRadius * Math.sin(sliceAng);

                // define the indices
                if (stack < this.stacks && slice < this.slices) {
                    const index = this.vertices.length / 3;
                    const indexNextStack = index + this.slices + 1;

                    // prettier-ignore
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
                this.texCoords.push(
                    1 - slice / this.slices,
                    stack / this.stacks,
                );
            }
        }

        super.initBuffers();
    }
}
