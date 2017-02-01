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

  this.setVisible = function () {
    this.visible = true;
  }

  this.setHidden = function () {
    this.visible = false;
  }

  this.isVisible = function () {
    return this.visible;
  }

}