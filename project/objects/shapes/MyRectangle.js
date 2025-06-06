import { MyObject } from '../MyObject.js';

/**
 * A rectangle.
 * @extends MyObject
 */
export class MyRectangle extends MyObject {
    /**
     * Initializes the rectangle.
     * @param { Object } config - the rectangle configuration
     * @param { CGFscene } config.scene - the scene the rectangle will be displayed in
     * @param { number } config.width - the dimension of the rectangle along the X-axis
     * @param { number } config.height - the dimension of the rectangle along the Y-axis
     * @param { number } config.rows - the number of divisions along the Y-axis
     * @param { number } config.columns - the number of divisions along the X-axis
     * @param { boolean } config.inverted - indicates if the rectangle should be inverted
     * @param { Object } config.material - the material to be applied to the rectangle
     * @param { string } config.texture - the texture to be applied to the rectangle
     * @param { string } config.shader - the shader to be applied to the rectangle
     */
    constructor({
        scene,
        width,
        height,
        rows,
        columns,
        inverted,
        material,
        texture,
        shader,
    }) {
        super(scene);

        /** The dimension of the rectangle on the X-axis */
        this.width = width ?? 1;
        /** The dimension of the rectangle on the Y-axis */
        this.height = height ?? 1;
        /** The number of subdivisions of the rectangle on the Y-axis */
        this.rows = rows ?? this.height;
        /** The number of subdivisions of the rectangle on the X-axis */
        this.columns = columns ?? this.width;

        this.initGeometry({ inverted, material, texture, shader });
    }

    /**
     * Initializes the vertices, indices, normals, and texture coordinates.
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const deltaX = this.width / this.columns;
        const deltaY = this.height / this.rows;

        const halfHeight = this.height / 2;
        const halfWidth = this.width / 2;

        // define the rows
        for (let row = 0; row <= this.rows; ++row) {
            const y = halfHeight - row * deltaY;

            // define the columns
            for (let column = 0; column <= this.columns; ++column) {
                const x = -halfWidth + column * deltaX;

                // define the indices
                if (row < this.rows && column < this.columns) {
                    this.addPairOfIndices(this.columns);
                }

                // define the vertices
                this.vertices.push(x, y, 0);

                // define the normals
                this.normals.push(0, 0, 1);

                // define the texture coordinates
                this.texCoords.push(column / this.columns, row / this.rows);
            }
        }
    }
}
