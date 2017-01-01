var Sorter = function (data) {

    /**
     * Sorter.__construct
     * Configures the sort
     * @param {object[]} data - The sort data to show the priority of columns
     * @returns {void}
     * 
     * @example new Sorter([
     *  { column: "currency", order: ["GBP", "AUD", "CAD", "USD", "EUR"] },
     *  { column: "id", order: true }
     * ]);
     */
    this.__construct = function (data) {
        this.data = data;
        return this;
    }

    /**
     * Sorter.process
     * Run the sort and re-renders the grid
     * @param {object} grid - The grid to sort
     * @param {function} [callback] - The function to run after sorting is finished
     */
    this.process = function (grid, callback) {
        this.prepare(grid);
        this.shuffle(grid);
        this.cleanUp(grid);
        SortUtil.configureRowCol.bind(grid)();
        PageUtil.resetPages.bind(grid)();
        grid.render(callback.bind(grid));
    }

    /**
     * Sorter.prepare
     * Prepares the sort by converting any strings to numbers for fast sort
     * @param {object} grid - The grid to sort
     * @returns {void}
     */
    this.prepare = function (grid) {
        
        debug.start("Sorter.prepare");
        this.columnIndex = [];
        this.columnFormat = [];
        this.columnSortBy = [];
        for (var i=0; i<this.data.length; i++) {
            // Find the index and format of this column
            this.columnIndex[i] = grid.columns.indexOf(this.data[i].column);
            this.columnFormat[i] = grid.options.columns[this.columnIndex[i]].format;
            if (this.columnFormat[i] == "$txt") {
                SortUtil.getColumnIndexes.bind(grid, this.columnIndex[i])();
                SortUtil.columnToIndexes.bind(grid, this.columnIndex[i])();
            }
            if (Array.isArray(this.data[i].order)) {
                this.data[i].order = this.data[i].order.map(function (x) {
                    return grid.columnValueToIndex[this.columnIndex[i]][x];
                }, this);
            }
            this.columnSortBy[i] = this.data[i].order;
        }
        debug.end("Sorter.prepare");

    }

    /**
     * Sorter.cleanUp
     * Puts the grid back to original state by undoing any action from Sort.prepare
     * @param {object} grid - The grid to sort
     * @returns {void}
     */
    this.cleanUp = function (grid) {
        debug.start("Sorter.cleanUp");
        for (i=0; i<data.length; i++) {
            if (this.columnFormat[i] == "$txt") {
                SortUtil.indexesToColumn.bind(grid, this.columnIndex[i])();
            }
        }
        debug.end("Sorter.cleanUp");
    }

    /**
     * Sort.shuffle
     * Use the appropriate algorithm to order the rows
     * Always make sure the header rows stay at the top
     * @param {object} grid - The grid to sort
     * @returns {void}
     */
    this.shuffle = function (grid) {
        
        debug.start("Sort.shuffle");

        grid.cells.sort(function (a, b) {
            
            if (a[this.columnIndex[0]].row == 0) { return -1; }
            if (b[this.columnIndex[0]].row == 0) { return 1; }
            
            for (i=0; i<this.columnIndex.length; i++) {
                
                if (Array.isArray(this.columnSortBy[i])) {
                    value_a = this.columnSortBy[i].indexOf(a[this.columnIndex[i]].getValue());
                    value_b = this.columnSortBy[i].indexOf(b[this.columnIndex[i]].getValue());
                    if (value_a == -1) { value_a = this.columnSortBy[i].length; }
                    if (value_b == -1) { value_b = this.columnSortBy[i].length; }
                    if (value_a != value_b) {
                        return value_a - value_b;
                    }
                }
                else {
                    value_a = a[this.columnIndex[i]].getValue();
                    value_b = b[this.columnIndex[i]].getValue();
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