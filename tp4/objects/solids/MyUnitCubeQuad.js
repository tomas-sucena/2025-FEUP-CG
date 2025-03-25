import { MyObject } from '../MyObject.js';
import { MyQuad } from '../shapes/MyQuad.js';

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends MyObject {
    constructor(scene, textures) {
        super(scene);

        // objects
        this.faces = [
            new MyQuad(scene),
            new MyQuad(scene),
            new MyQuad(scene),
            new MyQuad(scene),
            new MyQuad(scene),
            new MyQuad(scene),
        ];
        this.initTextures(textures);
    }

    initTextures(textures) {
        this.faces[0].material.setTexture(textures[0]); // top
        this.faces[1].material.setTexture(textures[1]); // bottom

        // sides
        if (textures.length === 3) {
            const sideTexture = textures[2];
            this.faces.slice(2, 6).forEach(face => face.setTexture(sideTexture));
        }
        else {
            this.faces.slice(2, 6).forEach((face, index) => face.setTexture(textures[index + 2]));
        }
    }

    render() {
        // top face
        this.faces[0]
            .rotate(-Math.PI / 2, 1, 0, 0)
            .translate(0, 0.5, 0)
            .display();

        // bottom face
        this.faces[1]
            .rotate(Math.PI / 2, 1, 0, 0)
            .translate(0, -0.5, 0)
            .display();

        // front face
        this.faces[2]
            .translate(0, 0, 0.5)
            .display();

        // back face
        this.faces[3]
            .rotate(Math.PI, 0, 1, 0)
            .translate(0, 0, -0.5)
            .display();

        // right face
        this.faces[4]
            .rotate(Math.PI / 2, 0, 1, 0)
            .translate(0.5, 0, 0)
            .display();

        // left face
        this.faces[5]
            .rotate(-Math.PI / 2, 0, 1, 0)
            .translate(-0.5, 0, 0)
            .display();
    }
}
