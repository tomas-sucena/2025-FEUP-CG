import { MyObject } from './MyObject.js';

import { MyDiamond } from './shapes/MyDiamond.js';
import { MyParallelogram } from './shapes/MyParallelogram.js';
import { MyTriangle } from './shapes/MyTriangle.js';
import { MyTriangleBig } from './shapes/MyTriangleBig.js';
import { MyTriangleSmall } from './shapes/MyTriangleSmall.js';

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends MyObject {
    constructor(scene) {
        super(scene);

        // objects
        this.greenDiamond = new MyDiamond(scene);
        this.yellowParallelogram = new MyParallelogram(scene);
        this.pinkTriangle = new MyTriangle(scene);
        this.bigOrangeTriangle = new MyTriangleBig(scene);
        this.bigBlueTriangle = new MyTriangleBig(scene);
        this.smallRedTriangle = new MyTriangleSmall(scene);
        this.smallPurpleTriangle = new MyTriangleSmall(scene);

        this.initMaterials();
    }

    initMaterials() {
        const texture = 'images/tangram.png';

        // green diamond
        this.greenDiamond.material.setAmbient(0, 1, 0, 1);
        this.greenDiamond.material.setDiffuse(0, 1, 0, 1);
        this.greenDiamond.material.setSpecular(0.8, 0.8, 0.8, 1);
        // prettier-ignore
        this.greenDiamond.setTexture(texture, [
            0, 0.5,
            0.25, 0.25,
            0.25, 0.75,
            0.5, 0.5,
        ]);
        
        // yellow parallelogram
        this.yellowParallelogram.material.setSpecular(1, 1, 0, 1);
        this.yellowParallelogram.material.setDiffuse(1, 1, 0, 1);
        this.yellowParallelogram.material.setAmbient(0.8, 0.8, 0.8, 1);
        // prettier-ignore 
        this.yellowParallelogram.setTexture(texture, [
            1, 1,
            0.5, 1,
            0.25, 0.75,
            0.75, 0.75,
        ]);

        // pink triangle
        this.pinkTriangle.material.setAmbient(1, 0.5, 207 / 255, 1);
        this.pinkTriangle.material.setDiffuse(1, 0.5, 207 / 255, 1);
        this.pinkTriangle.material.setSpecular(0.8, 0.8, 0.8, 1);
        // prettier-ignore
        this.pinkTriangle.setTexture(texture, [
            0, 1,
            0.5, 1,
            0, 0.5,
        ]);

        // orange triangle
        this.bigOrangeTriangle.material.setAmbient(1, 0.5, 0, 1);
        this.bigOrangeTriangle.material.setDiffuse(1, 0.5, 0, 1);
        this.bigOrangeTriangle.material.setSpecular(0.8, 0.8, 0.8, 1);
        // prettier-ignore
        this.bigOrangeTriangle.setTexture(texture, [
            1, 1,
            1, 0,
            0.5, 0.5,
        ]);

        // blue triangle
        this.bigBlueTriangle.material.setAmbient(0, 0.5, 1, 1);
        this.bigBlueTriangle.material.setDiffuse(0, 0.5, 1, 1);
        this.bigBlueTriangle.material.setSpecular(0.8, 0.8, 0.8, 1);
        // prettier-ignore
        this.bigBlueTriangle.setTexture(texture, [
            1, 0,
            0, 0,
            0.5, 0.5,
        ]);

        // purple triangle
        this.smallPurpleTriangle.material.setAmbient(150 / 255, 80 / 255, 190 / 255, 1);
        this.smallPurpleTriangle.material.setDiffuse(150 / 255, 80 / 255, 190 / 255, 1);
        this.smallPurpleTriangle.material.setSpecular(0.8, 0.8, 0.8, 1);
        // prettier-ignore
        this.smallPurpleTriangle.setTexture(texture, [
            0, 0,
            0, 0.5,
            0.25, 0.25,
        ]);

        // red triangle
        this.smallRedTriangle.material.setAmbient(1, 27 / 255, 27 / 255, 1);
        this.smallRedTriangle.material.setDiffuse(1, 27 / 255, 27 / 255, 1);
        this.smallRedTriangle.material.setSpecular(0.8, 0.8, 0.8, 1);
        // prettier-ignore
        this.smallRedTriangle.setTexture(texture, [
            0.25, 0.75,
            0.75, 0.75,
            0.5, 0.5,
        ]);
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
        this.greenDiamond.display();
        this.scene.popMatrix();

        // display the parallelogram
        this.yellowParallelogram
            .rotate(Math.PI / 4, 0, 0, 1)
            .scale(-1, 1, 1)
            .translate(0, Math.sqrt(2), 0)
            .display();

        // display the triangle
        this.pinkTriangle
            .scale(-1, 1, 1)
            .translate(1, 1 + Math.sqrt(2), 0)
            .display();

        // display the big triangles
        this.bigOrangeTriangle
            .rotate(-Math.PI / 2, 0, 0, 1)
            .translate(0, -2, 0)
            .display()

        this.bigBlueTriangle
            .rotate((-3 * Math.PI) / 4, 0, 0, 1)
            .translate(2 - Math.sqrt(2), -2 - Math.sqrt(2), 0)
            .display();

        // display the small triangles
        this.smallPurpleTriangle
            .rotate(Math.PI / 2, 0, 0, 1)
            .translate(0, -1, 0)
            .display()

        this.smallRedTriangle
            .rotate(-Math.PI / 2, 0, 0, 1)
            .translate(-1, -2, 0)
            .display();
    }
}
