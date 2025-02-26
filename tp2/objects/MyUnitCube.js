import {CGFobject} from '../../lib/CGF.js';

/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            // front square
            -0.5, -0.5, 0.5, // 0
            0.5, -0.5, 0.5,  // 1
            -0.5, 0.5, 0.5,  // 2
            0.5, 0.5, 0.5,   // 3

            // back square
            -0.5, -0.5, -0.5, // 4
            0.5, -0.5, -0.5,  // 5
            -0.5, 0.5, -0.5,  // 6
            0.5, 0.5, -0.5,   // 7

            // right square
            0.5, -0.5, 0.5,   // 8
            0.5, -0.5, -0.5,  // 9
            0.5, 0.5, 0.5,    // 10
            0.5, 0.5, -0.5,   // 11

            // left square
            -0.5, -0.5, -0.5,   // 12
            -0.5, -0.5, 0.5,  // 13
            -0.5, 0.5, -0.5,    // 14
           - 0.5, 0.5, 0.5,   // 15

        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            // front square
            0, 1, 2,
            1, 3, 2,
            0, 2, 1,
            2, 3, 1,

            // back square
            4, 5, 6,
            5, 7, 6,
            4, 6, 5,
            5, 6, 7,

            // right square
            8, 9, 10,
            9, 11, 10,
            8, 10, 9,
            9, 10, 11,

            // left square
            12, 13, 14,
            13, 15, 14,
            12, 14, 13,
            13, 14, 15,

        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

