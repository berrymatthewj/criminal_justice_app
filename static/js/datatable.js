//===============================
//  Read the data
//===============================

// Create URL to the Flask app route
const url = '/loadData';

// ---------------------------
//  *** WebDataRocks *** 
// ---------------------------

// Load data from  file and assign to variable
d3.json(url).then(function(data) {
  var pivot = new WebDataRocks({
    container: "#wdr-component",
    toolbar: true,
    report: {
      dataSource: {
        data: data
      },
      "options": {
        "grid": {
          "type": "flat",
          "showTotals": "off",
          "showGrandTotals": "off"
        }
      },
      "formats": [
        {
          "name": "",
          "thousandsSeparator": "",
          "decimalSeparator": ".",
          "currencySymbol": "",
          "currencySymbolAlign": "left",
          "nullValue": "",
          "textAlign": "right",
          "isPercent": false
        }
      ]
    }
  });

})

