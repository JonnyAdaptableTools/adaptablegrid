$.fn.AdaptableGrid = function (options) {
  
  /**
   * AdaptableGrid.__constructor
   * Initialise the grid object
   * @constructor
   * @param {object} options - A list of options
   * @returns {AdaptableGrid}
   */
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
   * AdaptableGrid.read
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
          col = new Column(options.columns[j].field, options.columns[j].title, DataType.convert(options.columns[j].type));
          this.columns.push(col);
        }
      }
      else {
        // Regular row
        for (j=0; j<this.width; j++) {
          this.getRow(i).setCell(j, new Cell(i, j));
          this.getRow(i).getCell(j).setValue(options.data[i-1][options.columns[j].field]);
          this.getRow(i).getCell(j).setType(DataType.convert(options.columns[j].type));
          this.getRow(i).getCell(j).setFormat(options.columns[j].format);
        }
      }

    }

    debug.end("AdaptableGrid.read");

  }

  /**
   * AdaptableGrid.render
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
   * AdaptableGrid.events
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
   * AdaptableGrid.applyStyles
   * Adds any styles necessary to cells
   * @returns {void}
   */
  this.applyStyles = function () {
    $(this).addClass('blotter-grid');
  }

  /**
   * AdaptableGrid.cellToElement
   * Finds the HTML tag within the grid and returns the jQuery elements
   * @param {integer} row - The row of the cell
   * @param {integer} col - The column of the cell
   * @returns {jQuery}
   */
  this.cellToElement = function (row, col) {
    return $(this).find('[blotter="abjs:' + row + ":" + col + '"]');
  }

  /**
   * AdaptableGrid.elementToCell
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
   * AdaptableGrid.getRow
   * Returns a Row object for this row
   * @param {integer} index - The row index, after sorting/pages etc
   * @returns {Row}
   */
  this.getRow = function (row) {
    return this.rows[row];
  }

  /**
   * AdaptableGrid.getPositionOfColumn
   * Returns the current placement of the column given by the identifier
   * The first columns has position 0
   * @param {Column} column - The column object
   * @returns {integer}
   */
  this.getPositionOfColumn = function (column) {
    return this.columns.indexOf(column);
  }

  /**
   * AdaptableGrid.getColumnFromId
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
   * AdaptableGrid.getPositionOfRow
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
   * AdaptableGrid.getRowFromId
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

  return this.__constructor(options);

}