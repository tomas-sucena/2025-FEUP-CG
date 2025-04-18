import { MyObject } from './MyObject.js';
import { MyRectangle } from './shapes/MyRectangle.js';

export class MyBuilding extends MyObject {
    constructor(scene, config) {
        super(scene, config);
        const { width, floors, windows } = config ?? {};

        /** The width of the building */
        this.width = width;
        /** The height of the building */
        this.height = floors + 1;
        /** The depth of the building */
        this.depth = 0.3 * this.width;
        /** The number of floors of the side modules  */
        this.floors = floors;
        /** The number of windows on each floor of the side modules */
        this.windows = windows;

        this.#initWalls();
    }

    /**
     * Initializes the building walls.
     */
    #initWalls() {
        /** The wall of the main module */
        this.mainModuleWall = new MyRectangle(this.scene, {
            width: 0.4 * this.width,
            height: this.height,
            rows: this.floors + 1,
            columns: this.windows,
        });

        /** The wall of the side modules */
        this.sideModuleWall = new MyRectangle(this.scene, {
            width: 0.3 * this.width,
            height: this.height - 1,
            rows: this.floors,
            columns: this.windows,
        });

        /** The ceiling of the main module */
        this.ceiling = new MyRectangle(this.scene, {
            width: 0.4 * this.width,
            height: this.depth,
            rows: this.windows,
            columns: this.windows,
        });
    }

    #displaySideModules() {
        const heightRatio = this.floors / (this.floors + 1);

        // define the front and back walls
        this.mainModuleWall
            .translate(this.width, this.height / 2, 0.3 * this.depth)
            .scale(1, heightRatio, 1)
            .display()
            .translate(this.width, this.height / 2, 0.3 * this.depth)
            .scale(-1, heightRatio, -1)
            .display();
    }

    /**
     * Displays the main module of the building.
     */
    #displayMainModule() {
        const width = this.mainModuleWall.width;

        // define the front and back walls
        this.mainModuleWall
            .translate(0, this.height / 2, this.depth / 2)
            .display()
            .scale(-1, 1, -1)
            .translate(0, this.height / 2, -this.depth / 2)
            .display();

        // define the left and right walls
        this.mainModuleWall
            .rotate(Math.PI / 2, 0, 1, 0)
            .scale(1, 1, this.depth / width)
            .translate(width / 2, this.height / 2, 0)
            .display()
            .rotate(-Math.PI / 2, 0, 1, 0)
            .scale(1, 1, this.depth / width)
            .translate(-width / 2, this.height / 2, 0)
            .display();

        // define the ceiling
        this.ceiling
            .rotate(-Math.PI / 2, 1, 0, 0)
            .translate(0, this.height, 0)
            .display();
    }

    render() {
        //this.#displaySideModules();
        this.#displayMainModule();
    }
}
