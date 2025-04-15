import {
    CGFscene,
    CGFcamera,
    CGFaxis,
    CGFappearance,
    CGFtexture,
} from '../lib/CGF.js';
import { MyPanorama } from './objects/MyPanorama.js';

import { MySphere } from './objects/solids/MySphere.js';

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
    constructor() {
        super();
    }

    init(application) {
        super.init(application);

        // background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);

        // initialize the objects connected to the interface
        this.displayAxis = true;
        this.scaleFactor = 1;
        this.displayNormals = false;
        this.displayWireframe = false;
        this.selectedObject = 'Sphere';
        this.selectedBackground = 'Snow';

        this.initCameras();
        this.initLights();
        this.initObjects();
    }

    /**
     * Initializes the scene's camera.
     */
    initCameras() {
        this.camera = new CGFcamera(
            0.4,
            0.1,
            500,
            vec3.fromValues(15, 15, 15),
            vec3.fromValues(0, 0, 0),
        );
    }

    /**
     * Initializes the scene's light sources.
     */
    initLights() {
        this.lights[0].setPosition(5, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }

    /**
     * Initializes the scene's objects.
     */
    initObjects() {
        this.axis = new CGFaxis(this);
        this.skybox = new MyPanorama(this, {
            position: this.camera.position,
            scaleFactor: 200,
            texture: './assets/snow.jpg',
        });

        this.backgrounds = {
            'Coast': './assets/coast.jpg',
            'Island': './assets/island.jpg',
            'Rocks': './assets/rocks.jpg',
            'Snow': './assets/snow.jpg',
        };

        this.objects = {
            'Sphere': new MySphere(this, {
                slices: 50,
                stacks: 25,
                texture: './assets/earth.jpg',
            }),
        };
    }

    /**
     * Toggles the selected object's normals visibility.
     */
    toggleNormalVisibility() {
        this.displayNormals
            ? this.objects[this.selectedObject].enableNormalViz()
            : this.objects[this.selectedObject].disableNormalViz();
    }

    /**
     * Toggles the selected object's wireframe visibility.
     */
    toggleWireframe() {
        this.displayWireframe
            ? this.objects[this.selectedObject].setLineMode()
            : this.objects[this.selectedObject].setFillMode();
    }

    /**
     * Changes the selected object.
     */
    changeObject() {
        this.toggleNormalVisibility();
        this.toggleWireframe();
    }

    /**
     * Changes the skybox texture.
     */
    changeBackground() {
        this.skybox.sphere.setTexture(
            this.backgrounds[this.selectedBackground],
        );
    }

    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // ---- BEGIN Primitive drawing section
        if (this.displayAxis) {
            this.axis.display();
        }

        this.skybox.translate(0, -100, 0).display();
        this.objects[this.selectedObject]
            .scale(this.scaleFactor, this.scaleFactor, this.scaleFactor)
            .display();

        // ---- END Primitive drawing section
    }
}
