import { CGFappearance } from '../../lib/CGF.js';
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
        this.diamond = new MyDiamond(scene);
        this.parallelogram = new MyParallelogram(scene);
        this.triangle = new MyTriangle(scene);
        this.bigTriangle = new MyTriangleBig(scene);
        this.smallTriangle = new MyTriangleSmall(scene);
        this.initMaterials();
    }

    initMaterials() {
        this.greenMaterial = new CGFappearance(this.scene);
        this.greenMaterial.setAmbient(0, 1, 0, 1);
        this.greenMaterial.setSpecular(0, 1, 0, 1);
        this.greenMaterial.setDiffuse(0, 1, 0, 1);
        this.greenMaterial.setShininess(10.0);

        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setAmbient(0, 0.5, 1, 1);
        this.blueMaterial.setSpecular(0, 0.5, 1, 1);
        this.blueMaterial.setDiffuse(0, 0.5, 1, 1);
        this.blueMaterial.setShininess(10.0);

        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setAmbient(1, 27 / 255, 27 / 255, 1);
        this.redMaterial.setSpecular(1, 27 / 255, 27 / 255, 1);
        this.redMaterial.setDiffuse(1, 27 / 255, 27 / 255, 1);
        this.redMaterial.setShininess(10.0);

        this.orangeMaterial = new CGFappearance(this.scene);
        this.orangeMaterial.setAmbient(1, 0.5, 0, 1);
        this.orangeMaterial.setSpecular(1, 0.5, 0, 1);
        this.orangeMaterial.setDiffuse(1, 0.5, 0, 1);
        this.orangeMaterial.setShininess(10.0);

        this.yellowMaterial = new CGFappearance(this.scene);
        this.yellowMaterial.setAmbient(1, 1, 0, 1);
        this.yellowMaterial.setSpecular(1, 1, 0, 1);
        this.yellowMaterial.setDiffuse(1, 1, 0, 1);
        this.yellowMaterial.setShininess(10.0);   
        
        this.purpleMaterial = new CGFappearance(this.scene);
        this.purpleMaterial.setAmbient(150 / 255, 80 / 255, 190 / 255, 1);
        this.purpleMaterial.setSpecular(150 / 255, 80 / 255, 190 / 255, 1);
        this.purpleMaterial.setDiffuse(150 / 255, 80 / 255, 190 / 255, 1);
        this.purpleMaterial.setShininess(10.0);   

        this.pinkMaterial = new CGFappearance(this.scene);
        this.pinkMaterial.setAmbient(1, 0.5, 207 / 255, 1);
        this.pinkMaterial.setSpecular(1, 0.5, 207 / 255, 1);
        this.pinkMaterial.setDiffuse(1, 0.5, 207 / 255, 1);
        this.pinkMaterial.setShininess(10.0);   
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
        this.greenMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix();

        // display the parallelogram
        this.yellowMaterial.apply();
        this.parallelogram
            .rotate(Math.PI / 4, 0, 0, 1)
            .scale(-1, 1, 1)
            .translate(0, Math.sqrt(2), 0)
            .display();

        // display the triangle
        this.pinkMaterial.apply()
        this.triangle
            .scale(-1, 1, 1)
            .translate(1, 1 + Math.sqrt(2), 0)
            .display();

        // display the big triangles
        this.orangeMaterial.apply()
        this.bigTriangle
            .rotate(-Math.PI / 2, 0, 0, 1)
            .translate(0, -2, 0)
            .display()

        this.blueMaterial.apply()
        this.bigTriangle
            .rotate((-3 * Math.PI) / 4, 0, 0, 1)
            .translate(2 - Math.sqrt(2), -2 - Math.sqrt(2), 0)
            .display();

        // display the small triangles
        this.purpleMaterial.apply()
        this.smallTriangle
            .rotate(Math.PI / 2, 0, 0, 1)
            .translate(0, -1, 0)
            .display()

        this.redMaterial.apply()
        this.smallTriangle
            .rotate(-Math.PI / 2, 0, 0, 1)
            .translate(-1, -2, 0)
            .display();
    }
}
