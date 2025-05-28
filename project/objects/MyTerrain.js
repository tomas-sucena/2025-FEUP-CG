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

        // apply the geometric transformations
        this.scene.multMatrix(this.transformations);
        mat4.identity(this.transformations); // reset the transformations matrix

        this.textures.forEach((texture, index) => {
            // ensure the texture has been loaded
            if (texture.bind(index)) {
                // set the wrapping mode to REPEAT
                const gl = texture.gl;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            }
        });

        // apply the shaders
        if (this.shader) {
            this.scene.setActiveShader(this.shader);
        }

        super.render();

        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
