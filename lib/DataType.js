/**
 * DataType
 * A enum representing different data types for cells/columns 
 */
var DataType = {
  
  String: 0,
  Number: 1,
  Boolean: 2,
  Date: 3,
  Object: 4,

  /**
   * DataType.convert
   * Returns the DataType corresponding to the given configuration
   * @param {string} type - The data type in string form
   * @return {DataType}
   */
  convert: function (type) {
    switch (type) {
      case "text": return DataType.String;
      case "num": return DataType.Number;
      case "date": return DataType.Date;
      case "checkbox": return DataType.Boolean;
    }
  }

}