import { MyObject } from '../MyObject.js';

/**
 * MyTriangleBig
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleBig extends MyObject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -2, 0, 0,
            2, 0, 0,
            0, 2, 0,
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            // front
            0, 1, 2,

            // back
            0, 2, 1,
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
