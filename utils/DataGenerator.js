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
            { field: "fullname", title: "Fullname", format: "$txt" },
            { field: "county", title: "County", format: "$txt" },
            { field: "currency", title: "Currency", format: "$txt" },
            { field: "valuation", title: "Valuation", format: "$num{3}" },
            { field: "price", title: "Price", format: "$price{currency}" },
            { field: "created", title: "Created", format: "$date{dd/mm/yyyy}" }
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
       
        var arrCounties = ["Kent", "Sussex", "Devon"];
        var arrCurrencies = ["USD", "GBP", "EUR"];
        
        // define the return data
        var data = [];
        for (var i = 0; i < numberOfRows; i++) {
            var row = {};
            row["code"] = "Code" + i;
            row["shortname"] = "SN" + i;
            row["fullname"] = "FullName" + i;
            row["myimage"] = "fa-bar-chart";
            row["no_of_children"] = this.getRndNumber(0, 10);
            row["currency"] = arrCurrencies[this.getRndNumber(0, arrCurrencies.length)];
            row["price"] = (Math.random() * this.getRndNumber(0, 1000));
            row["county"] = arrCounties[this.getRndNumber(0, arrCounties.length)];
            row["valuation"] = Math.random() * this.getRndNumber(0, 50) * i;
            row["created"] = this.randomDate(new Date(2000, 1, 1), new Date());
            row["superwealthy"] = (this.getRndNumber(1, 3) == 1 ? "Y" : "N");
            row["checkbox"] = this.getRndNumber(1, 5);
            data.push(row);
        }

        return data;

    },

    /**
     * DataGenerator.randomDate
     * Returns a date between the two given time intervals
     * @static
     * @param {date} start - From the start date
     * @param {date} end - Until the end date
     * @returns {date}
     */
    randomDate: function (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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