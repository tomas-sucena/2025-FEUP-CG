import { CGFscene, CGFcamera, CGFaxis, CGFtexture } from '../lib/CGF.js';

import { MyColor } from './utils/MyColor.js';
import { MyBuilding } from './objects/building/MyBuilding.js';
import { MyPanorama } from './objects/MyPanorama.js';
import { MyRectangle } from './objects/shapes/MyRectangle.js';
import { MyForest } from './objects/forest/MyForest.js';

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
    constructor() {
        super();

        /** A hash map to store the textures that have already been loaded */
        this.textures = new Map();
    }

    /**
     * Fetches a texture and, if it isn't already a part of the scene, loads it.
     * @param {string} textureURL - the URL that identifies the texture
     * @return {CGFtexture} the texture
     */
    getTexture(textureURL) {
        // verify if the texture has already been loaded
        let texture = this.textures.get(textureURL);

        if (texture) {
            return texture;
        }

        // load the texture
        texture = new CGFtexture(this, textureURL);
        this.textures.set(textureURL, texture);

        return texture;
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
        this.selectedObject = 'Forest';

        this.initCameras();
        this.initLights();
        this.initObjects();
    }

    /**
     * Initializes the scene's camera.
     */
    initCameras() {
        this.camera = new CGFcamera(
            0.5,
            0.1,
            500,
            vec3.fromValues(20, 2, 20),
            vec3.fromValues(0, 2, 0),
        );
    }

    /**
     * Initializes the scene's light sources.
     */
    initLights() {
        this.lights[0].setPosition(0, 20, 0, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }

    /**
     * Initializes the scene's objects.
     */
    initObjects() {
        this.axis = new CGFaxis(this);

        /** The panorama that constitutes the skysphere */
        this.skysphere = new MyPanorama({
            scene: this,
            scaleFactor: 200,
            position: this.camera.position,
            texture: './assets/snow.jpg',
        });

        /** The surface */
        this.surface = new MyRectangle({
            scene: this,
            width: 400,
            height: 400,
            rows: 64,
            columns: 64,
            material: {
                diffuse: [1, 1, 1, 1],
            },
            texture: './assets/grass.png',
            shader: {
                vert: './shaders/terrain.vert',
                frag: './shaders/terrain.frag',
            },
        });

        /** The fire department building */
        this.building = new MyBuilding({
            scene: this,
            width: 30,
            height: 15,
            floors: 3,
            windows: 2,
            color: [0.9, 0.9, 0.9, 1],
            textures: {
                wall: './assets/concrete.jpg',
                window: './assets/window.webp',
                door: './assets/door.jpg',
                sign: './assets/sign.png',
                helipad: './assets/helipad.jpg',
            },
        });

        /** The forest */
        this.forest = new MyForest({
            scene: this,
            width: 40,
            depth: 40,
            rows: 5,
            columns: 5,
            maxRows: 8,
            maxColumns: 8,
            colors: {
                crown: MyColor.hex('#688f4e'),
                trunk: MyColor.hex('#6e4300'),
            },
            textures: {
                log: './assets/log.jpg',
                crown: './assets/leaves.jpg',
            },
        });

        this.objects = {
            'Building': this.building,
            'Forest': this.forest,
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

        this.objects[this.selectedObject].scale(
            this.scaleFactor,
            this.scaleFactor,
            this.scaleFactor,
        );

        this.surface.rotate(-Math.PI / 2, 1, 0, 0).display();
        this.skysphere.display();
        this.building.display();

        this.forest.translate(0, 0, 35).display();

        // ---- END Primitive drawing section
    }
}
