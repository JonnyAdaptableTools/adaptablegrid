$.fn.AdaptableGrid = function (options) {
    
    /**
     * AdaptableGrid.__constructor
     * Initialise the grid object
     * @constructor
     * @param {object} options - A list of options
     * @returns {AdaptableGrid}
     */
    this.__constructor = function (options) {
        
        // Initialise the options property with some defaults
        this.options = $.extend({
            columns: [],
            data: [],
            sort: null,
            filter: null,
            edit: null,
            ordering: null,
            pages: null,
            search: null,
            styles: null
        }, options);

        
        this.read();
        return this;
        
    }

    /**
     * AdaptableGrid.read
     * Reads in the data to create a singleton list of type Cell
     * @returns {null}
     */
    this.read = function () {
        
        console.time('read');
        this.cells = [];
        this.columns = {};
        
        this.width = options.columns.length;
        this.height = options.data.length;
        dimension = this.width * this.height;
        
        for (i=0; i<dimension; i++) {
           
            row = Math.floor(i/this.width);
            col = i % this.width;
            this.cells[i] = new Cell(this, i);
            
            if (i<this.width) {
                // Cell is a column header
                this.cells[i].setId(options.columns[i].field);
                this.cells[i].setValue(options.columns[i].title);
                this.cells[i].setFormat("$txt");
                this.columns[this.cells[i].getId()] = i;
            }
            else {
                // Regular cell
                this.cells[i].setValue(options.data[row-1][options.columns[col].field]);
                this.cells[i].setFormat(options.columns[col].format);
            }

        }

        console.timeEnd('read');

    }

    /**
     * AdaptableGrid.render
     * Prints out the grid to the DOM
     * @param {integer} [num] - The number of rows to display
     * @returns {null}
     */
    this.render = function (num) {
        
        console.time('render');
        if (num == null) {
            num = this.height - 1;
        }

        var cellsToDisplay = (num+1)*this.width;

        var table = '<table>';

        // Output all the cells
        for (i=0; i<cellsToDisplay; i++) {

            if (i<this.width) {

                if (i == 0) {
                    table += '<thead>';
                }

                table += '<th class="adaptablegrid adaptablegrid-header" blotter="' + this.cells[i].getId() +'">'
                            + this.cells[i].getFormattedValue() + '</th>';

                if (i == this.width-1) {
                    table += '</thead><tbody>';
                }

            }
            else {

                row = Math.floor(i/this.width);
                col = i % this.width;

                if (col == 0) {
                    table += '<tr>';
                }

                table += '<td>' + this.cells[i].getFormattedValue() + '</td>';

                if (col == this.width-1) {
                    table += '</tr>';
                }

                if (i == this.cells.length-1) {
                    table += '</tbody>';
                }

            }

        }

        table += '</table>';

        console.timeEnd('render');
        console.time('html');
        $(this)[0].innerHTML = table;
        console.timeEnd('html');
        this.applyStyles();

    }

    /**
     * AdaptableGrid.applyStyles
     * Adds the styles given in the options property and assigns appropriate classnames
     * to elements on the grid
     * @returns {null}
     */
    this.applyStyles = function () {
        console.time('styles');
        for (i=0; i<options.columns.length; i++) {
            if (options.columns[i].style) {
                for (prop in options.columns[i].style) {
                    this.findElement("th", options.columns[i].field).css(prop, options.columns[i].style[prop]);
                }
            }
        }
        console.timeEnd('styles');
    }

    /**
     * AdaptableGrid.findElement
     * Finds the HTML tag within the grid and returns the jQuery elements
     * @param {string} tag - The tag name to reference the elements
     * @param {string} field - The Blotter reference to the cell
     * @returns {jQuery}
     */
    this.findElement = function (tag, field) {
        return $(this).find(tag).filter('[blotter="' + field + '"]');
    }

    return this.__constructor(options);

}