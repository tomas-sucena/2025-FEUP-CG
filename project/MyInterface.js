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
        const [leftForest, rightForest] = this.scene.forests;
        const forestsFolder = this.gui.addFolder('Forests');

        const leftForestFolder = forestsFolder.addFolder('Left');
        leftForestFolder
            .add(leftForest, 'rows', 0, leftForest.maxRows, 1)
            .name('Rows');
        leftForestFolder
            .add(leftForest, 'columns', 0, leftForest.maxColumns, 1)
            .name('Columns');

        const rightForestFolder = forestsFolder.addFolder('Right');
        rightForestFolder
            .add(rightForest, 'rows', 0, rightForest.maxRows, 1)
            .name('Rows');
        rightForestFolder
            .add(rightForest, 'columns', 0, rightForest.maxColumns, 1)
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
