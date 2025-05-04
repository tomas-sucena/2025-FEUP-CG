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

            normal.forEach((_, index) => (normal[index] /= Nsize)); // normalization

            // define the stacks
            for (let stack = 0; stack < this.stacks; ++stack) {
                const radius = stack * deltaRadius;
                const Y = this.height - stack * deltaY;

                const nextRadius = radius + deltaRadius;
                const nextY = Y - deltaY;

                // define the indices
                this.addPairOfIndices(1);

                // define the vertices
                this.vertices.push(Nx * radius, Y, Nz * radius); // upper left corner
                this.vertices.push(Nxx * radius, Y, Nzz * radius); // upper right corner
                this.vertices.push(Nx * nextRadius, nextY, Nz * nextRadius); // bottom left corner
                this.vertices.push(Nxx * nextRadius, nextY, Nzz * nextRadius); // bottom right corner

                // define the normals
                this.normals.push(...Array(4).fill(normal).flat());

                // define the texture coordinates
                const S = slice / this.slices;
                const T = stack / this.stacks;
                const nextS = (slice + 1) / this.slices;
                const nextT = (stack + 1) / this.stacks;

                this.texCoords.push(S, T); // upper left corner
                this.texCoords.push(nextS, T); // upper right corner
                this.texCoords.push(S, nextT); // bottom left corner
                this.texCoords.push(nextS, nextT); // bottom right corner
            }
        }
    }
}
