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

    /**
     * Initializes the vertices, indices, normals, and texture coordinates.
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const deltaStackAng = Math.PI / this.stacks;
        const deltaSliceAng = (2 * Math.PI) / this.slices;

        // define the stacks
        for (let stack = 0; stack <= this.stacks; ++stack) {
            const stackAng = stack * deltaStackAng;
            const stackRadius = Math.cos(Math.PI / 2 - stackAng);
            const Ny = Math.cos(stackAng);

            // define the slices
            for (let slice = 0; slice <= this.slices; ++slice) {
                const sliceAng = slice * deltaSliceAng;
                const Nx = stackRadius * Math.sin(sliceAng);
                const Nz = stackRadius * Math.cos(sliceAng);

                if (stack < this.stacks && slice < this.slices) {
                    this.addPairOfIndices(this.slices);
                }

                this.vertices.push(...[Nx, Ny, Nz].map((N) => N * this.radius));
                this.normals.push(Nx, Ny, Nz);
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }
    }
}
