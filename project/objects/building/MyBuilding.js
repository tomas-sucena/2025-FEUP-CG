import { MyObject } from '../MyObject.js';
import { MyModule } from './MyModule.js';

export class MyBuilding extends MyObject {
    constructor(scene, config) {
        super(scene);
        const { width, floors, windows } = config ?? {};

        /** The main module of the building **/
        this.mainModule = new MyModule(scene, {
            width: 0.4 * width,
            height: floors + 1,
            floors: floors + 1,
            windows: windows,
            isMainModule: true,
        });

        /** The side module of the building */
        this.sideModule = new MyModule(scene, {
            width: 0.3 * width,
            height: floors,
            floors: floors,
            windows: windows,
        });
    }

    _render() {
        const mainModuleWidth = this.mainModule.width;
        const sideModuleWidth = this.sideModule.width;

        // display the main module
        this.mainModule.display();

        // display the right module
        this.sideModule
            .translate(mainModuleWidth / 2 + sideModuleWidth / 2, 0, 0)
            .display();

        // display the left module
        this.sideModule
            .translate(mainModuleWidth / 2 + sideModuleWidth / 2, 0, 0)
            .scale(-1, 1, -1)
            .display();
    }
}
