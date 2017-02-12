/**
 * A enum representing different data types for cells/columns
 * @enum {integer}
 * @namespace
 */
var DataType = {
  
  /**
   * Representing text types
   * @ignore
  */
  String: 0,

  /**
   * Representing numerical types
   * @ignore
   */
  Number: 1,

  /**
   * Either true or false, shown as checkboxes 
   * @ignore
   */
  Boolean: 2,

  /**
   * Can be instantitated with a datepicker
   * @ignore
   */
  Date: 3,

  /**
   * Any other types
   * @ignore
   */
  Object: 4

}