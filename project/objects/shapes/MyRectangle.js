import { MyObject } from '../MyObject.js';

/**
 * A rectangle.
 */
export class MyRectangle extends MyObject {
    /**
     * Initializes the rectangle.
     * @param { MyScene } scene a reference to the MyScene object
     * @param { Object } config the object configuration
     */
    constructor(scene, config) {
        super(scene);
        const { width, height, rows, columns } = config ?? {};

        /** The dimension of the rectangle on the X-axis */
        this.width = width ?? 1;
        /** The dimension of the rectangle on the Y-axis */
        this.height = height ?? 1;
        /** The number of subdivisions of the rectangle on the Y-axis */
        this.rows = rows ?? 1;
        /** The number of subdivisions of the rectangle on the X-axis */
        this.columns = columns ?? 1;

        this.initGeometry(config);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const deltaX = this.width / this.columns;
        const deltaY = this.height / this.rows;

        // define the rows
        let y = this.height / 2;

        for (let row = 0; row <= this.rows; ++row) {
            let x = -this.width / 2;

            // define the columns
            for (let column = 0; column <= this.columns; ++column) {
                // define the indices
                if (row < this.rows && column < this.columns) {
                    this.addPairOfIndices(this.columns);
                }

                // define the vertices
                this.vertices.push(x, y, 0);
                x += deltaX;

                // define the normals
                this.normals.push(0, 0, 1);

                // define the texture coordinates
                this.texCoords.push(column / this.columns, row / this.rows);
            }

            y -= deltaY;
        }
    }
}
