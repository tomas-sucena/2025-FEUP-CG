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
        this.gui.add(this.scene, 'scaleFactor', 0.1, 10).name('Scale');

        // object settings
        const objectsFolder = this.gui.addFolder('Object');

        objectsFolder
            .add(this.scene, 'selectedObject', Object.keys(this.scene.objects))
            .onChange(this.scene.onSelectedObjectChanged.bind(this.scene))
            .name('Selected');

        objectsFolder
            .add(this.scene, 'wireframe')
            .name('Wireframe')
            .onChange(this.scene.onWireframeChanged.bind(this.scene));

        // shader settings
        const shadersFolder = this.gui.addFolder('Shader');

        shadersFolder
            .add(this.scene, 'selectedShader', Object.keys(this.scene.shaders))
            .name('Selected')
            .onChange(this.scene.onSelectedShaderChanged.bind(this.scene));

        shadersFolder
            .add(this.scene, 'shaderSlider', -50, 50)
            .onChange(this.scene.onShaderSliderChanged.bind(this.scene))
            .name('Slider');

        shadersFolder
            .add(this.scene, 'showShaderCode')
            .name('Code')
            .onChange(this.scene.onShaderCodeVizChanged.bind(this.scene));

        return true;
    }
}
