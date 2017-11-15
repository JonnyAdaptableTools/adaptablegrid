/**
 * A utility class with methods to store and save data when editing
 * @namespace
 */
var PersistenceUtil = {

  /**
   * When double clicking on a cell, allow it to be edited
   * @static
   * @this AdaptableGrid
   * @returns {void}
   */
  editing: function () {
    this.options.debug.start("PersistenceUtil.editing");
    
    // Set up every (numeric or string) cell so that a double click will put it into editing mode.
    $(this).find('tbody td[blotter]').each(function (i, e) {
      cell = this.elementToCell(e);
      if (cell.type == DataType.String || cell.type == DataType.Number) {
        $(e).dblclick(PersistenceUtil.editCell.bind(this, e, cell.type));
      }
    }.bind(this));

    // Listen to the (single) click event anywhere in the blotter and save all edits
    $(document).click(function (e) {
      if (!$(e.target).parents('.abjs-editing').size()) {
        // Save all other edits
        PersistenceUtil.saveEdit.bind(this, $(this).find('.abjs-editing'))();
      }
    }.bind(this));

// not sure if this will work but hoping that here we can listen to the ABgrid keydown (which is this)
// and then have the logic to react to Enter, Tab, Escape as appropriate.
//this.options.onkeydown.bind

    this.options.debug.end("PersistenceUtil.editing");
  },

  /**
   * Transform regular text fields when edited
   * @static
   * @this AdaptableGrid
   * @param {jQuery} el - The element to edit
   * @param {String} type - The input type
   * @returns {void}
   */
  editCell: function (el, type) {

    // Activate this cell for editing if not already in edit mode
    if (!$(el).hasClass('abjs-editing')) {
      
      // get the cell object from the JQuery element
      cell = this.elementToCell(el);

      // Exit if read-only
      if (cell.isReadOnly()) {
        return;
      }

      // Save all other edits before continuing
      PersistenceUtil.saveEdit.bind(this, $(this).find('.abjs-editing'))();

      // Put this cell into 'edit mode' by applying the styel and changing the input as appropriate
      $(el).addClass('abjs-editing');
      val = cell.getRawValue();
      html_type = (type == DataType.Number ? "number" : "text");
      $(el).html('<input type="'+html_type+'" value="'+val+'" />');  // can we give it focus to avoid the additional click?

    }

  },

  /**
   * Restore all the elements back to their original state and
   * save their current values in the cells property
   * @static
   * @this AdaptableGrid
   * @param {jQuery} els - The elements to disable editing
   * @returns {void}
   */
  saveEdit: function (els) {
    this.options.debug.start("PersistenceUtil.saveEdit");
    $(els).each(function (i, e) {
      
      cell = this.elementToCell(e);
      oldValue = cell.getRawValue();
      newValue = $(e).find('input').val();

      if ($(e).find('input').attr('type') == "number") {
        newValue = parseFloat(newValue);
      }

      // remove the edit style
      $(e).removeClass('abjs-editing');

      // put the cell back to 'normal' mode and update the value if its been changed.
      if (this.options.oncellchange(cell, newValue, oldValue) === false) {
        $(e).html(cell.getFormattedValue(this));
      }
      else {
        cell.setValue(newValue);
        $(e).html(cell.getFormattedValue(this));
      }
      
    }.bind(this));
    this.options.debug.end("PersistenceUtil.saveEdit");
  },

  /**
   * Restore all the elements back to their original state and
   * undoes any editing changes
   * @static
   * @this AdaptableGrid
   * @param {jQuery} els - The elements to disable editing
   * @returns {void}
   */
  cancelEdit: function (els) {
    this.options.debug.start("PersistenceUtil.saveEdit");
    $(els).each(function (i, e) {
      
      cell = this.elementToCell(e);
      oldValue = cell.getRawValue();
    
      // remove the edit style
      $(e).removeClass('abjs-editing');

      // put the cell back to 'normal' mode with old undedited value
        cell.setValue(oldValue);
        $(e).html(cell.getFormattedValue(this));
      
    }.bind(this));
    this.options.debug.end("PersistenceUtil.saveEdit");
  },

  /**
   * When modifying the datepicker, save the result to the grid
   * @static
   * @this AdaptableGrid
   * @returns {void}
   */
  dates: function () {
    
    for (var i=0; i<$(this).find('.AdaptableGrid-datepicker').size(); i++) {
      el = $(this).find('.AdaptableGrid-datepicker').eq(i);
      el.datepicker({
        showOn: "button",
        buttonImageOnly: true,
        buttonImage: "calendar.png",
        dateFormat: el.attr('blotter-format'),
        beforeShow: function (e, o) {
          a = $(e).parents('[blotter]');
          this.options.oncellenter(this.elementToCell($(e).parents('[blotter]')));
        }.bind(this)
      });
    }

    $(this).find('.AdaptableGrid-datepicker').on('change', function (datepicker) {
      
      thisCell = $(datepicker.target).parents('td[blotter]').attr('blotter').split("abjs:")[1].split(":");
      newValue = $(datepicker.target).val();
      this.getRowFromId(thisCell[0]).getCell(thisCell[1]).setValue(newValue);
      this.options.oncellchange(this.getRowFromId(thisCell[0]).getCell(thisCell[1]));

    }.bind(this));

  },
  
  /**
   * When modifying a boolean checkbox, save the result to the grid
   * @static
   * @this AdaptableGrid
   * @returns {void}
   */
  checkbox: function () {
    
    $(this).find('.AdaptableGrid-checkbox').on('change', function (checkbox) {
      
      thisCell = $(checkbox.target).parents('td[blotter]').attr('blotter').split("abjs:")[1].split(":");
      newValue = $(checkbox.target).is(':checked') ? 1 : 0;
      this.getRow(thisCell[0]).getCell(thisCell[1]).setValue(newValue);
      this.options.oncellchange(this.getRow(thisCell[0]).getCell(thisCell[1]));

    }.bind(this));

  }

}