var Column = function (columnId, friendlyName, type) {
  
  this.columnId = columnId;
  this.friendlyName = friendlyName;
  this.type = type;
  this.visible = true;

  this.getId = function () {
    return this.columnId;
  }

  this.getFriendlyName = function () {
    return this.getFriendlyName;
  }

  this.setFriendlyName = function (friendlyName) {
    this.friendlyName = friendlyName;
  }

  this.getType = function () {
    return this.type;
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