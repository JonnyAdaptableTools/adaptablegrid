/**
 * A static class representing methods to generate arbitrary data for the grid
 * @namespace
 */
var DataGenerator = {
  
  /**
   * Returns all the columns in the correct order which will be generated
   * @static
   * @returns {object[]}
   */
  columns: function () {
    return [
      { field: "id", title: "Transaction", type: 'num', format: "0", readonly: true },
      { field: "country", title: "Country", type: 'text' },
      { field: "currency", title: "Currency", type: 'text' },
      { field: "valuation", title: "Valuation", type: 'num', format: "0.000" },
      { field: "price", title: "Price", type: 'num', format: "0,0.00" },
      { field: "paid", title: "Paid", type: 'checkbox' },
      { field: "created", title: "Created", type: 'date', format: "DD/MM/YYYY" }
    ];
  },

  /**
   * Generate a grid with the given number of rows
   * @static
   * @param {integer} numberOfRows - The number of objects to return
   * @returns {object[]}
   */
  generate: function (numberOfRows) {

    var arrCountries = ["United Kingdom", "USA", "Australia", "Israel", "Canada", "Italy", "Spain"];
    var arrCurrencies = ["GBP", "USD", "AUD", "ILS", "CAD", "EUR", "EUR"];
    
    // define the return data
    var data = [];
    for (var i = 0; i < numberOfRows; i++) {
      var row = {};
      rndNo = DataGenerator.getRndNumber(0, arrCurrencies.length);
      row["id"] = i+1;
      row["currency"] = arrCurrencies[rndNo];
      row["price"] = (Math.random() * DataGenerator.getRndNumber(0, 1000));
      row["country"] = arrCountries[rndNo];
      row["valuation"] = Math.random() * (i+1);
      row["created"] = DataGenerator.randomDate(new Date(2000, 1, 1), new Date());
      row["paid"] = Math.round(Math.random());
      data.push(row);
    }

    return data;

  },

  /**
   * Returns a formatted date between the two given time intervals
   * @static
   * @param {date} start - From the start date
   * @param {date} end - Until the end date
   * @returns {integer}
   */
  randomDate: function (start, end) {
    d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d.getTime();
  },

  /**
   * Generates a number between the minimum and maximum given
   * @static
   * @param {integer} min - Minimum value
   * @param {integer} max - Maximum value
   * @returns {integer}
   */
  getRndNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

}