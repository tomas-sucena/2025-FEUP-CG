import { MyObject } from '../MyObject.js';

export class MyModule extends MyObject {
    constructor(scene, config) {
        super(scene, config);
        const { width, height, depth, floors, windows, isMainModule } = config;

        /** The width of the module */
        this.width = width;
        /** The height of the module */
        this.height = height;
        /** The depth of the module */
        this.depth = depth ?? 0.8 * width;
        /** The number of floors of the module */
        this.floors = floors;
        /** The number of windows on each floor of the module */
        this.windows = windows;
        /** Indicates if the module is the main module */
        this.isMainModule = isMainModule ?? false;

        this.initGeometry(config);
    }

    #addWalls() {}

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const walls = 3 + this.isMainModule;
        const xOffset = this.width / this.windows;
        const yOffset = this.height / this.floors;
        const zOffset = this.depth / this.windows;

        // the X and Z coordinates of the upper left corner of each wall
        const upperLeftCorners = [
            { x: -this.width / 2, z: this.depth / 2 },
            { x: this.width / 2, z: this.depth / 2 },
            { x: this.width / 2, z: -this.depth / 2 },
            { x: -this.width / 2, z: -this.depth / 2 },
        ];

        // define the walls
        for (let wall = 0; wall < walls; ++wall) {
            const ang = wall * (Math.PI / 2);
            const ca = Math.cos(ang);
            const sa = Math.sin(ang);

            // define the floors
            for (let floor = 0; floor <= this.floors; ++floor) {
                const { x: xCorner, z: zCorner } = upperLeftCorners[wall];
                const y = this.height - floor * yOffset;

                // define the windows
                for (let window = 0; window <= this.windows; ++window) {
                    const x = xCorner + window * xOffset * ca;
                    const z = zCorner + window * zOffset * -sa;

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
                    this.normals.push(sa, 0, ca);

                    // define the texture coordinates
                    this.texCoords.push(window, floor);
                }
            }
        }

        super.initBuffers();
    }
}
