import { MyObject } from './MyObject.js';

export class MyBuilding extends MyObject {
    constructor(scene, config) {
        super(scene, config);
        const { width, height, depth, floors, windows } = config;

        /** The width of the building */
        this.width = width;
        /** The height of the building */
        this.height = height;
        /** The depth of the building */
        this.depth = depth;
        /** The number of floors of the building  */
        this.floors = floors;
        /** The number of windows on each floor */
        this.windows = windows;

        this.initGeometry(config);
    }

    #addFrontWall({ xMin, xMax, yMin, yMax, z }) {
        const xOffset = (xMax - xMin) / this.windows;
        const yOffset = (yMax - yMin) / this.floors;

        // define the floors
        for (let floor = 0; floor <= this.floors; ++floor) {
            const y = yMax - floor * yOffset;

            // define the windows
            for (let window = 0; window <= this.windows; ++window) {
                const x = xMin + window * xOffset;

                // define the indices
                if (floor < this.floors && window < this.windows) {
                    const index = this.vertices.length / 3;
                    const indexNextFloor = index + this.windows + 1;

                    // prettier-ignore
                    this.indices.push(
                        index, indexNextFloor, index + 1,
                        index + 1, indexNextFloor, indexNextFloor + 1,
                    );
                }

                // define the vertices
                this.vertices.push(x, y, z);

                // define the normals
                this.normals.push(0, 0, 1);

                // define the texture coordinates
                this.texCoords.push(window, floor);
            }
        }
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // define the front wall
        this.#addFrontWall({
            xMin: -this.width,
            xMax: 0,
            yMin: 0,
            yMax: this.height,
            z: 0,
        });

        this.#addFrontWall({
            xMin: 0,
            xMax: this.width,
            yMin: 0,
            yMax: this.height,
            z: 0,
        });

        super.initBuffers();
    }
}
