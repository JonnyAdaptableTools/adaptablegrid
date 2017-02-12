/**
 * The main class for interracting with the grid
 * @class
 * @param {object} options - A list of options
 * @returns {AdaptableGrid}
 */
$.fn.AdaptableGrid = function (options) {
  
  this.__constructor = function (options) {
    
    debug.start("AdaptableGrid.__constructor");

    // Initialise the options property with some defaults
    this.options = $.extend({
      columns: [],
      data: [],
      display: null,
      sortable: false,
      pageable: false,
      reorderable: false,
      ongridload: function () {},
      ongridsort: function (sortData) {},
      onpagechange: function (page) {},
      oncellenter: function (cell) { },
      oncellchange: function (cell, newVal, oldVal) {},
      oncolumnupdate: function (columns) {}
    }, options);

    this.columnValueToIndex = {};
    this.columnIndexToValue = {};

    this.rows = [];
    this.columns = [];
    this.hiddenRows = [];
    
    this.width = options.columns.length;
    this.height = options.data.length + 1;
    dimension = this.width * this.height;

    if (options.display == null) {
      num = this.height - 1;
    }
    else {
      num = options.display;
    }

    this.displayHeight = num + 1;

    if (this.options.pageable) {
      PageUtil.resetPages.bind(this)();
    }

    // Fix for jQuery UI datepicker.
    // Ensure that moment.js and jQuery are consistent with date formats
    $(function () {
      $.datepicker.parseDate = function(format, value) {
          return moment(value, format).toDate();
      };
      $.datepicker.formatDate = function (format, value) {
          return moment(value).format(format);
      };
    });

    this.read();
    this.render(this.options.ongridload);
    debug.end("AdaptableGrid.__constructor");
    return this;
    
  }

  /**
   * Reads in the data to create a singleton list of type Cell
   * @returns {void}
   */
  this.read = function () {
    
    debug.start("AdaptableGrid.read");
      
    for (i=0; i<this.height; i++) {

      this.rows[i] = new Row(i);
      
      if (i==0) {
        // This is the column headers
        for (j=0; j<this.width; j++) {
          this.getRow(i).setCell(j, new Cell(i, j));
          this.getRow(i).getCell(j).setValue(options.columns[j].title);
          this.getRow(i).getCell(j).setType(DataType.String);
          col = new Column(options.columns[j].field, options.columns[j].title, this.getDataType(options.columns[j].type));
          this.columns.push(col);
        }
      }
      else {
        // Regular row
        for (j=0; j<this.width; j++) {
          this.getRow(i).setCell(j, new Cell(i, j));
          this.getRow(i).getCell(j).setValue(options.data[i-1][options.columns[j].field]);
          this.getRow(i).getCell(j).setType(this.getDataType(options.columns[j].type));
          this.getRow(i).getCell(j).setFormat(options.columns[j].format);
        }
      }

    }

    debug.end("AdaptableGrid.read");

  }

  /**
   * Prints out the grid to the DOM
   * @param {function} [callback] - The function to run after rendering is finished
   * @returns {void}
   */
  this.render = function (callback) {
    
    debug.start("AdaptableGrid.render");

    var table = '<table>';
    displayedRows = 0;
    rowCounter = -1;

    // Output all the cells
    while (displayedRows < this.displayHeight) {

      rowCounter += 1;
      thisRow = rowCounter;

      // Don't print if row is invisible
      if (!this.getRow(thisRow).isVisible()) continue;

      if (thisRow == 0) {

        for (j=0; j<this.width; j++) {

          // Don't print if column is invisible
          if (!this.columns[j].isVisible()) continue;

          if (j == 0) {
            table += '<thead>';
          }

          rowObj = this.getRow(thisRow);
          table += '<th class="adaptablegrid adaptablegrid-header ' + rowObj.getCell(j).cls.join(" ") + '" '
                   + 'blotter="abjs:' + rowObj.getId() + ":" + j +'">'
                   + rowObj.getCell(j).getFormattedValue(this) + '</th>';

          if (j == this.width-1) {
            table += '</thead><tbody>';
          }

        }

      }
      else {

        // If dealing with pages, after printing the headers, jump to the relavant row
        if (this.options.pageable) {
          thisRow = (this.currentPage - 1) * (this.displayHeight - 1) + thisRow;
        }

        for (j=0; j<this.width; j++) {

          // Don't print if column is invisible
          if (!this.columns[j].isVisible()) continue;

          if (j == 0) {
            table += '<tr>';
          }

          rowObj = this.getRow(thisRow);
          table += '<td blotter="abjs:' + rowObj.getId() + ":" + j +'" ' 
                   + 'class="' + rowObj.getCell(j).cls.join(" ") + '">' + rowObj.getCell(j).getFormattedValue(this) + '</td>';

          if (j == this.width-1) {
            table += '</tr>';
            if (i == this.displayHeight-1) {
              table += '</tbody>';
            }
          }                    

        }

      }

      displayedRows += 1;

    }

    table += '</table>';
     
    debug.start("AdaptableGrid.html");
    $(this).html(table);
    debug.end("AdaptableGrid.html");
    debug.end("AdaptableGrid.render");
    
    this.applyStyles();
    this.events();

    if (callback) {
      callback();
    }

  }

  /**
   * Associate the relavant events to paging, sorting, column reordering etc.
   * @returns {void}
   */
  this.events = function () {
    
    if (this.options.pageable) {
      PageUtil.addPages.bind(this)();
      PageUtil.events.bind(this)();
    }

    if (this.options.sortable) {
      SortUtil.events.bind(this)();
    }

    if (this.options.reorderable) {
      ReorderUtil.events.bind(this)();
    }

    PersistenceUtil.editing.bind(this)();
    PersistenceUtil.dates.bind(this)();
    PersistenceUtil.checkbox.bind(this)();

  }

  /**
   * Adds any styles necessary to cells
   * @returns {void}
   */
  this.applyStyles = function () {
    $(this).addClass('blotter-grid');
  }

  /**
   * Finds the HTML tag within the grid and returns the jQuery elements
   * @param {integer} row - The row of the cell
   * @param {integer} col - The column of the cell
   * @returns {jQuery}
   */
  this.cellToElement = function (row, col) {
    return $(this).find('[blotter="abjs:' + row + ":" + col + '"]');
  }

  /**
   * Returns the cell from the jQuery element
   * @param {jQuery} el - The DOM element
   * @returns {Cell}
   */
  this.elementToCell = function (el) {
    blotter_id = $(el).attr('blotter');
    parts = blotter_id.split('abjs:')[1].split(":");
    row = parseInt(parts[0]);
    col = parseInt(parts[1]);
    return this.getRowFromId(row).getCell(col);
  }

  /**
   * Returns a Row object for this row
   * @param {integer} index - The row index, after sorting/pages etc
   * @returns {Row}
   */
  this.getRow = function (row) {
    return this.rows[row];
  }

  /**
   * Returns the current placement of the column given by the identifier
   * The first columns has position 0
   * @param {Column} column - The column object 
   * @returns {integer}
   */
  this.getPositionOfColumn = function (column) {
    return this.columns.indexOf(column);
  }

  /**
   * Returns the Column object with the given columnId
   * @param {string} columnId - The column identifier
   * @returns {Column}
   */
  this.getColumnFromId = function (columnId) {
    for (var i=0; i<this.columns.length; i++) {
      if (this.columns[i].getId() == columnId) {
        return this.columns[i];
      }
    }
    return -1;
  }

  /**
   * Returns the current placement of the row given by the identifier
   * The first row (i.e. header) has position 0
   * Note: returns -1 if hidden
   * @param {Row} row - The row object
   * @returns {integer}
   */
  this.getPositionOfRow = function (row) {
    return this.rows.indexOf(row);
  }

  /**
   * Returns the Row object with the given rowId
   * @param {string} rowId - The row identifier
   * @returns {Row}
   */
  this.getRowFromId = function (rowId) {
    for (var i=0; i<this.rows.length; i++) {
      if (this.getRow(i).getId() == rowId) {
        return this.getRow(i);
      }
    }
    for (var i=0; i<this.hiddenRows.length; i++) {
      if (this.hiddenRows[i].getId() == rowId) {
        return this.hiddenRows[i];
      }
    }
    return -1;
  }

  /**
   * Returns the DataType corresponding to the given configuration
   * @param {string} type - The data type in string form
   * @return {DataType}
   */
  this.getDataType = function (type) {
    switch (type) {
      case "text": return DataType.String;
      case "num": return DataType.Number;
      case "date": return DataType.Date;
      case "checkbox": return DataType.Boolean;
    }
  }

  /**
   * Returns the list of Rows which are visible
   * @return {Row[]}
   */
  this.getVisibleRows = function () {
    return this.rows;
  }

  /**
   * Returns the list of Rows which are hidden
   * @return {Row[]}
   */
  this.getHiddenRows = function () {
    return this.hiddenRows;
  }

  /**
   * Returns the list of Columns which are visible
   * @return {Column[]}
   */
  this.getVisibleColumns = function () {
    return $.grep(this.columns, function (i) {
      return i.isVisible();
    });
  }

  /**
   * Returns the list of Columns which are hidden
   * @return {Column[]}
   */
  this.getHiddenColumns = function () {
    return $.grep(this.columns, function (i) {
      return !i.isVisible();
    });
  }

  /**
   * Reorders the table columns according to the input array
   * @param {string[]} ids - The ordered column IDs
   * @return {void}
   */
  this.newColumnOrder = function (ids) {
    debug.start("AdaptableGrid.newColumnOrder");
    for (var i=0; i<this.rows.length; i++) {
      var newData = [];
      for (var j=0; j<this.getRow(i).getData().length; j++) {
        var newIndex = ids.indexOf(this.columns[j].getId());
        newData[newIndex] = this.getRow(i).getCell(j);
      }
      this.rows[i].data = newData;
    }
    this.columns.sort(function (a, b) {
      return ids.indexOf(b.getId()) - ids.indexOf(a.getId());
    });
    debug.end("AdaptableGrid.newColumnOrder");
  }

  return this.__constructor(options);

}