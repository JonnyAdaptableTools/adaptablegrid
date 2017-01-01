var PersistenceUtil = {

    /**
     * PersistenceUtil.dates
     * When modifying the datepicker, save the result to the grid
     * @static
     * @this AdaptableGrid
     * @returns {void}
     */
    dates: function () {
        
        $(this).find('.adaptablegrid-datepicker').on('change', function (datepicker) {
            
            thisCell = $(datepicker.target).parents('td[blotter]').attr('blotter').split("abjs:")[1].split(":");
            newValue = $(datepicker.target).val();
            this.cells[thisCell[0]][thisCell[1]].setValue(newValue);

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

        }.bind(this));

    }

}