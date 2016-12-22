var DataGenerator = {
    
    /**
     * DataGenerator.columns
     * Returns all the columns in the correct order which will be generated
     * @static
     * @returns {object[]}
     */
    columns: function () {
        return [
            { field: "code", title: "Code", format: "$txt" },
            { field: "country", title: "Country", format: "$txt" },
            { field: "currency", title: "Currency", format: "$txt" },
            { field: "valuation", title: "Valuation", format: "$num{3}" },
            { field: "price", title: "Price", format: "$price{currency}" },
            { field: "paid", title: "Paid", format: "$bool" },
            { field: "created", title: "Created", format: "$date{dd/mm/yy}" }
        ];
    },

    /**
     * DataGenerator.generate
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
            rndNo = this.getRndNumber(0, arrCurrencies.length);
            row["code"] = "Code" + i;
            row["currency"] = arrCurrencies[rndNo];
            row["price"] = (Math.random() * this.getRndNumber(0, 1000));
            row["country"] = arrCountries[rndNo];
            row["valuation"] = Math.random() * this.getRndNumber(0, 50) * (i+1);
            row["created"] = this.randomDate(new Date(2000, 1, 1), new Date());
            row["paid"] = Math.round(Math.random());
            data.push(row);
        }

        return data;

    },

    /**
     * DataGenerator.randomDate
     * Returns a formatted date between the two given time intervals
     * @static
     * @param {date} start - From the start date
     * @param {date} end - Until the end date
     * @returns {string}
     */
    randomDate: function (start, end) {
        d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        var dd = d.getDate();
        var mm = d.getMonth()+1;

        var yyyy = d.getFullYear();
        if (dd<10){
            dd='0'+dd;
        } 
        if (mm<10){
            mm='0'+mm;
        } 
        return dd+'/'+mm+'/'+yyyy;
    },

    /**
     * DataGenerator.getRndNumber
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