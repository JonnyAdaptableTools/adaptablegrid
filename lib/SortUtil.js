var SortUtil = {

    /**
     * SortUtil.events
     * Add event listeners for sorting columns
     * @static
     * @this AdaptableGrid
     * @returns {void}
     */
    events: function () {
       
        $(this).find('.adaptablegrid-header').addClass('adaptablegrid-sortable');
        $(this).find('.adaptablegrid-header').on('click', SortUtil.clickColumn.bind(this));

    },

    /**
     * SortUtil.clickColumn
     * Callback function after clicking a column title
     * Create a Sorter object and sort the column
     * @static
     * @this AdaptableGrid
     * @param {object} header - The element that was clicked
     * @returns {void}
     */
    clickColumn: function (header) {

        columnIndex = $(header.target).attr('blotter').split("abjs:0:")[1];
        
        if ($(header.target).hasClass('adaptablegrid-sort-asc')) {
            c = 'adaptablegrid-sort-des';
        }
        else {
            c = 'adaptablegrid-sort-asc';
        }
        
        var s = new Sorter([{ column: this.columns[columnIndex], order: (c == 'adaptablegrid-sort-asc') }]);
        
        s.process(this, function () {
            this.findElement(0, columnIndex).addClass('adaptablegrid-sort').addClass(c);
        });

    },

    /**
     * SortUtil.columnToIndexes
     * Convert all the cells in a particular column to a number
     * @static
     * @this AdaptableGrid
     * @param {integer} ind - The column index
     * @returns {void}
     */
    columnToIndexes: function (ind) {
        debug.start("SortUtil.columnToIndexes");
        for (var i=1; i<this.cells.length; i++) {
            indexOfValue = this.columnValueToIndex[ind][this.cells[i][ind].getValue()];
            this.cells[i][ind].setValue(indexOfValue);
        }
        debug.end("SortUtil.columnToIndexes");
    },

    /**
     * SortUtil.indexesToColumn
     * Convert all the cells in a particular column from a number back to their original value
     * @static
     * @this AdaptableGrid
     * @param {integer} ind - The column index
     * @returns {void}
     */
    indexesToColumn: function (ind) {
        debug.start("SortUtil.indexesToColumn");
        for (var i=1; i<this.cells.length; i++) {
            this.cells[i][ind].setValue(this.columnIndexToValue[ind][this.cells[i][ind].getValue()]);
        }
        debug.end("SortUtil.indexesToColumn");
    },

    /**
     * SortUtil.getColumnIndexes
     * Generate two maps to turn text to an index and index back to text
     * @static
     * @this AdaptableGrid
     * @param {integer} columnIndex - The column index used for sorting
     * @returns {void}
     */
    getColumnIndexes: function (ind) {
        
        debug.start("SortUtil.getColumnIndexes");
        
        if (this.columnIndexToValue[ind] == null) {

            var tColI2V = [];
            tColI2V = $.map(this.cells, function (i, n) {
                if (n > 0) {
                    return i[ind].getValue();
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

        debug.end("SortUtil.getColumnIndexes");

    },

    /**
     * SortUtil.configureRowCol
     * After the cell
     * @static
     * @this AdaptableGrid
     * @param {string} column - The column reference to order by
     * @param {bool} asc - Set to true if column is ordered ascending
     * @returns {void}
     */
    configureRowCol: function () {
        debug.start("SortUtil.configureRowCol");
        for (i=0; i<this.height; i++) {
            for (j=0; j<this.width; j++) {
                this.cells[i][j].row = i;
                this.cells[i][j].col = j;
            }
        }
        debug.end("SortUtil.configureRowCol");
    }

}