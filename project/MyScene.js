import {
    CGFscene,
    CGFcamera,
    CGFaxis,
    CGFtexture,
    CGFshader,
} from '../lib/CGF.js';

import { MyColor } from './utils/MyColor.js';
import { MyBuilding } from './objects/building/MyBuilding.js';
import { MyHeli } from './objects/helicopter/MyHeli.js';
import { MyPanorama } from './objects/MyPanorama.js';
import { MyForest } from './objects/forest/MyForest.js';
import { MyTerrain } from './objects/MyTerrain.js';

/**
 * A scene.
 * @extends CGFscene
 */
export class MyScene extends CGFscene {
    constructor() {
        super();

        /** A hash map to store the textures that have already been loaded */
        this.textures = new Map();
        /** A hash map to store the shaders that have already been loaded */
        this.shaders = new Map();
    }

    /**
     * Fetches a texture, loading it beforehand if it isn't already a part of the scene.
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

    /**
     * Fetches a shader, loading it beforehand if it isn't already a part of the scene.
     * @param {string} shaderID - the name that uniquely identifies the vertex and fragment shaders
     * @return {CGFshader} the shader
     */
    getShader(shaderID) {
        // verify if the shader has already been loaded
        let shader = this.shaders.get(shaderID);

        if (shader) {
            return shader;
        }

        // load the shader
        const filename = `./shaders/${shaderID}`;
        shader = new CGFshader(this.gl, `${filename}.vert`, `${filename}.frag`);
        this.shaders.set(shaderID, shader);

        return shader;
    }

    /**
     * Initializes the scene.
     * @param {CGFapplication} application - the application where the scene will be displayed
     */
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
        this.followHelicopter = true;
        this.selectedObject = 'Helicopter';

        this.initCameras();
        this.initLights();
        this.initObjects();

        // set up the periodic updates
        this.timeSinceAppStarted = Date.now();
        this.setUpdatePeriod(30); // ms
    }

    /**
     * Initializes the scene's camera.
     */
    initCameras() {
        this.camera = new CGFcamera(
            0.5,
            0.1,
            1000,
            vec3.fromValues(-140, 56, -65),
            vec3.fromValues(0, 30, 0),
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
        /** The axis */
        this.axis = new CGFaxis(this);

        /** The panorama that constitutes the skysphere */
        this.skysphere = new MyPanorama({
            scene: this,
            scaleFactor: 200,
            //position: this.camera.position,
            texture: './assets/background.jpg',
        });

        /** The surface */
        this.terrain = new MyTerrain({
            scene: this,
            size: 400,
            textures: [
                './assets/terrain_mask.png',
                './assets/grass.png',
                './assets/lake.jpg',
            ],
        });

        /** The fire department building */
        this.building = new MyBuilding({
            scene: this,
            width: 70,
            height: 30,
            floors: 4,
            windows: 3,
            color: [0.9, 0.9, 0.9, 1],
            textures: {
                wall: './assets/concrete.jpg',
                window: './assets/window.webp',
                door: './assets/door.png',
                sign: './assets/sign.png',
                helipad: './assets/helipad.png',
            },
        });

        /** The forests */
        this.forests = [
            // left
            new MyForest({
                scene: this,
                width: 280,
                depth: 90,
                rows: 6,
                columns: 14,
                maxRows: 9,
                maxColumns: 28,
                position: [0, 0, 50 + 0.7 * this.terrain.lake.depth],
                colors: {
                    crown: MyColor.hex('#688f4e'),
                    trunk: MyColor.hex('#6e4300'),
                },
                textures: {
                    log: './assets/log.jpg',
                    crown: './assets/leaves.jpg',
                },
            }),
            // right
            new MyForest({
                scene: this,
                width: 280,
                depth: 90,
                rows: 6,
                columns: 14,
                maxRows: 9,
                maxColumns: 28,
                position: [0, 0, -50 - 0.7 * this.terrain.lake.depth],
                colors: {
                    crown: MyColor.hex('#688f4e'),
                    trunk: MyColor.hex('#6e4300'),
                },
                textures: {
                    log: './assets/log.jpg',
                    crown: './assets/leaves.jpg',
                },
            }),
        ];

        /** The fire department helicopter */
        this.helicopter = new MyHeli({
            scene: this,
            position: [
                -this.terrain.lake.width / 2 - this.building.depth,
                this.building.height,
                0,
            ],
            colors: {
                coat: MyColor.RGB(255, 255, 255),
                metal: MyColor.hex('#b6b6b6'),
                rope: MyColor.hex('#3F220D'),
                bucket: MyColor.RGB(255, 255, 255),
            },
            textures: {
                metal: './assets/metallic.jpg',
                cockpit: './assets/helicopter.png',
                tail: './assets/tail.png',
                glass: './assets/glass.jpg',
                bucket: './assets/bucket.png',
                water: './assets/lake.jpg',
                gush: './assets/gush.jpg',
            },
        });

        /** The scene objects */
        this.objects = {
            'Building': this.building,
            'Left Forest': this.forests[0],
            'Right Forest': this.forests[1],
            'Helicopter': this.helicopter,
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
     * Updates the camera
     */
    updateCamera() {
        if (this.followHelicopter) {
            this.camera.setTarget(this.helicopter.position);
        }
    }

    /**
     * Updates the scene.
     * @param {number} time - the time
     */
    update(time) {
        // compute the elapsed time
        const elapsedTime = time - this.timeSinceAppStarted;

        // update the lake
        this.terrain.update(elapsedTime / 60);

        // update the forests
        this.forests.forEach((forest) => forest.update(elapsedTime / 100));

        // update the helicopter
        this.helicopter.update();
        this.updateCamera();
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
        // clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // initialize Model-View matrix as identity (no transformation)
        this.updateProjectionMatrix();
        this.loadIdentity();

        // apply transformations corresponding to the camera position relative to the origin
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

        // display the skysphere
        this.skysphere.display();

        // display the terrain
        this.terrain.rotate(-Math.PI / 2, 1, 0, 0).display();

        // display the building
        this.building
            .rotate(Math.PI / 2, 0, 1, 0)
            .translate(-this.terrain.lake.width / 2 - this.building.depth, 0, 0)
            .display();

        // display the forests
        this.forests.forEach((forest) => forest.display());

        // display the helicopter
        this.helicopter.display();
        // ---- END Primitive drawing section
    }
}
