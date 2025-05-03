export const MyColor = {
    /**
     * Initializes a color from its RGB values.
     * @param { number } r - the red component (ranging from 0 to 255)
     * @param { number } g - the green component (ranging from 0 to 255)
     * @param { number } b - the blue component (ranging from 0 to 255)
     * @returns { number[4] } an array representing a color
     */
    RGB: (r, g, b) => [r / 255, g / 255, b / 255, 1],
    /**
     * Initializes a color from its RGB values.
     * @param { number } r - the red component (ranging from 0 to 255)
     * @param { number } g - the green component (ranging from 0 to 255)
     * @param { number } b - the blue component (ranging from 0 to 255)
     * @param { number } a - the opacity (ranging from 0 to 1)
     * @returns { number[4] } an array representing a color
     */
    RGBA: (r, g, b, a) => [r / 255, g / 255, b / 255, a],
    /**
     * Initializes a color from its CMY values.
     * @param { number } c - the cyan component (ranging from 0 to 255)
     * @param { number } m - the magenta component (ranging from 0 to 255)
     * @param { number } y - the yellow component (ranging from 0 to 255)
     * @returns { number[4] } an array representing a color
     */
    CMY: (c, m, y) => [1 - c / 255, 1 - m / 255, 1 - y / 255, 0],
    /**
     * Initializes a color from its CMY values.
     * @param { number } c - the cyan component (ranging from 0 to 255)
     * @param { number } m - the magenta component (ranging from 0 to 255)
     * @param { number } y - the yellow component (ranging from 0 to 255)
     * @param { number } k - the key (black) component (ranging from 0 to 1)
     * @returns { number[4] } an array representing a color
     */
    CMYK: (c, m, y, k) => [1 - c / 255, 1 - m / 255, 1 - y / 255, 1 - k],
    /**
     * Initializes a color from its Hex color code.
     * @param { number | string } hex - the Hex color code
     * @returns { number[4] } an array representing a color
     */
    hex: (hex) => {
        // if the parameter is a string, convert it to a number
        if (typeof hex === 'string') {
            hex = parseInt(hex.substring(hex[0] === '#'), 16);
        }

        return [
            ((hex >> 16) & 255) / 255,
            ((hex >> 8) & 255) / 255,
            (hex & 255) / 255,
            1,
        ];
    },
};
