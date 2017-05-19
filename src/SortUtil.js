/**
 * Defines some static events for sorting
 * @namespace
 */
var SortUtil = {

  /**
   * Add event listeners for sorting columns
   * @static
   * @this AdaptableGrid
   * @returns {void}
   */
  events: function () {
     
    $(this).find('.AdaptableGrid-header').addClass('AdaptableGrid-sortable');
    $(this).find('.AdaptableGrid-header').on('click', SortUtil.clickColumn.bind(this));

  },

  /**
   * Callback function after clicking a column title
   * Create a Sorter object and sort the column
   * @static
   * @this AdaptableGrid
   * @param {object} header - The element that was clicked
   * @returns {void}
   */
  clickColumn: function (header) {

    columnIndex = $(header.target).attr('blotter').split("abjs:0:")[1];
    
    if ($(header.target).hasClass('AdaptableGrid-sort-asc')) {
      c = 'AdaptableGrid-sort-des';
    }
    else {
      c = 'AdaptableGrid-sort-asc';
    }
    
    var s = new Sorter([{
      column: this.columns[columnIndex],
      order: (c == 'AdaptableGrid-sort-asc')
    }]);
    
    s.process(this, function () {
      var headerCell = this.getRow(0).getCell(columnIndex);
      this.cellToElement(headerCell).addClass('AdaptableGrid-sort').addClass(c);
      this.options.ongridsort(s.data);
    });

  },

  /**
   * Convert all the cells in a particular column to a number
   * @static
   * @this AdaptableGrid
   * @param {integer} ind - The column index
   * @returns {void}
   */
  columnToIndexes: function (ind) {
    this.options.debug.start("SortUtil.columnToIndexes");
    for (var i=1; i<this.rows.length; i++) {
      indexOfValue = this.columnValueToIndex[ind][this.getRow(i).getCell(ind).getRawValue()];
      this.getRow(i).getCell(ind).setValue(indexOfValue);
    }
    this.options.debug.end("SortUtil.columnToIndexes");
  },

  /**
   * Convert all the cells in a particular column from a number back to their original value
   * @static
   * @this AdaptableGrid
   * @param {integer} ind - The column index
   * @returns {void}
   */
  indexesToColumn: function (ind) {
    this.options.debug.start("SortUtil.indexesToColumn");
    for (var i=1; i<this.rows.length; i++) {
      this.getRow(i).getCell(ind).setValue(this.columnIndexToValue[ind][this.getRow(i).getCell(ind).getRawValue()]);
    }
    this.options.debug.end("SortUtil.indexesToColumn");
  },

  /**
   * Generate two maps to turn text to an index and index back to a date
   * @static
   * @this AdaptableGrid
   * @param {integer} columnIndex - The column index used for sorting
   * @returns {void}
   */
  getColumnIndexes: function (ind) {
    this.options.debug.start("SortUtil.getColumnIndexes");
    
    if (this.columnIndexToValue[ind] == null) {

      var tColI2V = [];
      tColI2V = $.map(this.rows, function (i, n) {
        if (n > 0) {
          return i.getCell(ind).getRawValue();
        }
      });

      // Get unique values of this array
      tColI2V = tColI2V.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) {
          accum.push(current);
        }
        return accum;
      }, []);

      tColI2V.sort();
      
      var key;
      var tmpArr = {};
      
      for (var i=0; i<tColI2V.length; i++) {
        tmpArr[tColI2V[i]] = i;
      }
      
      this.columnIndexToValue[ind] = tColI2V;
      this.columnValueToIndex[ind] = tmpArr;

    }

    this.options.debug.end("SortUtil.getColumnIndexes");
  }

}