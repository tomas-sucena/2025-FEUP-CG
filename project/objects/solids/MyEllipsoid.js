import { MyObject } from '../MyObject.js';

/**
 * An ellipsoid.
 */
export class MyEllipsoid extends MyObject {
    /**
     * Initializes the ellipsoid.
     * @param { Object } config - the ellipsoid configuration
     * @param { CGFscene } config.scene - the scene the ellipsoid will be displayed in
     * @param { number } config.radiusX - the radius of the ellipsoid in the X-axis
     * @param { number } config.radiusY - the radius of the ellipsoid in the Y-axis
     * @param { number } config.radiusZ - the radius of the ellipsoid in the Z-axis
     * @param { number } config.slices - the number of divisions around the Y-axis
     * @param { number } config.stacks - the number of divisions along the Y-axis
     * @param { boolean } config.inverted - indicates if the ellipsoid should be inverted
     * @param { Object } config.material - the material to be applied to the ellipsoid
     * @param { string } config.texture - the texture to be applied to the ellipsoid
     */
    constructor({
        scene,
        radiusX = 1,
        radiusY = 1,
        radiusZ = 1,
        slices = 32,
        stacks = 16,
        inverted = false,
        material,
        texture,
    }) {
        super(scene);

        /** The radius of the ellipsoid in the X-axis */
        this.radiusX = radiusX;

        /** The radius of the ellipsoid in the Y-axis */
        this.radiusY = radiusY;

        /** The radius of the ellipsoid in the Z-axis */
        this.radiusZ = radiusZ;

        /** The number of divisions around the Y-axis */
        this.slices = slices;

        /** The number of divisions along the Y-axis */
        this.stacks = 2 * stacks;

        this.initGeometry({ inverted, material, texture });
    }

    /**
     * Returns the width of the ellipsoid.
     */
    get width() {
        return 2 * this.radiusX;
    }

    /**
     * Returns the height of the ellipsoid.
     */
    get height() {
        return 2 * this.radiusY;
    }

    /**
     * Returns the depth of the ellipsoid.
     */
    get depth() {
        return 2 * this.radiusZ;
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

                // compute the normal
                const normal = [
                    Nx / this.radiusX,
                    Ny / this.radiusY,
                    Nz / this.radiusZ,
                ];
                vec3.normalize(normal, normal);

                if (stack < this.stacks && slice < this.slices) {
                    this.addPairOfIndices(this.slices);
                }

                this.vertices.push(
                    Nx * this.radiusX,
                    Ny * this.radiusY,
                    Nz * this.radiusZ,
                );
                this.normals.push(...normal);
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }
    }
}
