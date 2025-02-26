import { CGFobject } from '../../lib/CGF.js';

import { MyDiamond } from './MyDiamond.js';

/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        
        // objects
        this.diamond = new MyDiamond(scene);
    }

    display() {
        // display the diamond
        const rotationMatrix = [
            Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), 0, 0,
            -Math.sin(Math.PI / 4), Math.cos(Math.PI / 4), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];

        const translationMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 1, 0, 1,
        ];

        this.scene.pushMatrix();
        this.scene.multMatrix(rotationMatrix); // rotate it 45 degrees
        this.scene.multMatrix(translationMatrix); // move it 1 unit in the y-axis
        this.diamond.display();
        this.scene.popMatrix();
    }
}

