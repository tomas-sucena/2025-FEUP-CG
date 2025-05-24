import { MyObject } from '../MyObject.js';

/**
 * An ellipsoid centered at the origin with configurable radii for each axis
 */
export class MyEllipsoid extends MyObject {
    /**
     * Initializes the ellipsoid.
     * @param { MyScene } scene the scene the object will be displayed in
     * @param { Object } config the object configuration
     */
    constructor({
        scene,
        radiusX = 1,
        radiusY = 1,
        radiusZ = 1,
        slices = 16,
        stacks = 8,
        inverted = false,
        material,
        texture,
    }) {
        super(scene);

        /** Radii for each axis */
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.radiusZ = radiusZ;
        
        /** The number of divisions around the Y-axis */
        this.slices = slices;
        /** The number of divisions along the Y-axis */
        this.stacks = 2 * stacks;

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

        for (let stack = 0; stack <= this.stacks; ++stack) {
            const stackAng = stack * deltaStackAng;
            const stackRadius = Math.cos(Math.PI/2 - stackAng);
            const Ny = Math.cos(stackAng);

            for (let slice = 0; slice <= this.slices; ++slice) {
                const sliceAng = slice * deltaSliceAng;
                const Nx = stackRadius * Math.sin(sliceAng);
                const Nz = stackRadius * Math.cos(sliceAng);

                if (stack < this.stacks && slice < this.slices) {
                    this.addPairOfIndices(this.slices);
                }

                // Vertex position with axis-specific radii
                this.vertices.push(
                    Nx * this.radiusX,
                    Ny * this.radiusY,
                    Nz * this.radiusZ
                );

                // Correct normals calculation for ellipsoid
                const normalX = Nx / this.radiusX;
                const normalY = Ny / this.radiusY;
                const normalZ = Nz / this.radiusZ;
                const normalLength = Math.sqrt(
                    normalX**2 + normalY**2 + normalZ**2
                );
                
                this.normals.push(
                    normalX / normalLength,
                    normalY / normalLength,
                    normalZ / normalLength
                );

                this.texCoords.push(
                    slice / this.slices,
                    stack / this.stacks
                );
            }
        }
    }
}