import {
    CGFscene,
    CGFcamera,
    CGFaxis,
    CGFappearance,
    CGFtexture,
    CGFshader,
} from '../lib/CGF.js';
import { Teapot } from './objects/Teapot.js';
import { MyPlane } from './objects/MyPlane.js';

/**
 * getStringFromUrl(url)
 * Function to load a text file from a URL (used to display shader sources)
 */
function getStringFromUrl(url) {
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open('GET', url, false);
    xmlHttpReq.send();
    return xmlHttpReq.responseText;
}

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
    constructor() {
        super();
        this.texture = null;

        // initial configuration of interface
        this.selectedObject = 'Plane';
        this.wireframe = false;
        this.selectedShader = 'Water';
        this.showShaderCode = false;
        this.scaleFactor = 5.0;
    }

    init(application) {
        // main initialization
        super.init(application);

        this.initCameras();

        this.initLights();

        this.gl.clearDepth(10000.0);
        this.gl.clearColor(1, 1, 1, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        // objects initialization
        this.axis = new CGFaxis(this);
        this.enableTextures(true);

        // Object interface variables
        this.displayAxis = true;
        this.objects = {
            'Teapot': new Teapot(this),
            'Plane': new MyPlane(this, 50),
        };

        // Materials and textures initialization
        const material = new CGFappearance(this);
        material.setAmbient(0.3, 0.3, 0.3, 1);
        material.setDiffuse(0.7, 0.7, 0.7, 1);
        material.setSpecular(0.0, 0.0, 0.0, 1);
        material.setShininess(120);

        this.texture = new CGFtexture(this, 'images/waterTex.jpg');
        material.setTexture(this.texture);
        material.setTextureWrap('REPEAT', 'REPEAT');

        this.texture2 = new CGFtexture(this, 'images/waterMap.jpg');

        // apply the material to all objects
        Object.values(this.objects).forEach(
            (object) => (object.material = material),
        );

        // shaders
        this.shaders = {
            'Flat Shading': new CGFshader(
                this.gl,
                'shaders/flat.vert',
                'shaders/flat.frag',
            ),
            'Passing a scale as uniform': new CGFshader(
                this.gl,
                'shaders/uScale.vert',
                'shaders/uScale.frag',
            ),
            'Passing a varying parameter from VS -> FS': new CGFshader(
                this.gl,
                'shaders/varying.vert',
                'shaders/varying.frag',
            ),
            'Simple texturing': new CGFshader(
                this.gl,
                'shaders/texture1.vert',
                'shaders/texture1.frag',
            ),
            'Multiple textures in the FS': new CGFshader(
                this.gl,
                'shaders/texture2.vert',
                'shaders/texture2.frag',
            ),
            'Multiple textures in VS and FS': new CGFshader(
                this.gl,
                'shaders/texture3.vert',
                'shaders/texture3.frag',
            ),
            'Animation example': new CGFshader(
                this.gl,
                'shaders/texture3anim.vert',
                'shaders/texture3anim.frag',
            ),
            'Sepia': new CGFshader(
                this.gl,
                'shaders/texture1.vert',
                'shaders/sepia.frag',
            ),
            'Convolution': new CGFshader(
                this.gl,
                'shaders/texture1.vert',
                'shaders/convolution.frag',
            ),
            'Yellow & Blue': new CGFshader(
                this.gl,
                'shaders/yellow&blue.vert',
                'shaders/yellow&blue.frag',
            ),
            'Grayscale': new CGFshader(
                this.gl,
                'shaders/texture1.vert',
                'shaders/grayscale.frag',
            ),
            'Water': new CGFshader(
                this.gl,
                'shaders/water.vert',
                'shaders/water.frag',
            ),
        };

        // additional texture will have to be bound to texture unit 1 later, when using the shader, with "this.texture2.bind(1);"
        this.shaders['Multiple textures in the FS'].setUniformsValues({
            uSampler2: 1,
        });
        this.shaders['Multiple textures in VS and FS'].setUniformsValues({
            uSampler2: 1,
        });
        this.shaders['Animation example'].setUniformsValues({
            uSampler2: 1,
            timeFactor: 0,
        });
        this.shaders['Yellow & Blue'].setUniformsValues({
            timeFactor: 0,
            scaleFactor: this.scaleFactor,
        });
        this.shaders['Water'].setUniformsValues({
            uSampler2: 1,
            timeFactor: 0,
            scaleFactor: this.scaleFactor,
        });

        // shader code panels references
        this.shadersDiv = document.getElementById('shaders');
        this.vShaderDiv = document.getElementById('vshader');
        this.fShaderDiv = document.getElementById('fshader');

        // force initial setup of shader code panels
        this.onShaderCodeVizChanged(this.showShaderCode);
        this.onSelectedShaderChanged(this.selectedShader);

        // set the scene update period
        // (to invoke the update() method every 50ms or as close as possible to that )
        this.setUpdatePeriod(50);
    }

    // configure cameras
    initCameras() {
        this.camera = new CGFcamera(
            0.4,
            0.1,
            500,
            vec3.fromValues(20, 20, 100),
            vec3.fromValues(0, 0, 0),
        );
    }

    // initialize lights
    initLights() {
        if (this.lights.length > 0) {
            this.lights[0].setPosition(0, 0, 10, 1);
            this.lights[0].setAmbient(0.2, 0.2, 0.2, 1);
            this.lights[0].setDiffuse(0.9, 0.9, 1.0, 1);
            this.lights[0].setSpecular(0, 0, 0, 1);
            this.lights[0].enable();
            this.lights[0].update();
        }
    }

    // Interface event handlers

    // Show/hide shader code
    onShaderCodeVizChanged(v) {
        this.shadersDiv.style.display = v ? 'block' : 'none';
    }

    // Called when selected shader changes
    onSelectedShaderChanged(v) {
        // update shader code
        this.vShaderDiv.innerHTML = `<xmp>${getStringFromUrl(this.shaders[v].vertexURL)}</xmp>`;
        this.fShaderDiv.innerHTML = `<xmp>${getStringFromUrl(this.shaders[v].fragmentURL)}</xmp>`;

        // update scale factor
        this.onScaleFactorChanged(this.scaleFactor);
    }

    // called when a new object is selected
    onSelectedObjectChanged(v) {
        // update wireframe mode when the object changes
        this.onWireframeChanged(this.wireframe);
    }

    // updates the selected object's wireframe mode
    onWireframeChanged(v) {
        if (v) this.objects[this.selectedObject].setLineMode();
        else this.objects[this.selectedObject].setFillMode();
    }

    // called when the scale factor changes on the interface
    onScaleFactorChanged(v) {
        this.shaders[this.selectedShader].setUniformsValues({
            scaleFactor: this.scaleFactor,
        });
    }

    // called periodically (as per setUpdatePeriod() in init())
    update(t) {
        if (
            ['Animation example', 'Yellow & Blue', 'Water'].includes(
                this.selectedShader,
            )
        ) {
            // Dividing the time by 100 "slows down" the variation (i.e. in 100 ms timeFactor increases 1 unit).
            // Doing the modulus (%) by 100 makes the timeFactor loop between 0 and 99
            // ( so the loop period of timeFactor is 100 times 100 ms = 10s ; the actual animation loop depends on how timeFactor is used in the shader )
            this.shaders[this.selectedShader].setUniformsValues({
                timeFactor: (t / 100) % 100,
            });
        }
    }

    // main display function
    display() {
        // Clear image and depth buffer every time we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation)
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // Update all lights used
        this.lights[0].update();

        // Draw axis
        if (this.displayAxis) {
            this.axis.display();
        }

        // activate selected shader
        this.setActiveShader(this.shaders[this.selectedShader]);

        // bind additional texture to texture unit 1
        this.texture2.bind(1);

        // display the object
        const object = this.objects[this.selectedObject]
            .rotate(-Math.PI / 2, 1, 0, 0);

        if (this.selectedObject === 'Teapot') {
            // teapot (scaled and rotated to conform to our axis)
            object
                .scale(0.5, 0.5, 0.5)
                .translate(0, -6, 0);
        } else {
            // plane
            object.scale(25, 25, 25);
        }

        object.display();

        // restore default shader (will be needed for drawing the axis in next frame)
        this.setActiveShader(this.defaultShader);
    }
}
