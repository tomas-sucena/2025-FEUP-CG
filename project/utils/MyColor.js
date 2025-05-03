export const MyColor = {
    /**
     * Initializes a color from its RGB values.
     * @param { number } r - the red component (ranging from 0 to 255)
     * @param { number } g - the green component (ranging from 0 to 255)
     * @param { number } b - the blue component (ranging from 0 to 255)
     * @returns { number[4] } an array representing a color
     */
    fromRGB: (r, g, b) => [r / 255, g / 255, b / 255, 1],
    /**
     * Initializes a color from its RGB values.
     * @param { number } r - the red component (ranging from 0 to 255)
     * @param { number } g - the green component (ranging from 0 to 255)
     * @param { number } b - the blue component (ranging from 0 to 255)
     * @param { number } a - the opacity (ranging from 0 to 1)
     * @returns { number[4] } an array representing a color
     */
    fromRGBA: (r, g, b, a) => [r / 255, g / 255, b / 255, a],
    /**
     * Initializes a color from its CMY values.
     * @param { number } c - the cyan component (ranging from 0 to 255)
     * @param { number } m - the magenta component (ranging from 0 to 255)
     * @param { number } y - the yellow component (ranging from 0 to 255)
     * @returns { number[4] } an array representing a color
     */
    fromCMY: (c, m, y) => [1 - c / 255, 1 - m / 255, 1 - y / 255, 0],
    /**
     * Initializes a color from its CMY values.
     * @param { number } c - the cyan component (ranging from 0 to 255)
     * @param { number } m - the magenta component (ranging from 0 to 255)
     * @param { number } y - the yellow component (ranging from 0 to 255)
     * @param { number } k - the key (black) component (ranging from 0 to 1)
     * @returns { number[4] } an array representing a color
     */
    fromCMYK: (c, m, y, k) => [1 - c / 255, 1 - m / 255, 1 - y / 255, 1 - k],
    /**
     * Initializes a color from its Hex color code.
     * @param { string } hex - the Hex color code
     * @returns { number[4] } an array representing a color
     */
    fromHex: (hex) => {
        // verify if the string begins with a hashtag
        const startIndex = hex[0] === '#';

        return [
            parseInt(hex.substring(startIndex, startIndex + 2), 16) / 255,
            parseInt(hex.substring(startIndex + 2, startIndex + 4), 16) / 255,
            parseInt(hex.substring(startIndex + 4), 16) / 255,
            1,
        ];
    },
};
