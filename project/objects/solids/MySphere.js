import { MyObject } from '../MyObject.js';

/**
 * A unit sphere centered in the origin.
 */
export class MySphere extends MyObject {
    /**
     * Initializes the sphere.
     * @param { MyScene } scene the scene the object will be displayed in
     * @param { Object } config the object configuration
     */
    constructor({
        scene,
        radius,
        slices,
        stacks,
        inverted,
        material,
        texture,
    }) {
        super(scene);

        /** The radius of the sphere */
        this.radius = radius ?? 1;
        /** The number of divisions around the Y-axis */
        this.slices = slices ?? 16;
        /** The number of divisions of each hemisphere along the Y-axis*/
        this.stacks = 2 * (stacks ?? 8);

        this.initGeometry({ inverted, material, texture });
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
            const normalY = Math.cos(stackAng);

            // define the slices
            for (let slice = 0; slice <= this.slices; ++slice) {
                const sliceAng = slice * sliceAngOffset;
                const normalX = stackRadius * Math.cos(sliceAng);
                const normalZ = stackRadius * Math.sin(sliceAng);

                // define the indices
                if (stack < this.stacks && slice < this.slices) {
                    this.addPairOfIndices(this.slices);
                }

                // define the vertices
                this.vertices.push(
                    normalX * this.radius,
                    normalY * this.radius,
                    normalZ * this.radius,
                );

                // define the normals
                this.normals.push(normalX, normalY, normalZ);

                // define the texture coordinates
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }
    }
}
