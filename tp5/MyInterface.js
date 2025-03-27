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

        this.gui
            .add(this.scene, 'selectedObject', Object.keys(this.scene.objects))
            .onChange(this.scene.onSelectedObjectChanged.bind(this.scene))
            .name('Object');

        this.gui
            .add(this.scene, 'wireframe')
            .name('Wireframe')
            .onChange(this.scene.onWireframeChanged.bind(this.scene));

        this.gui
            .add(this.scene, 'scaleFactor', -50, 50)
            .name('Scale')
            .onChange(this.scene.onScaleFactorChanged.bind(this.scene));

        this.gui
            .add(this.scene, 'selectedShader', Object.keys(this.scene.shaders))
            .name('Shader')
            .onChange(this.scene.onSelectedShaderChanged.bind(this.scene));

        this.gui
            .add(this.scene, 'showShaderCode')
            .name('Show Shader Code')
            .onChange(this.scene.onShaderCodeVizChanged.bind(this.scene));

        return true;
    }
}
