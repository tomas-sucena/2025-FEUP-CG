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

    /**
     * Displays the main module of the building.
     */
    #displayMainModule() {
        const mainModuleWidth = 0.4 * this.width;

        // display the front and back walls
        this.mainModuleWall
            .translate(0, this.height / 2, this.depth / 2)
            .display()
            .scale(-1, 1, -1)
            .translate(0, this.height / 2, -this.depth / 2)
            .display();

        // display the left and right walls
        this.scene.pushMatrix();
        this.scene.scale(1, 1, this.depth / mainModuleWidth);

        this.mainModuleWall
            .rotate(Math.PI / 2, 0, 1, 0)
            .translate(mainModuleWidth / 2, this.height / 2, 0)
            .display()
            .rotate(-Math.PI / 2, 0, 1, 0)
            .translate(-mainModuleWidth / 2, this.height / 2, 0)
            .display();

        this.scene.popMatrix();

        // display the ceiling
        this.ceiling
            .rotate(-Math.PI / 2, 1, 0, 0)
            .translate(0, this.height, 0)
            .display();
    }

    #displaySideModules() {
        const sideModuleWidth = 0.3 * this.width;
        const sideModuleHeight = this.height - 1;
        const mainModuleWidth = 0.4 * this.width;

        // display the front walls
        this.sideModuleWall
            .translate(
                mainModuleWidth / 2 + sideModuleWidth / 2,
                sideModuleHeight / 2,
                0.3 * this.depth,
            )
            .display()
            .translate(
                -mainModuleWidth / 2 - sideModuleWidth / 2,
                sideModuleHeight / 2,
                0.3 * this.depth,
            )
            .display();

        // display the back walls
        this.scene.pushMatrix();
        this.scene.scale(-1, 1, -1);

        this.sideModuleWall
            .translate(
                mainModuleWidth / 2 + sideModuleWidth / 2,
                sideModuleHeight / 2,
                0.3 * this.depth,
            )
            .display()
            .translate(
                -mainModuleWidth / 2 - sideModuleWidth / 2,
                sideModuleHeight / 2,
                0.3 * this.depth,
            )
            .display();

        this.scene.popMatrix();
    }

    render() {
        this.#displayMainModule();
        this.#displaySideModules();
    }
}
