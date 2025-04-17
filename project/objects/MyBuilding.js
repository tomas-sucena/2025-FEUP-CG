import { MyObject } from './MyObject.js';
import { MyRectangle } from './shapes/MyRectangle.js';

export class MyBuilding extends MyObject {
    constructor(scene, config) {
        super(scene, config);
        const { width, height, depth, floors, windows } = config ?? {};

        /** The width of the building */
        this.width = width;
        /** The height of the building */
        this.height = height;
        /** The depth of the building */
        this.depth = depth ?? 0.75 * width;
        /** The number of floors of the building  */
        this.floors = floors;
        /** The number of windows on each floor */
        this.windows = windows;

        this.initWalls();
    }

    /**
     * Initializes the building walls.
     */
    initWalls() {
        /** The front and back walls of the main building */
        this.mainBuildingFrontWall = new MyRectangle(this.scene, {
            width: this.width,
            height: this.height,
            rows: this.floors + 1,
            columns: this.windows,
        });

        /** The left and right walls of the main building */
        this.mainBuildingSideWall = new MyRectangle(this.scene, {
            width: this.depth,
            height: this.height,
            rows: this.floors + 1,
            columns: this.windows,
        });

        /** The ceiling of the main building */
        this.mainBuildingCeiling = new MyRectangle(this.scene, {
            width: this.width,
            height: this.depth,
            rows: this.floors + 1,
            columns: this.windows,
        });
    }

    render() {
        // define the main building
        this.mainBuildingFrontWall
            .translate(0, 0, this.depth)
            .display()
            .scale(-1, 1, -1)
            .display();

        this.mainBuildingSideWall
            .rotate(Math.PI / 2, 0, 1, 0)
            .translate(this.width / 2, 0, this.depth / 2)
            .display()
            .rotate(-Math.PI / 2, 0, 1, 0)
            .translate(-this.width / 2, 0, this.depth / 2)
            .display();

        this.mainBuildingCeiling
            .rotate(-Math.PI / 2, 1, 0, 0)
            .translate(0, this.height, this.depth)
            .display();
    }
}
