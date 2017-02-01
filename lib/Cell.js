var Cell = function (row, col) {

  /**
   * Cell.__constructor
   * Initialise the cell object
   * @constructor
   * @param {integer} index - The index of the cell
   * @returns {Cell}
   */
  this.__constructor = function (row, col) {
    this.row = row;
    this.col = col;
  }

  /**
   * Cell.setValue
   * Sets the value of the current cell
   * @param {any} v - Any type can be in the cell
   * @returns {void}
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
   * @returns {void}
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
   * @param {AdaptableGrid} grid - A reference to the containing grid
   * @returns {string}
   */
  this.getFormattedValue = function (grid) {
    format_type = this.format.split("{");
    switch (format_type[0]) {
      case "$price":
        currencyCol = grid.getColumnFromId(format_type[1].split("}")[0]);
        currencyColIndex = grid.getPositionOfColumn(currencyCol);
        return CurrencyUtil.formatNumber(this.getValue(), grid.getRow(this.row).getCell(currencyColIndex).getValue());
      case "$num":
        return this.getValue().toFixed(format_type[1].split("}")[0]);
      case "$date":
        dateFormat = format_type[1].split("}")[0];
        return '<input type="text" class="invisible adaptablegrid-datepicker" blotter-format="'+format_type[1].split("}")[0]+'"' +
            'readonly="readonly" value="' + moment(this.getValue()).format(dateFormat) + '" />';
      case "$bool":
        return '<input type="checkbox" class="adaptablegrid-checkbox" '+(this.getValue() ? 'checked="checked"' : '')+' />';
      default:
        return this.getValue();
    }
  }

  return this.__constructor(row, col);

}