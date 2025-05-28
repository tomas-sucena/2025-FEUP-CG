import { MyRectangle } from './shapes/MyRectangle.js';

export class MyTerrain extends MyRectangle {
    constructor({ scene, size, textures }) {
        super({
            scene,
            width: size,
            height: size,
            rows: size / 2,
            columns: size / 2,
            shader: {
                vert: './shaders/terrain.vert',
                frag: './shaders/terrain.frag',
            },
        });

        this.textures = textures.map((textureURL) =>
            this.scene.getTexture(textureURL),
        );

        this.shader.setUniformsValues({
            uMaskSampler: 0,
            uGrassSampler: 1,
            uLakeSampler: 2,
            size,
        });
    }

    get lakeRadius() {
        return 0.15 * this.width; 
    }

    update(time) {
        this.shader.setUniformsValues({ uTime: time });
    }

    display() {
        this.scene.pushMatrix();

        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_S, 'REPEAT');
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_WRAP_T, 'REPEAT');

        // apply the geometric transformations
        this.scene.multMatrix(this.transformations);
        mat4.identity(this.transformations); // reset the transformations matrix

        this.textures.forEach((texture, index) => texture.bind(index));

        // apply the shaders
        if (this.shader) {
            this.scene.setActiveShader(this.shader);
        }

        super.render();

        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
