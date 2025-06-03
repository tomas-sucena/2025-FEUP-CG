export const MyFireAnimations = {
    /**
     * Undulates over time to simulate an active fire.
     * @param {number} time - the elapsed time
     */
    idle: function (time) {
        this.shader.setUniformsValues({ uTime: time });
    },
    /**
     * Becomes smaller due to being put out.
     */
    putOut: function () {
        if (this.flameScale < 0) {
            this.flameScale = 0;
            this.animation = 'extinguished';
        } else {
            this.flameScale -= 0.2;
        }
    },
    /**
     * Is no longer animated.
     */
    extinguished: function () {},
};
