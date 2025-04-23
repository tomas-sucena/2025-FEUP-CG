import { MyObject } from '../MyObject.js';
import { MyCone } from '../solids/MyCone.js';

export class MyTree extends MyObject {
    constructor({
        scene,
        incline,
        radius,
        height,
        color,
    }) {
        super(scene);
        
        this.log = new MyCone({
            scene,
            radius,
            height: 0.4 * height,
            material: {
                diffuse: [86 / 255, 50 / 255, 50 / 255, 1],
                specular: [0, 0, 0, 1],
            },
        })
    }

    render() {
        this.log.display();
    }
}