import { MyObject } from '../MyObject.js';

/**
 * A unit sphere centered in the origin.
 */
export class MySphere extends MyObject {
    /**
     * Initializes the sphere.
     * @param { MyScene } scene a reference to the MyScene object
     * @param { Object } config the object configuration
     */
    constructor(scene, config) {
        super(scene, config);
        const { slices, stacks } = config;

        /** The number of divisions around the Y-axis */
        this.slices = slices;
        /** The number of divisions of each hemisphere along the Y-axis*/
        this.stacks = 2 * stacks;

        this.initGeometry(config);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const sliceAngOffset = (-2 * Math.PI) / this.slices;
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
                    this.addPairOfIndices(this.slices);
                }

                // define the vertices
                this.vertices.push(x, y, z);

                // define the normals
                this.normals.push(x, y, z);

                // define the texture coordinates
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }
    }
}
