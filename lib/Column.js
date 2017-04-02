/**
 * An object representing a column of data
 * @class
 * @param {any} columnId - The column identifier
 * @param {string} friendlyName - The title of the column to display
 * @param {DataType} type - The type of the column
 * @returns {void}
 */
var Column = function (columnId, friendlyName, type) {
  
  this.__constructor = function (columnId, friendlyName, type) {
    this.columnId = columnId;
    this.friendlyName = friendlyName;
    this.type = type;
    this.visible = true;
  }

  /**
   * Returns the identifier of this column
   * @returns {string}
   */
  this.getId = function () {
    return this.columnId;
  }

  /**
   * Returns the title of this column
   * @returns {string}
   */
  this.getFriendlyName = function () {
    return this.friendlyName;
  }

  /**
   * Changes the title of this column
   * @param {string} friendlyName - The new name
   * @returns {void}
   */
  this.setFriendlyName = function (friendlyName) {
    this.friendlyName = friendlyName;
  }

  /**
   * Gets the data type of this column
   * @returns {DataType}
   */
  this.getType = function () {
    return this.type;
  }

  /**
   * Show this column
   * @returns {void}
   */
  this.setVisible = function () {
    this.visible = true;
  }

  /**
   * Hide this column
   * @returns {void}
   */
  this.setHidden = function () {
    this.visible = false;
  }

  /**
   * Returns whether this column is visible
   * @returns {void}
   */
  this.isVisible = function () {
    return this.visible;
  }

  /**
   * Adds a class to all the cells in the column
   * @param {string} class - The class name
   * @param {AdaptableGrid} grid - The reference to the grid
   * @returns {void}
   */
  this.addCSS = function (cls, grid) {
    var pos = grid.getPositionOfColumn(this);
    for (var row=0; row<grid.rows.length; row++) {
      grid.getRow(row).getCell(pos).cls.push(cls);
    }
  }

  return this.__constructor(columnId, friendlyName, type);

}