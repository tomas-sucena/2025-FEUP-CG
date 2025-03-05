import { MyObject } from './MyObject.js';

import { MyDiamond } from './MyDiamond.js';
import { MyParallelogram } from './MyParallelogram.js';
import { MyTriangle } from './MyTriangle.js';
import { MyTriangleBig } from './MyTriangleBig.js';
import { MyTriangleSmall } from './MyTriangleSmall.js';

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends MyObject {
    constructor(scene) {
        super(scene);

        // objects
        this.diamond = new MyDiamond(scene);
        this.parallelogram = new MyParallelogram(scene);
        this.triangle = new MyTriangle(scene);
        this.bigTriangle = new MyTriangleBig(scene);
        this.smallTriangle = new MyTriangleSmall(scene);
    }

    render() {
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

        // display the parallelogram
        this.parallelogram
            .rotate(Math.PI / 4, 0, 0, 1)
            .scale(-1, 1, 1)
            .translate(0, Math.sqrt(2), 0)
            .display();

        // display the triangle
        this.triangle
            .scale(-1, 1, 1)
            .translate(1, 1 + Math.sqrt(2), 0)
            .display();

        // display the big triangles
        this.bigTriangle
            .rotate(-Math.PI / 2, 0, 0, 1)
            .translate(0, -2, 0)
            .display()
            .rotate((-3 * Math.PI) / 4, 0, 0, 1)
            .translate(2 - Math.sqrt(2), -2 - Math.sqrt(2), 0)
            .display();

        // display the small triangles
        this.smallTriangle
            .rotate(Math.PI / 2, 0, 0, 1)
            .translate(0, -1, 0)
            .display()
            .rotate(-Math.PI / 2, 0, 0, 1)
            .translate(-1, -2, 0)
            .display();
    }
}
