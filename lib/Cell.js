/**
 * An object representing an individual cell in the grid
 * @class
 * @returns {Cell}
 */
var Cell = function () {

  this.__constructor = function () {
    this.cls = [];
  }

  /**
   * Sets the value of the current cell
   * @param {any} v - Any type can be in the cell
   * @returns {void}
   */
  this.setValue = function (v) {
    this.val = v;
  }

  /**
   * Gets both the raw and formatted value of the current cell
   * @returns {any[]}
   */
  this.getValuePairs = function () {
    return [this.getRawValue(), this.getFormattedValue()];
  }

  /**
   * Gets the value of the current cell
   * @returns {any}
   */
  this.getRawValue = function () {
    return this.val;
  }

  /**
   * Sets the type of the current cell
   * @param {string} type - The type, out of: text, num, date, checkbox
   * @returns {void}
   */
  this.setType = function (t) {
    this.type = t;
  }

  /**
   * Sets the format of the current cell
   * @param {string} format - The format which will be handled by 3rd party scripts
   * @returns {void}
   */
  this.setFormat = function (f) {
    this.format = f;
  }

  /**
   * Gets the type of the current cell
   * @returns {string}
   */
  this.getType = function () {
    return this.type;
  }

  /**
   * Gets the format of the current cell
   * @returns {string}
   */
  this.getFormat = function () {
    return this.format;
  }

  /**
   * Displays the value into the correct displayed form, using the given format
   * @param {AdaptableGrid} grid - A reference to the containing grid
   * @returns {string}
   */
  this.getFormattedValue = function (grid) {
    switch (this.type) {
      case DataType.Number:
        return numeral(this.getRawValue()).format(this.format);
      case DataType.Date:
        return '<input type="text" class="invisible adaptablegrid-datepicker" blotter-format="'+this.format+'"' +
            'readonly="readonly" value="' + moment(this.getRawValue()).format(this.format) + '" />';
      case DataType.Boolean:
        return '<input type="checkbox" class="adaptablegrid-checkbox" '+(this.getRawValue() ? 'checked="checked"' : '')+' />';
      default:
        return this.getRawValue();
    }
  }

  return this.__constructor();

}