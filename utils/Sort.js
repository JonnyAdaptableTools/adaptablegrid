var Sort = {

    /**
     * Sort.do
     * Sorts the grid and re-renders
     * @param {object} grid - The grid to sort
     * @param {string} column - The column reference to order by
     * @param {bool} asc - Set to true if column is ordered ascending
     * @param {function} [callback] - The function to run after sorting is finished
     * @returns {void}
     */
    do: function (grid, column, asc, callback) {

        debug.start("Sort.do");
        var columnIndex = grid.columns.indexOf(column);

        // Find the format of this column
        columnFormat = grid.options.columns[columnIndex].format;

        debug.end("Sort.do");

        if (columnFormat == "$txt") {        
            grid.getColumnIndexes(columnIndex);
            grid.columnToIndexes(columnIndex);
            Sort.ordering(grid, columnIndex, asc);
            grid.indexesToColumn(columnIndex);
        }
        else {
            Sort.ordering(grid, columnIndex, asc);
        }

        grid.configureRowCol();
        grid.render(null, callback);

    },

    /**
     * Sort.ordering
     * Use the appropriate algorithm to order the rows
     * Always make sure the header rows stay at the top
     * @param {object} grid - The grid to sort
     * @param {integer} columnIndex - The column index used for sorting
     * @param {bool} asc - Set to true if column is ordered ascending
     * @returns {void}
     */
    ordering: function (grid, columnIndex, asc) {
        
        debug.start("Sort.ordering");

        grid.cells.sort(function (a, b) {
            if (a[columnIndex].row == 0) { return -1; }
            if (b[columnIndex].row == 0) { return 1; }
            value_a = a[columnIndex].getValue();
            value_b = b[columnIndex].getValue();
            if (asc) {
                return value_a - value_b;
            }
            else {
                return value_b - value_a;
            }
        });
        
        debug.end("Sort.ordering");

    }

}