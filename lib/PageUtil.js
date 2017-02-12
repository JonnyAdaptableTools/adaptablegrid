/**
 * A utility class for navigating pages
 * @namespace
 */
var PageUtil = {

  /**
   * Goes to the next page and re-renders
   * @static
   * @this AdaptableGrid
   * @returns {void}
   */
  nextPage: function () {
    debug.start("PageUtil.nextPage");
    if (this.currentPage < this.numberOfPages) {
      this.currentPage += 1;
      this.render(this.options.onpagechange.bind(this, this.currentPage));
    }
    debug.end("PageUtil.nextPage");
  },

  /**
   * Goes to the previous page and re-renders
   * @static
   * @this AdaptableGrid
   * @returns {void}
   */
  prevPage: function () {
    debug.start("PageUtil.prevPage");
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.render(this.options.onpagechange.bind(this, this.currentPage));
    }
    debug.end("PageUtil.prevPage");
  },

  /**
   * Initialises the number of pages and sets the current page to 1
   * Note: pages range from 1 - this.numberOfPages (inclusive), no zero-indexes for pages
   * @static
   * @this AdaptableGrid
   * @returns {void}
   */
  resetPages: function () {
    this.currentPage = 1;
    this.numberOfPages = Math.ceil((this.height - 1) / (this.displayHeight - 1));
  },

  /**
   * Adds the HTML div which contains what page we are currently on
   * @static
   * @this AdaptableGrid
   * @returns {void}
   */
  addPages: function () {
    $(this).append('\
    <div class="adaptablegrid-pages noselect">\
      Page <b class="adaptablegrid-currentpage">' + this.currentPage + '</b> of ' + this.numberOfPages + '\
      <div class="adaptablegrid-page-prev ' + (this.currentPage==1?'adaptablegrid-page-disabled':'') + '"></div>\
      <div class="adaptablegrid-page-next ' + (this.currentPage==this.numberOfPages?'adaptablegrid-page-disabled':'') + '">\
      </div>\
    </div>');
    $(this).find('.adaptablegrid-currentpage').css('width', this.numberOfPages.toString().length * 8);
  },

  /**
   * Add event listeners for moving forward and backwards in pages
   * @static
   * @this AdaptableGrid
   * @returns {void}
   */
  events: function () {
    
    // Bind standard click events
    $(this).find('.adaptablegrid-page-prev').on('click', PageUtil.prevPage.bind(this));
    $(this).find('.adaptablegrid-page-next').on('click', PageUtil.nextPage.bind(this));
    
    // Holding down the mouse on previous should increase speed of moving back pages
    $(this).find('.adaptablegrid-page-prev').on('mousedown', function () {
      
      // After 100ms of holding down the mouse, run an interval to move back a page every 100ms
      clickAndHold = setTimeout(function () {
        clickAndHold = setInterval(PageUtil.prevPage.bind(this), 100);
      }.bind(this), 100);

    }.bind(this)).on('mouseup mouseleave', function () {
      
      // Clear the timeout when you release the mouse
      if (typeof clickAndHold != "undefined") {
        clearTimeout(clickAndHold);
      }

    });

    // Holding down the mouse on next should increase speed of moving forward pages
    $(this).find('.adaptablegrid-page-next').on('mousedown', function () {
      
      // After 100ms of holding down the mouse, run an interval to move back a page every 100ms
      clickAndHold = setTimeout(function () {
        clickAndHold = setInterval(PageUtil.nextPage.bind(this), 100);
      }.bind(this), 100);

    }.bind(this)).on('mouseup mouseleave', function () {
      
      // Clear the timeout when you release the mouse
      if (typeof clickAndHold != "undefined") {
        clearTimeout(clickAndHold);
      }

    });
    
  }

}