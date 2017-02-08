var Column = function (columnId, friendlyName, type) {
  
  /**
   * Column.__constructor
   * Initialise the Column object
   * @constructor
   * @param {any} columnId - The column identifier
   * @param {string} friendlyName - The title of the column to display
   * @param {DataType} type - The type of the column
   * @returns {void}
   */
  this.__constructor = function (columnId, friendlyName, type) {
    this.columnId = columnId;
    this.friendlyName = friendlyName;
    this.type = type;
    this.visible = true;
  }

  /**
   * Column.getId
   * Returns the identifier of this column
   * @returns {string}
   */
  this.getId = function () {
    return this.columnId;
  }

  /**
   * Column.getFriendlyName
   * Returns the title of this column
   * @returns {string}
   */
  this.getFriendlyName = function () {
    return this.getFriendlyName;
  }

  /**
   * Column.setFriendlyName
   * Changes the title of this column
   * @param {string} friendlyName - The new name
   * @returns {void}
   */
  this.setFriendlyName = function (friendlyName) {
    this.friendlyName = friendlyName;
  }

  /**
   * Column.getType
   * Gets the data type of this column
   * @returns {DataType}
   */
  this.getType = function () {
    return this.type;
  }

  /**
   * Column.setVisible
   * Show this column
   * @returns {void}
   */
  this.setVisible = function () {
    this.visible = true;
  }

  /**
   * Column.setHidden
   * Hide this column
   * @returns {void}
   */
  this.setHidden = function () {
    this.visible = false;
  }

  /**
   * Column.isVisible
   * Returns whether this column is visible
   * @returns {void}
   */
  this.isVisible = function () {
    return this.visible;
  }

  /**
   * Column.addCSS
   * Adds a class to all the cells in the column
   * @param {string} class - The class name
   * @param {AdaptableGrid} grid - The reference to the grid
   * @returns {void}
   */
  this.addCSS = function (cls, grid) {
    var pos = grid.getPositionOfColumn(this);
    for (var row=0; row<grid.rows.length; row++) {
      grid.cellToElement(row, pos).addClass(cls);
    }
  }

  return this.__constructor(columnId, friendlyName, type);

}