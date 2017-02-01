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
      switch (cell.format.substr(0, 4)) {
        case "$txt":
        $(e).click(PersistenceUtil.editCell.bind(this, e, "text"));
        break;
        case "$num":
        case "$pri":
        $(e).click(PersistenceUtil.editCell.bind(this, e, "number"));
        break;
      }
    }.bind(this));

    $(document).click(function (e) {
      if (!$(e.target).parents('.blotter-grid').size()) {
        // Save all other edits
        PersistenceUtil.saveEdit.bind(this, $(this).find('.abjs-editing'))();
      }
    }.bind(this));

    debug.end("PersistenceUtil.editing");
  },

  /**
   * PersistenceUtil.editCell
   * Transform regular text fields when edited
   * @static
   * @this AdaptableGrid
   * @param {jQuery} el - The element to edit
   * @param {String} type - The input type
   * @returns {void}
   */
  editCell: function (el, type) {

    // Activate this cell for editing
    if (!$(el).hasClass('abjs-editing')) {
      
      // Save all other edits
      PersistenceUtil.saveEdit.bind(this, $(this).find('.abjs-editing'))();

      cell = this.elementToCell(el);
      $(el).addClass('abjs-editing');
      val = cell.getValue();
      $(el).html('<input type="'+type+'" value="'+val+'" />');

    }

  },

  /**
   * PersistenceUtil.saveEdit
   * Restore all the elements back to their original state and
   * save their current values in the cells property
   * @static
   * @this AdaptableGrid
   * @param {jQuery} els - The elements to disable editing
   * @returns {void}
   */
  saveEdit: function (els) {
    debug.start("PersistenceUtil.saveEdit");
    $(els).each(function (i, e) {
      
      newValue = $(e).find('input').val();

      if ($(e).find('input').attr('type') == "number") {
        newValue = parseFloat(newValue);
      }

      cell = this.elementToCell(e);
      cell.setValue(newValue);
      $(e).removeClass('abjs-editing');
      $(e).html(cell.getFormattedValue(this));
      
    }.bind(this));
    debug.end("PersistenceUtil.saveEdit");
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
      this.getRow(thisCell[0]).getCell(thisCell[1]).setValue(newValue);
      this.options.oncellchange(this.getRow(thisCell[0]).getCell(thisCell[1]));

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
      this.getRow(thisCell[0]).getCell(thisCell[1]).setValue(newValue);
      this.options.oncellchange(this.getRow(thisCell[0]).getCell(thisCell[1]));

    }.bind(this));

  }

}