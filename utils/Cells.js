var Cells = {

    /**
     * Cells.format
     * Converts a value into the correct displayed form, using the given format
     * @static
     * @param {string} val - The original string to convert
     * @param {string} format - The format to convert to, out of: $txt, $num, $price, $date
     * @param {object} [row] - Optional row of data, needed by some formats
     * @returns {string}
     */
    format: function (val, format, row) {
        if (p = (/\$price{([a-z]*)}/i).exec(format)) {
            return Currency.formatNumber(val, row[p[1]]);
        }
        return val;
    }

}