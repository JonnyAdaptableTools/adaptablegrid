/**
 * A static class with utility functions for reordering columns
 * @namespace
 */
var ReorderUtil = {

  /**
   * Add event listeners for swapping columns
   * @static
   * @this Grid
   * @returns {void}
   */
  events: function () {
        
    $(this).find('.Grid-header').draggable({
      helper: 'clone'
    });

    $(this).find('.Grid-header').on('drag', ReorderUtil.drag.bind(this));
    $(this).find('.Grid-header').on('dragstop', ReorderUtil.move.bind(this));

  },

  /**
   * Triggered whilst the user is dragging a column header
   * @static
   * @param {object} event - Details of the drag event
   * @param {object} ui - The element being dragged
   * @this Grid
   * @returns {void}
   */
  drag: function (event, ui) {
    
    // Find the closest header cell to the helper
    var minimumDistance = null;
    var headers = $(this).find('.Grid-header:not(.ui-draggable-dragging)');

    for (i=0; i<headers.size(); i++) {
      diff = Math.abs(ui.offset.left - (headers.eq(i).position().left + headers.eq(i).width()/2));
      if (diff < minimumDistance || minimumDistance == null) {
        minimumDistance = diff;
        $(this).find('.Grid-dropafter').removeClass('Grid-dropafter');
        headers.eq(i).addClass('Grid-dropafter');
      }
    }

  },

  /**
   * Triggered when the user releases the column in a given position
   * Change the cell column structure to reflect the reorder
   * @static
   * @param {object} event - Details of the drag event
   * @param {object} ui - The element being dragged
   * @this Grid
   * @returns {void}
   */
  move: function (event, ui) {
    
    debug.start("ReorderUtil.move");
    columnToInsert = parseInt($(ui.helper).attr('blotter').split("abjs:0:")[1]);
    insertAfter = parseInt($(this).find('.Grid-dropafter').attr('blotter').split("abjs:0:")[1]);
    
    if (insertAfter < columnToInsert) {
      insertAfter += 1;
    }

    $(this).find('.Grid-dropafter').removeClass('Grid-dropafter');
    
    this.columns.splice(insertAfter, 0, this.columns.splice(columnToInsert, 1)[0]);
    for (i=0; i<this.rows.length; i++) {
      this.getRow(i).getData().splice(insertAfter, 0, this.getRow(i).getData().splice(columnToInsert, 1)[0]);
    }
    
    this.render(this.options.oncolumnupdate.bind(this, this.columns));
    debug.end("ReorderUtil.move");

  }

}