import { MyObject } from '../MyObject.js';

/**
 * A pyramid.
 */
export class MyPyramid extends MyObject {
    /**
     * Initializes the pyramid.
     * @param { Object } config - the pyramid configuration
     * @param { CGFscene } config.scene - the scene the pyramid will be displayed in
     * @param { number } config.radius - the radius of the circle that circumscribes the base of the pyramid
     * @param { number } config.height -the height of the pyramid
     * @param { number } config.slices - the number of divisions around the Y-axis
     * @param { number } config.stacks - the number of divisions along the Y-axis
     * @param { boolean } config.inverted - indicates if the pyramid should be rendered on the inside
     * @param { Object } config.material - the material to be applied to the pyramid
     * @param { string | Object } config.texture - the texture to be applied to the pyramid
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

        /** The radius of the circle that circumscribes the base of the pyramid */
        this.radius = radius ?? 1;
        /** The height of the pyramid */
        this.height = height ?? 1;
        /** The number of divisions around the Y-axis */
        this.slices = slices;
        /** The number of divisions along the Y-axis */
        this.stacks = stacks ?? Math.floor(this.height);

        this.initGeometry({ inverted, material, texture });
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const slope = this.radius / this.height;
        const deltaAngle = (2 * Math.PI) / this.slices;
        const deltaRadius = this.radius / this.stacks;
        const deltaY = this.height / this.stacks;

        // define the slices
        for (let slice = 0; slice < this.slices; ++slice) {
            const angle = slice * deltaAngle;
            const Nx = Math.sin(angle);
            const Nz = Math.cos(angle);

            const nextAngle = angle + deltaAngle;
            const Nxx = Math.sin(nextAngle);
            const Nzz = Math.cos(nextAngle);

            // compute the normal
            const normal = [(Nx + Nxx) / 2, slope, (Nz + Nzz) / 2];
            const Nsize = Math.hypot(...normal);

            normal[0] /= Nsize;
            normal[1] /= Nsize;
            normal[2] /= Nsize;

            // define the stacks
            for (let stack = 0; stack < this.stacks; ++stack) {
                const radius = stack * deltaRadius;
                const y = this.height - stack * deltaY;

                const nextRadius = radius + deltaRadius;
                const nextY = y - deltaY;

                // define the indices
                this.addPairOfIndices(1);

                // define the vertices
                // prettier-ignore
                this.vertices.push(
                    Nx * radius, y, Nz * radius,
                    Nxx * radius, y, Nzz * radius,
                    Nx * nextRadius, nextY, Nz * nextRadius,
                    Nxx * nextRadius, nextY, Nzz * nextRadius,
                );

                // define the normals
                this.normals.push(...Array(4).fill(normal).flat());

                // define the texture coordinates
                // prettier-ignore
                this.texCoords.push(
                    slice / this.slices, stack / this.stacks,
                    (slice + 1) / this.slices, stack / this.stacks,
                    slice / this.slices, (stack + 1) / this.stacks,
                    (slice + 1) / this.slices, (stack + 1) / this.stacks,
                );
            }
        }

        console.log(this.indices);
    }
}
