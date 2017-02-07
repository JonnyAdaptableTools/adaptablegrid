var Row = function (rowId) {
  
  this.rowId = rowId;
  this.data = [];
  this.visible = true;

  this.getId = function () {
    return this.rowId;
  }

  this.getData = function () {
    return this.data;
  }

  this.addCell = function (cell) {
    this.data.push(cell);
  }

  this.setCell = function (key, value) {
    this.data[key] = value; 
  }

  this.getCell = function (key) {
    return this.data[key];
  }

  this.setVisible = function (grid) {
    var index = grid.hiddenRows.indexOf(this);
    this.visible = true;
    grid.rows.push(this);
    grid.hiddenRows.splice(index, 1);
  }

  this.setHidden = function (grid) {
    var index = grid.getPositionOfRow(this);
    this.visible = false;
    grid.hiddenRows.push(this);
    grid.rows.splice(index, 1);
  }

  this.isVisible = function () {
    return this.visible;
  }

}