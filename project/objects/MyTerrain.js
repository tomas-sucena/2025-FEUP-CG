import { MyRectangle } from './shapes/MyRectangle.js';

export class MyTerrain extends MyRectangle {
    constructor({ scene, size, textures }) {
        super({
            scene,
            width: size,
            height: size,
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
        });
    }

    display() {
        this.textures.forEach((texture, index) => texture.bind(index));
        super.display();
    }
}
