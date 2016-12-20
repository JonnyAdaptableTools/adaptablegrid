$.fn.BlotterGrid = function (options) {
    
    /**
     * BlotterGrid.__constructor
     * Initialise the grid object
     * @constructor
     * @param {object} options - A list of options
     * @returns {null}
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

        this.render();
        
    }

    /**
     * BlotterGrid.render
     * Prints out the grid to the DOM
     * @returns {null}
     */
    this.render = function () {

        var table = $('<table>');  

        // Initialise an ordered columns array
        var orderedColumns = [];

        // Create the headers
        var headers = $('<thead>');
        for (i=0; i<options.columns.length; i++) {
            column = options.columns[i];
            headers.append('<th class="blottergrid blottergrid-header" blotter="' + column.field +'">'
                            + column.title + '</th>');
            orderedColumns.push(column.field);
        }
        table.append(headers);

        // Create the body
        var body = $('<tbody>');
        for (i=0; i<options.data.length; i++) {
            row = options.data[i];
            tr = $('<tr>');
            for (j=0; j<orderedColumns.length; j++) {
                tr.append('<td>' + row[orderedColumns[j]] + '</td>');
            }
            body.append(tr);
        }
        table.append(body);

        $(this).html(table);
        this.applyStyles();

    }

    /**
     * BlotterGrid.applyStyles
     * Adds the styles given in the options property and assigns appropriate classnames
     * to elements on the grid
     * @returns {null}
     */
    this.applyStyles = function () {
        for (i=0; i<options.columns.length; i++) {
            if (options.columns[i].style) {
                for (prop in options.columns[i].style) {
                    this.findElement("th", options.columns[i].field).css(prop, options.columns[i].style[prop]);
                }
            }
        }
    }

    /**
     * BlotterGrid.findElement
     * Finds the HTML tag within the grid and returns the jQuery elements
     * @param {string} tag - The tag name to reference the elements
     * @param {string} field - The Blotter reference to the cell
     * @returns {jQuery}
     */
    this.findElement = function (tag, field) {
        return $(this).find(tag).filter('[blotter="' + field + '"]');
    }

    this.__constructor(options);
    return this;

}