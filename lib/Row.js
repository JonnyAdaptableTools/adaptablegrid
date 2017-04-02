/**
 * An object representing a row of data
 * @class
 * @param {integer} rowId - The identifier of the row
 * @returns {void}
 */
var Row = function (rowId) {
  
  this.constructor = function (rowId) {
    this.rowId = rowId;
    this.data = [];
    this.visible = true; 
  }

  /**
   * Gets the row identifier
   * @returns {integer}
   */
  this.getId = function () {
    return this.rowId;
  }

  /**
   * Gets the row identifier
   * @returns {Cell[]}
   */
  this.getData = function () {
    return this.data;
  }

  /**
   * Adds a Cell object to the row
   * @param {Cell} cell - The cell to add
   * @returns {void}
   */
  this.addCell = function (cell) {
    this.data.push(cell);
  }

  /**
   * Assign a Cell object to the row at a given index
   * @param {integer} key - The position to add the Cell
   * @param {Cell} value - The cell to add
   * @returns {void}
   */
  this.setCell = function (key, value) {
    this.data[key] = value; 
  }

  /**
   * Gets the Cell at the given key position
   * @param {integer} key - The cell position
   * @returns {Cell}
   */
  this.getCell = function (key) {
    return this.data[key];
  }

  /**
   * Set the given row to be visible
   * @param {AdaptableGrid} grid - A reference to the grid
   * @returns {void}
   */
  this.setVisible = function (grid) {
    var index = grid.hiddenRows.indexOf(this);
    this.visible = true;
    grid.rows.push(this);
    grid.hiddenRows.splice(index, 1);
  }

  /**
   * Set the given row to be hidden
   * @param {AdaptableGrid} grid - A reference to the grid
   * @returns {void}
   */
  this.setHidden = function (grid) {
    var index = grid.getPositionOfRow(this);
    this.visible = false;
    grid.hiddenRows.push(this);
    grid.rows.splice(index, 1);
  }

  /**
   * Returns whether this row is visible or not
   * @returns {boolean}
   */
  this.isVisible = function () {
    return this.visible;
  }

  /**
   * Adds a class to all the cells in the row
   * @param {string} class - The class name
   * @param {AdaptableGrid} grid - The reference to the grid
   * @returns {void}
   */
  this.addCSS = function (cls, grid) {
    for (var col=0; col<this.getData().length; col++) {
      grid.getRow(this.getId()).getCell(col).cls.push(cls);
    }
  }

  return this.constructor(rowId);

}