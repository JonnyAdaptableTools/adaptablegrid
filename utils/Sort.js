var Sort = function (grid, data) {

    /**
     * Sort.__construct
     * Configures the sort
     * @param {object} grid - The grid to sort
     * @param {object[]} data - The sort data to show the priority of columns
     * @returns {void}
     * 
     * @example new Sort(g, [
     *  { column: "currency", order: ["GBP", "AUD", "CAD", "USD", "EUR"] },
     *  { column: "id", order: true }
     * ]);
     */
    this.__construct = function (grid, data) {
        this.grid = grid;
        this.data = data;
        return this;
    }

    /**
     * Sort.process
     * Run the sort and re-renders the grid
     * @param {function} [callback] - The function to run after sorting is finished
     */
    this.process = function (callback) {
        this.prepare();
        this.shuffle();
        this.cleanUp();
        this.grid.configureRowCol();
        this.grid.resetPages();
        this.grid.render(callback);
    }

    this.prepare = function () {
        
        debug.start("Sort.prepare");
        this.columnIndex = [];
        this.columnFormat = [];
        this.columnSortBy = [];
        for (var i=0; i<data.length; i++) {
            // Find the index and format of this column
            this.columnIndex[i] = this.grid.columns.indexOf(data[i].column);
            this.columnFormat[i] = this.grid.options.columns[this.columnIndex[i]].format;
            if (this.columnFormat[i] == "$txt") {
                this.grid.getColumnIndexes(this.columnIndex[i]);
                this.grid.columnToIndexes(this.columnIndex[i]);
            }
            if (Array.isArray(data[i].order)) {
                data[i].order = data[i].order.map(function (x) {
                    return this.grid.columnValueToIndex[this.columnIndex[i]][x];
                }, this);
            }
            this.columnSortBy[i] = data[i].order;
        }
        debug.end("Sort.prepare");

    }

    this.cleanUp = function () {
        debug.start("Sort.cleanUp");
        for (i=0; i<data.length; i++) {
            if (this.columnFormat[i] == "$txt") {
                this.grid.indexesToColumn(this.columnIndex[i]);
            }
        }
        debug.end("Sort.cleanUp");
    }

    /**
     * Sort.shuffle
     * Use the appropriate algorithm to order the rows
     * Always make sure the header rows stay at the top
     * @param {integer[]} columnIndex - The column indexes used for sorting
     *        true for ascending, false for descending or an array of ordered values
     * @param {any[]} columnSortBy - Ascending/Descending or by specific order
     * @returns {void}
     */
    this.shuffle = function () {
        
        debug.start("Sort.shuffle");

        this.grid.cells.sort(function (a, b) {
            
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

    return this.__construct(grid, data);

}