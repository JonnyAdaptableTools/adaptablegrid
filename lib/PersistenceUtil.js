var PersistenceUtil = {

    /**
     * PersistenceUtil.editing
     * When clicking on a cell, allow it to be edited
     * @static
     * @this AdaptableGrid
     * @returns {void}
     */
    editing: function () {
        debug.start("PersistenceUtil.editing");
        $(this).find('tbody td[blotter]').each(function (i, e) {
            cell = this.elementToCell(e);
            switch (cell.format) {
                case "$txt":
                $(e).click(PersistenceUtil.editText.bind(this, e));
                break;
            }
        }.bind(this));
        debug.end("PersistenceUtil.editing");
    },

    /**
     * PersistenceUtil.editText
     * Transform regular text fields when edited
     * @static
     * @this AdaptableGrid
     * @returns {void}
     */
    editText: function (el) {
        val = $(el).html();
        $(el).html('<input type="text" value="'+val+'" />');
    },

    /**
     * PersistenceUtil.dates
     * When modifying the datepicker, save the result to the grid
     * @static
     * @this AdaptableGrid
     * @returns {void}
     */
    dates: function () {
        
        for (var i=0; i<$(this).find('.adaptablegrid-datepicker').size(); i++) {
            el = $(this).find('.adaptablegrid-datepicker').eq(i);
            el.datepicker({
                showOn: "button",
                buttonImageOnly: true,
                buttonImage: "calendar.png",
                dateFormat: el.attr('blotter-format'),
                beforeShow: function (e, o) {
                    a = $(e).parents('[blotter]');
                    this.options.oncellenter(this.cellToElement($(e).parents('[blotter]')));
                }.bind(this)
            });
        }

        $(this).find('.adaptablegrid-datepicker').on('change', function (datepicker) {
            
            thisCell = $(datepicker.target).parents('td[blotter]').attr('blotter').split("abjs:")[1].split(":");
            newValue = $(datepicker.target).val();
            this.cells[thisCell[0]][thisCell[1]].setValue(newValue);
            this.options.oncellchange(this.cells[thisCell[0]][thisCell[1]]);

        }.bind(this));

    },
    
    /**
     * PersistenceUtil.checkbox
     * When modifying a boolean checkbox, save the result to the grid
     * @static
     * @this AdaptableGrid
     * @returns {void}
     */
    checkbox: function () {
        
        $(this).find('.adaptablegrid-checkbox').on('change', function (checkbox) {
            
            thisCell = $(checkbox.target).parents('td[blotter]').attr('blotter').split("abjs:")[1].split(":");
            newValue = $(checkbox.target).is(':checked') ? 1 : 0;
            this.cells[thisCell[0]][thisCell[1]].setValue(newValue);
            this.options.oncellchange(this.cells[thisCell[0]][thisCell[1]]);

        }.bind(this));

    }

}