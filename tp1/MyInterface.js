import { CGFinterface, dat } from '../lib/CGF.js';

/**
 * MyInterface
 * @constructor
 */
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        // checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Axis');

        // slider element in GUI
        this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name('Scale Factor');

        // dropdown element in GUI
        this.gui
            .add(this.scene, 'selectedObject', Object.keys(this.scene.objects))
            .name('Object');

        return true;
    }
}
