import { MyObject } from '../MyObject.js';

/**
 * A box.
 */
export class MyBox extends MyObject {
    /**
     * Initializes the box.
     * @param { Object } config - the box configuration
     * @param { CGFscene } config.scene - the scene the box will be displayed in
     * @param { number } config.width - the dimension of the box along the X-axis
     * @param { number } config.height - the dimension of the box along the Y-axis
     * @param { number } config.depth - the dimension of the box along the Z-axis
     * @param { number } config.xDivisions - the number of divisions along the X-axis
     * @param { number } config.yDivisions - the number of divisions along the Y-axis
     * @param { number } config.zDivisions - the number of divisions along the Z-axis
     * @param { boolean } config.inverted - indicates if the box should be inverted
     * @param { Object } config.material - the material to be applied to the box
     * @param { string } config.texture - the texture to be applied to the box
     */
    constructor({
        scene,
        width = 1,
        height = 1,
        depth = 1,
        xDivisions,
        yDivisions,
        zDivisions,
        inverted = false,
        material,
        texture,
    }) {
        super(scene);

        /** The dimension of the box along the X-axis */
        this.width = width;
        /** The dimension of the box along the Y-axis */
        this.height = height;
        /** The dimension of the box along the Z-axis */
        this.depth = depth;
        /** The number of divisions along the X-axis */
        this.xDivisions = Math.ceil(xDivisions ?? this.width);
        /** The number of divisions along the Y-axis */
        this.yDivisions = Math.ceil(yDivisions ?? this.height);
        /** The number of divisions along the Z-axis */
        this.zDivisions = Math.ceil(zDivisions ?? this.depth);

        this.initGeometry({ inverted, material, texture });
    }

    /**
     * Initializes a face of the box.
     * @param { Object } config - the face configuration
     * @param { number[3] } config.upperLeftCorner - the coordinates of the upper left corner of the face
     * @param { number[3] } config.normal - the normal vector of the face
     */
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
