import { MyObject } from './MyObject.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends MyObject {
    constructor(scene) {
        super(scene);

        this.quad = new MyQuad(scene);
    }

    render() {
        // front square
        this.quad
            .translate(0, 0, 0.5)
            .display()

        // back square
        this.quad
            .rotate(Math.PI, 0, 1, 0)
            .translate(0, 0, -0.5)
            .display()        

        // right square
        this.quad
            .rotate(Math.PI/2, 0, 1, 0)
            .translate(0.5, 0, 0)
            .display()       
            
        // left square
        this.quad
            .rotate(-Math.PI/2, 0, 1, 0)
            .translate(-0.5, 0, 0)
            .display()  

        // top square
        this.quad
            .rotate(-Math.PI/2, 1, 0, 0)
            .translate(0, 0.5, 0)
            .display()    

        // bottom square
        this.quad
            .rotate(Math.PI/2, 1, 0, 0)
            .translate(0, -0.5, 0)
            .display()   
            
    }


}
