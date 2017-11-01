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
    this.readOnly = false;
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
   * @returns {boolean}
   */
  this.isVisible = function () {
    return this.visible;
  }

  /**
   * set to be editable
   * @returns {void}
   */
  this.setColumnNotReadOnly = function () {
    this.readOnly = true;
  }

  /**
   * forbid editing on this column
   * @returns {void}
   */
  this.setColumnReadOnly = function () {
    this.readOnly = false;
  }

  /**
   * Returns whether this column is editable
   * @returns {boolean}
   */
  this.isColumnReadOnly = function () {
    return this.readOnly;
  }


  /**
   * Adds a class to all the cells in the column
   * @param {string} class - The class name
   * @param {AdaptableGrid} grid - The reference to the grid
   * @returns {void}
   */
  this.addClass = function (cls, grid) {
    var pos = grid.getPositionOfColumn(this);
    for (var row=0; row<grid.rows.length; row++) {
      grid.getRow(row).getCell(pos).addClass(cls);
    }
  }

  /**
   * Removes a class from all the cells in the column
   * @param {string} class - The class name
   * @param {AdaptableGrid} grid - The reference to the grid
   * @returns {void}
   */
  this.removeClass = function (cls, grid) {
    var pos = grid.getPositionOfColumn(this);
    for (var row=0; row<grid.rows.length; row++) {
      grid.getRow(row).getCell(pos).removeClass(cls);
    }
  }

  return this.__constructor(columnId, friendlyName, type);

}