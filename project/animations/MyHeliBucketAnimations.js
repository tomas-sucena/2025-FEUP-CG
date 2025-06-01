export const MyHeliBucketAnimations = {
    idle: function () {},
    /**
     * Opens the bottom of the bucket so the water can fall.
     */
    openBottom: function () {
        if (this.bottomAngle > Math.PI / 2) {
            this.bottomAngle = Math.PI / 2;
            this.animation = 'dropWater';
        } else {
            this.bottomAngle += Math.PI / 8;
        }
    },
    dropWater: function () {
        if (this.waterAmount < 0) {
            this.waterAmount = 0;
            this.animation = 'closeBottom';
        } else {
            this.waterAmount -= 0.1;
        }
    },
    /**
     * Closes the bottom of the bucket so the water can fall.
     */
    closeBottom: function () {
        if (this.bottomAngle < 0) {
            this.bottomAngle = 0;
            this.animation = 'idle';
        } else {
            this.bottomAngle -= Math.PI / 8;
        }
    },
};
