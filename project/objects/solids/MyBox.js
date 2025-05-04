import { MyObject } from '../MyObject.js';

/**
 * A box.
 */
export class MyBox extends MyObject {
    /**
     * Initializes the box.
     * @param { CGFscene } scene - the scene the box will be displayed in
     * @param { Object } config - the box configuration
     */
    constructor({
        scene,
        width,
        height,
        depth,
        xDivisions,
        yDivisions,
        zDivisions,
        inverted,
        material,
        texture,
    }) {
        super(scene);

        this.width = width ?? 1;
        this.height = height ?? 1;
        this.depth = depth ?? 1;
        this.xDivisions = xDivisions ?? 1;
        this.yDivisions = yDivisions ?? 1;
        this.zDivisions = zDivisions ?? 1;

        this.initGeometry({ inverted, material, texture });
    }

    #addFace({ upperLeftCorner, normal }) {
        const [xCorner, yCorner, zCorner] = upperLeftCorner;
        const [Nx, Ny, Nz] = normal;

        const deltaX = !Nx * (Nz + !!Ny) * (this.width / this.xDivisions);
        const deltaY = !Ny * (this.height / this.yDivisions);
        const deltaZ = !Nz * (this.depth / this.zDivisions);

        const rows = Math.abs(
            (Nx + Nz) * this.yDivisions + Ny * this.zDivisions,
        );
        const columns = Math.abs(
            (Ny + Nz) * this.xDivisions + Nx * this.zDivisions,
        );

        // define the rows of the face
        for (let row = 0; row <= rows; ++row) {
            const y = yCorner - row * deltaY;
            const zRow = zCorner + row * deltaZ * Ny;

            // define the columns of the face
            for (let column = 0; column <= columns; ++column) {
                const x = xCorner + column * deltaX;
                const z = zRow - column * deltaZ * Nx;

                if (row < rows && column < columns) {
                    this.addPairOfIndices(columns);
                }

                this.vertices.push(x, y, z);
                this.normals.push(Nx, Ny, Nz);
                this.texCoords.push(row / rows, column / columns);
            }
        }
    }

    /**
     * Initializes the vertices, indices, normals, and texture coordinates.
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const halfWidth = this.width / 2;
        const halfDepth = this.depth / 2;

        // +X face
        this.#addFace({
            upperLeftCorner: [halfWidth, this.height, halfDepth],
            normal: [1, 0, 0],
        });

        // -X face
        this.#addFace({
            upperLeftCorner: [-halfWidth, this.height, -halfDepth],
            normal: [-1, 0, 0],
        });

        // +Z face
        this.#addFace({
            upperLeftCorner: [-halfWidth, this.height, halfDepth],
            normal: [0, 0, 1],
        });

        // -Z face
        this.#addFace({
            upperLeftCorner: [halfWidth, this.height, -halfDepth],
            normal: [0, 0, -1],
        });

        // +Y face
        this.#addFace({
            upperLeftCorner: [-halfWidth, this.height, -halfDepth],
            normal: [0, 1, 0],
        });

        // -Y face
        this.#addFace({
            upperLeftCorner: [-halfWidth, 0, halfDepth],
            normal: [0, -1, 0],
        });
    }
}
