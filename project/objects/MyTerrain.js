import { MyRectangle } from './shapes/MyRectangle.js';
import { MyCone } from './solids/MyCone.js';

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

    /**
     * Returns the dimensions of the lake.
     */
    get lake() {
        return {
            width: 0.22 * this.width,
            depth: 0.13 * this.height,
        };
    }

    update(time) {
        this.shader.setUniformsValues({ uTime: time });
    }

    /**
     * Displays the terrain.
     */
    display() {
        // bind each texture to the shader
        this.textures.forEach((texture, index) => {
            // ensure the texture has been loaded
            if (texture.bind(index)) {
                // set the wrapping mode to REPEAT
                const gl = texture.gl;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            }
        });

        super.display();
    }
}
