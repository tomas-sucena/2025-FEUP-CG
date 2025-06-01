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

        this.gui.add(this.scene, 'displayAxis').name('Axis');
        this.gui.add(this.scene.camera, 'fov', 0.1, 1).name('FOV');

        // initialize the keyboard actions
        this.initKeys();

        // object settings
        const objectsFolder = this.gui.addFolder('Object');

        objectsFolder
            .add(this.scene, 'selectedObject', Object.keys(this.scene.objects))
            .onChange(this.scene.changeObject.bind(this.scene))
            .name('Selected');

        objectsFolder.add(this.scene, 'scaleFactor', 0.1, 10).name('Scale');

        objectsFolder
            .add(this.scene, 'displayNormals')
            .onChange(this.scene.toggleNormalVisibility.bind(this.scene))
            .name('Normals');

        objectsFolder
            .add(this.scene, 'displayWireframe')
            .onChange(this.scene.toggleWireframe.bind(this.scene))
            .name('Wireframe');

        // forest settings
        const forest = this.scene.forests[0];
        const forestSettings = this.gui.addFolder('Forest');

        forestSettings.add(forest, 'rows', 0, forest.maxRows, 1).name('Rows');

        forestSettings
            .add(forest, 'columns', 0, forest.maxColumns, 1)
            .name('Columns');

        return true;
    }

    initKeys() {
        // disable the processKeyboard function
        this.processKeyboard = () => {};

        /** A hash set to store the keys that are being pressed */
        this.scene.pressedKeys = new Set();
    }

    processKeyDown(event) {
        this.scene.pressedKeys.add(event.code);
    }

    processKeyUp(event) {
        this.scene.pressedKeys.delete(event.code);
    }
}
