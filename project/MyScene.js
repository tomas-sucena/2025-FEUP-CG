import { CGFscene, CGFcamera, CGFaxis, CGFtexture } from '../lib/CGF.js';

import { MyColor } from './utils/MyColor.js';
import { MyBuilding } from './objects/building/MyBuilding.js';
import { MyHeli } from './objects/helicopter/MyHeli.js';
import { MyPanorama } from './objects/MyPanorama.js';
import { MyRectangle } from './objects/shapes/MyRectangle.js';
import { MyForest } from './objects/forest/MyForest.js';
import { MyTerrain } from './objects/MyTerrain.js';
import { MyHeliController } from './controllers/MyHeliController.js';

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
     * Fetches a texture and, loading it beforehand if it isn't already a part of the scene.
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
        this.selectedObject = 'Terrain';

        this.initCameras();
        this.initLights();
        this.initObjects();

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
            vec3.fromValues(0, 0, 0),
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

        /** The forest */
        this.forests = {
            front: new MyForest({
                scene: this,
                width: 370,
                depth: 120,
                rows: 6,
                columns: 17,
                maxRows: 12,
                maxColumns: 37,
                colors: {
                    crown: MyColor.hex('#688f4e'),
                    trunk: MyColor.hex('#6e4300'),
                },
                textures: {
                    log: './assets/log.jpg',
                    crown: './assets/leaves.jpg',
                },
            }),
            back: new MyForest({
                scene: this,
                width: 400,
                depth: 100,
                rows: 5,
                columns: 10,
                maxRows: 10,
                maxColumns: 40,
                colors: {
                    crown: MyColor.hex('#688f4e'),
                    trunk: MyColor.hex('#6e4300'),
                },
                textures: {
                    log: './assets/log.jpg',
                    crown: './assets/leaves.jpg',
                },
            }),
        };

        /** The fire department helicopter */
        this.helicopter = new MyHeli({
            scene: this,
            color: MyColor.RGB(255, 255, 255),
            position: [
                -this.terrain.lake.width - this.building.depth,
                this.building.height,
                0,
            ],
            textures: {
                metal: './assets/metallic.jpg',
                cockpit: './assets/helicopter.png',
                tail: './assets/tail.png',
                frosted_glass: './assets/frosted_glass.jpg',
            },
        });

        this.heliController = new MyHeliController({
            scene: this,
            helicopter: this.helicopter,
        });

        this.objects = {
            'Terrain': this.terrain,
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

    updateCamera() {
        this.camera.setTarget(this.helicopter.position);
    }

    update(time) {
        this.heliController.control();
        this.helicopter.update();
        this.terrain.update((time / 100) % (100 * Math.PI));
    }

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
        this.updateCamera();

        // ---- BEGIN Primitive drawing section
        if (this.displayAxis) {
            this.axis.display();
        }

        this.objects[this.selectedObject].scale(
            this.scaleFactor,
            this.scaleFactor,
            this.scaleFactor,
        );

        this.skysphere.display();
        this.terrain.rotate(-Math.PI / 2, 1, 0, 0).display();
        this.building
            .rotate(Math.PI / 2, 0, 1, 0)
            .translate(-this.terrain.lake.width - this.building.depth, 0, 0)
            .display();
        this.helicopter.display();

        // display the forests
        this.forests.front
            .translate(
                0,
                0,
                this.forests.front.depth / 2 + 1.4 * this.terrain.lake.depth,
            )
            .display();
        this.forests.back
            .translate(0, 0, -200 + this.forests.back.depth / 2)
            .display();
        // ---- END Primitive drawing section
    }
}
