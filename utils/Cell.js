var Cell = function (grid, index) {

    /**
     * Cell.__constructor
     * Initialise the cell object
     * @constructor
     * @param {integer} index - The index of the cell
     * @returns {Cell}
     */
    this.__constructor = function (grid, index) {
        this.grid = grid;
        this.index = index;
    }

    /**
     * Cell.setId
     * Sets the identifier of the current cell
     * @param {any} id - The identifier for this cell
     * @returns {null}
     */
    this.setId = function (id) {
        this.id = id;
    }

    /**
     * Cell.getId
     * Get the identifier of the current cell
     * @returns {any}
     */
    this.getId = function () {
        return this.id;
    }

    /**
     * Cell.setValue
     * Sets the value of the current cell
     * @param {any} v - Any type can be in the cell
     * @returns {null}
     */
    this.setValue = function (v) {
        this.val = v;
    }

    /**
     * Cell.getValue
     * Gets the value of the current cell
     * @returns {any}
     */
    this.getValue = function (v) {
        return this.val;
    }

    /**
     * Cell.setFormat
     * Sets the format of the current cell
     * @param {string} format - The format, out of: $txt, $num, $price, $date
     * @returns {null}
     */
    this.setFormat = function (f) {
        this.format = f;
    }

    /**
     * Cell.getFormat
     * Gets the format of the current cell
     * @returns {string}
     */
    this.getFormat = function () {
        return this.format;
    }

    /**
     * Cell.getFormattedValue
     * Displays the value into the correct displayed form, using the given format
     * @returns {string}
     */
    this.getFormattedValue = function () {
        var format_type = this.format.split("{");
        if (format_type[0] == "$price") {
            currencyCellIndex = (Math.floor(this.index/this.grid.width) * this.grid.width) + this.grid.columns[format_type[1].split("}")[0]];
            return Currency.formatNumber(this.getValue(), this.grid.cells[currencyCellIndex].getValue());
        }
        else if (this.format == "$txt") {
            return this.getValue();
        }
    }

    return this.__constructor(grid, index);

}