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
        this.faces = Array(6).fill().map(_ => new MyQuad(scene));
        this.initTextures(textures);
    }

    initTextures(textures) {
        this.faces[0].setTexture(textures[0]); // top
        this.faces[1].setTexture(textures[1]); // bottom

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
        // position the faces
        this.faces[0] // top
            .rotate(-Math.PI / 2, 1, 0, 0)
            .translate(0, 0.5, 0);

        this.faces[1] // bottom
            .rotate(Math.PI / 2, 1, 0, 0)
            .translate(0, -0.5, 0);

        this.faces[2] // front
            .translate(0, 0, 0.5);

        this.faces[3] // back
            .rotate(Math.PI, 0, 1, 0)
            .translate(0, 0, -0.5);

        this.faces[4] // right
            .rotate(Math.PI / 2, 0, 1, 0)
            .translate(0.5, 0, 0);

        this.faces[5] // left
            .rotate(-Math.PI / 2, 0, 1, 0)
            .translate(-0.5, 0, 0);

        // display the faces
        this.faces.forEach(face => {
            this.scene.gl.texParameteri(
                this.scene.gl.TEXTURE_2D,
                this.scene.gl.TEXTURE_MAG_FILTER,
                this.scene.gl.NEAREST,
            );
            face.display();
        });
    }
}
