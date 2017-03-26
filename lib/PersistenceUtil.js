/**
 * A utility class with methods to store and save data when editing
 * @namespace
 */
var PersistenceUtil = {

  /**
   * When clicking on a cell, allow it to be edited
   * @static
   * @this Grid
   * @returns {void}
   */
  editing: function () {
    debug.start("PersistenceUtil.editing");
    
    $(this).find('tbody td[blotter]').each(function (i, e) {
      cell = this.elementToCell(e);
      if (cell.type == DataType.String || cell.type == DataType.Number) {
        $(e).dblclick(PersistenceUtil.editCell.bind(this, e, cell.type));
      }
    }.bind(this));

    $(document).click(function (e) {
      if (!$(e.target).parents('.abjs-editing').size()) {
        // Save all other edits
        PersistenceUtil.saveEdit.bind(this, $(this).find('.abjs-editing'))();
      }
    }.bind(this));

    debug.end("PersistenceUtil.editing");
  },

  /**
   * Transform regular text fields when edited
   * @static
   * @this Grid
   * @param {jQuery} el - The element to edit
   * @param {String} type - The input type
   * @returns {void}
   */
  editCell: function (el, type) {

    // Activate this cell for editing
    if (!$(el).hasClass('abjs-editing')) {
      
      cell = this.elementToCell(el);

      // Exit if read-only
      if (cell.isReadOnly()) {
        return;
      }

      // Save all other edits
      PersistenceUtil.saveEdit.bind(this, $(this).find('.abjs-editing'))();

      $(el).addClass('abjs-editing');
      val = cell.getRawValue();
      html_type = (type == DataType.Number ? "number" : "text");
      $(el).html('<input type="'+html_type+'" value="'+val+'" />');

    }

  },

  /**
   * Restore all the elements back to their original state and
   * save their current values in the cells property
   * @static
   * @this Grid
   * @param {jQuery} els - The elements to disable editing
   * @returns {void}
   */
  saveEdit: function (els) {
    debug.start("PersistenceUtil.saveEdit");
    $(els).each(function (i, e) {
      
      cell = this.elementToCell(e);
      oldValue = cell.getRawValue();
      newValue = $(e).find('input').val();

      if ($(e).find('input').attr('type') == "number") {
        newValue = parseFloat(newValue);
      }

      $(e).removeClass('abjs-editing');

      if (this.options.oncellchange(cell, newValue, oldValue) === false) {
        $(e).html(cell.getFormattedValue(this));
      }
      else {
        cell.setValue(newValue);
        $(e).html(cell.getFormattedValue(this));
      }
      
    }.bind(this));
    debug.end("PersistenceUtil.saveEdit");
  },

  /**
   * When modifying the datepicker, save the result to the grid
   * @static
   * @this Grid
   * @returns {void}
   */
  dates: function () {
    
    for (var i=0; i<$(this).find('.Grid-datepicker').size(); i++) {
      el = $(this).find('.Grid-datepicker').eq(i);
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

    $(this).find('.Grid-datepicker').on('change', function (datepicker) {
      
      thisCell = $(datepicker.target).parents('td[blotter]').attr('blotter').split("abjs:")[1].split(":");
      newValue = $(datepicker.target).val();
      this.getRowFromId(thisCell[0]).getCell(thisCell[1]).setValue(newValue);
      this.options.oncellchange(this.getRowFromId(thisCell[0]).getCell(thisCell[1]));

    }.bind(this));

  },
  
  /**
   * When modifying a boolean checkbox, save the result to the grid
   * @static
   * @this Grid
   * @returns {void}
   */
  checkbox: function () {
    
    $(this).find('.Grid-checkbox').on('change', function (checkbox) {
      
      thisCell = $(checkbox.target).parents('td[blotter]').attr('blotter').split("abjs:")[1].split(":");
      newValue = $(checkbox.target).is(':checked') ? 1 : 0;
      this.getRow(thisCell[0]).getCell(thisCell[1]).setValue(newValue);
      this.options.oncellchange(this.getRow(thisCell[0]).getCell(thisCell[1]));

    }.bind(this));

  }

}