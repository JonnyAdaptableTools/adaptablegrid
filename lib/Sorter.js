/**
 * Configures a new sort
 * @class
 * @param {object[]} data - The sort data to show the priority of columns
 * @returns {void}
 * @example new Sorter([
 *  { column: "currency", order: ["GBP", "AUD", "CAD", "USD", "EUR"] },
 *  { column: "id", order: true }
 * ]);
 */
var Sorter = function (data) {

  this.__construct = function (data) {
    this.data = data;
    return this;
  }

  /**
   * Run the sort and re-renders the grid
   * @param {Grid} grid - The grid to sort
   * @param {function} [callback] - The function to run after sorting is finished
   */
  this.process = function (grid, callback) {
    debug.start("Sorter.process");
    if (typeof this.data == "function") {
      sortableRows = grid.rows.slice(1, grid.rows.length);
      sortableRows.sort(this.data);
      headerRow = grid.rows[0];
      grid.rows = sortableRows;
      grid.rows.unshift(headerRow);
    }
    else {
      this.prepare(grid);
      this.shuffle(grid);
      this.cleanUp(grid);
    }
    PageUtil.resetPages.bind(grid)();
    PageUtil.getTotalPages.bind(grid)();
    callback = callback || function () {};
    grid.render(callback.bind(grid));
    debug.end("Sorter.process");
  }

  /**
   * Prepares the sort by converting any strings to numbers for fast sort
   * @param {Grid} grid - The grid to sort
   * @returns {void}
   */
  this.prepare = function (grid) {
    
    debug.start("Sorter.prepare");
    this.columnIndex = [];
    this.columnFormat = [];
    this.columnSortBy = [];
    for (var i=0; i<this.data.length; i++) {
      
      // Find the index and format of this column
      this.columnIndex[i] = grid.getPositionOfColumn(this.data[i].column);
      this.columnFormat[i] = grid.columns[this.columnIndex[i]].getType();
      if (this.columnFormat[i] == DataType.String) {
        SortUtil.getColumnIndexes.bind(grid, this.columnIndex[i])();
        SortUtil.columnToIndexes.bind(grid, this.columnIndex[i])();
      }
      if (Array.isArray(this.data[i].order)) {
        this.data[i].order = this.data[i].order.map(function (x) {
          return grid.columnValueToIndex[this.columnIndex[i]][x];
        }, this);
      }

      this.columnSortBy[i] = this.data[i].order;
      
      if (Array.isArray(this.data[i].order)) {
        // Any remaining values in this column sort ascendingly
        for (j=0; j<grid.columnIndexToValue[this.columnIndex[i]].length; j++) {
          if (this.columnSortBy[i].indexOf(j) == -1) {
            this.columnSortBy[i].push(j);
          }
        }
      }

    }
    debug.end("Sorter.prepare");

  }

  /**
   * Puts the grid back to original state by undoing any action from Sort.prepare
   * @param {Grid} grid - The grid to sort
   * @returns {void}
   */
  this.cleanUp = function (grid) {
    debug.start("Sorter.cleanUp");
    for (i=0; i<data.length; i++) {
      if (this.columnFormat[i] == DataType.String) {
        SortUtil.indexesToColumn.bind(grid, this.columnIndex[i])();
      }
    }
    debug.end("Sorter.cleanUp");
  }

  /**
   * Use the appropriate algorithm to order the rows
   * Always make sure the header rows stay at the top
   * @param {Grid} grid - The grid to sort
   * @returns {void}
   */
  this.shuffle = function (grid) {
    
    debug.start("Sort.shuffle");

    grid.rows.sort(function (a, b) {
      
      if (a.getCell(this.columnIndex[0]).row == 0) { return -1; }
      if (b.getCell(this.columnIndex[0]).row == 0) { return 1; }
      
      for (i=0; i<this.columnIndex.length; i++) {
        
        if (Array.isArray(this.columnSortBy[i])) {
          value_a = this.columnSortBy[i].indexOf(a.getCell(this.columnIndex[i]).getRawValue());
          value_b = this.columnSortBy[i].indexOf(b.getCell(this.columnIndex[i]).getRawValue());
          if (value_a == -1) { value_a = this.columnSortBy[i].length; }
          if (value_b == -1) { value_b = this.columnSortBy[i].length; }
          if (value_a != value_b) {
            return value_a - value_b;
          }
        }
        else {
          value_a = a.getCell(this.columnIndex[i]).getRawValue();
          value_b = b.getCell(this.columnIndex[i]).getRawValue();
          if (value_a != value_b) {                
            if (this.columnSortBy[i]) {
              return value_a - value_b;
            }
            else {
              return value_b - value_a;
            }
          }
        }

      }            
      
    }.bind(this));
    
    debug.end("Sort.shuffle");

  }

  return this.__construct(data);

}