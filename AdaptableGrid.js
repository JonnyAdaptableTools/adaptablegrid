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
      oncellchange: function (cell) {},
      oncolumnupdate: function (columns) {}
    }, options);

    this.columnValueToIndex = {};
    this.columnIndexToValue = {};

    this.cells = [];
    this.columns = [];
    
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

      this.cells[i] = [];
      
      if (i==0) {
        // This is the column headers
        for (j=0; j<this.width; j++) {
          this.cells[i][j] = new Cell(i, j);
          this.cells[i][j].setValue(options.columns[j].title);
          this.cells[i][j].setFormat("$txt");
          col = new Column(options.columns[j].field, options.columns[j].title, DataType.String);
          this.columns.push(col);
        }
      }
      else {
        // Regular row
        for (j=0; j<this.width; j++) {
          this.cells[i][j] = new Cell(i, j);
          this.cells[i][j].setValue(options.data[i-1][options.columns[j].field]);
          this.cells[i][j].setFormat(options.columns[j].format);
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

    // Output all the cells
    for (i=0; i<this.displayHeight; i++) {

      var row = i;

      if (row == 0) {

        for (j=0; j<this.width; j++) {

          if (j == 0) {
            table += '<thead>';
          }

          table += '<th class="adaptablegrid adaptablegrid-header" blotter="abjs:' + row + ":" + j +'">'
                + this.cells[row][j].getFormattedValue(this) + '</th>';

          if (j == this.width-1) {
            table += '</thead><tbody>';
          }

        }

      }
      else {

        // If dealing with pages, after printing the headers, jump to the relavant row
        if (this.options.pageable) {
          row = (this.currentPage - 1) * (this.displayHeight - 1) + i;
        }

        for (j=0; j<this.width; j++) {

          if (j == 0) {
            table += '<tr>';
          }

          table += '<td blotter="abjs:' + row + ":" + j +'">' + this.cells[row][j].getFormattedValue(this) + '</td>';

          if (j == this.width-1) {
            table += '</tr>';
            if (i == this.displayHeight-1) {
              table += '</tbody>';
            }
          }                    

        }

      }

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
    return this.cells[row][col];
  }

  /**
   * AdaptableGrid.getRow
   * Returns an array of cells for this row
   * @param {integer} id - The row identifier
   * @returns {Cell[]}
   */
  this.getRow = function (row) {
    return this.cells[row];
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

  return this.__constructor(options);

}