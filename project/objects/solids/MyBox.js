import { MyObject } from '../MyObject.js';

/**
 * A box.
 */
export class MyBox extends MyObject {
    constructor({
        scene,
        width,
        height,
        depth,
        xDivisions,
        yDivisions,
        zDivisions,
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

        this._initGeometry({ material, texture });
    }

    #addFace({ upperLeftCorner, normal }) {
        const [xCorner, yCorner, zCorner] = upperLeftCorner;
        const [normalX, normalY, normalZ] = normal;

        const deltaX = !normalX * (this.width / this.xDivisions);
        const deltaY = !normalY * (this.height / this.yDivisions);
        const deltaZ = !normalZ * (this.depth / this.zDivisions);

        const rows = Math.abs(
            (normalX + normalZ) * this.yDivisions + normalY * this.zDivisions,
        );
        const columns = Math.abs(
            (normalY + normalZ) * this.xDivisions + normalX * this.zDivisions,
        );

        // define the rows of the face
        for (let row = 0; row <= rows; ++row) {
            const y = yCorner - row * deltaY;
            const zRow = zCorner + row * deltaZ * normalY;

            // define the columns of the face
            for (let column = 0; column <= columns; ++column) {
                const x = xCorner + column * deltaX * (normalZ + !!normalY);
                const z = zRow - column * deltaZ * normalX;

                if (row < rows && column < columns) {
                    this._addPairOfIndices(columns);
                }

                this.vertices.push(x, y, z);
                this.normals.push(normalX, normalY, normalZ);
                this.texCoords.push(row / rows, column / columns);
            }
        }
    }

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
