import { MyObject } from './MyObject.js';

/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends MyObject {
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
        ];
        
        //Counter-clockwise reference of vertices
        this.indices = [
            // front square
            0, 1, 2,
            1, 3, 2,

            // back square
            4, 6, 5,
            5, 6, 7,

            // right square
            1, 5, 3,
            5, 7, 3,

            // left square
            4, 0, 6,
            0, 2, 6,

            // top square
            2, 3, 6,
            3, 7, 6,

            // bottom square
            0, 4, 1,
            1, 4, 5
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
