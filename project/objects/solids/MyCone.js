import { MyObject } from '../MyObject.js';

/**
 * A cone.
 */
export class MyCone extends MyObject {
    /**
     * Initializes the cone.
     * @param { MyScene } scene the scene the object will be displayed in
     * @param { Object } config the object configuration
     */
    constructor({
        scene,
        radius,
        height,
        slices,
        stacks,
        inverted,
        material,
        texture,
    }) {
        super(scene);

        /** The radius of the cone */
        this.radius = radius ?? 1;
        /** The height of the cone */
        this.height = height ?? 1;
        /** The number of divisions around the Y-axis */
        this.slices = slices ?? 16;
        /** The number of divisions along the Y-axis*/
        this.stacks = stacks ?? 1;

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

        const slope = this.radius / this.height;
        const deltaAngle = (2 * Math.PI) / this.slices;
        const deltaRadius = this.radius / this.stacks;
        const deltaY = this.height / this.stacks;

        // define the stacks
        for (let stack = 0; stack <= this.stacks; ++stack) {
            const y = this.height - stack * deltaY;
            const radius = stack * deltaRadius;

            // define the slices
            for (let slice = 0; slice <= this.slices; ++slice) {
                const angle = slice * deltaAngle;
                const Nx = Math.sin(angle);
                const Nz = Math.cos(angle);
                const Nsize = Math.hypot(Nx, slope, Nz);

                if (stack < this.stacks && slice < this.slices) {
                    this.addPairOfIndices(this.slices);
                }

                this.vertices.push(Nx * radius, y, Nz * radius);
                this.normals.push(Nx / Nsize, slope / Nsize, Nz / Nsize);
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }
    }
}
