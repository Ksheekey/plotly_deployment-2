var apiKey = "8zWMB-FRvbxgkyE5qywd";

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

function getMonthlyData() {

  var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`;
  d3.json(queryUrl).then(function(data) {
    // @TODO: Unpack the dates, open, high, low, close, and volume
    var dates = unpack(data.dataset.data, 0)
    var openPrices = unpack(data.dataset.data, 1)
    var highPrices = unpack(data.dataset.data, 2)
    var lowPrices = unpack(data.dataset.data, 3)
    var closingPrices = unpack(data.dataset.data, 4)
    var volume = unpack(data.dataset.data, 5)
    
    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
  });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
}

function buildPlot() {
  var url = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2017-01-01&end_date=2018-11-22&api_key=${apiKey}`;

  d3.json(url).then(function(data) {
    console.log(data.dataset)
    var dataSet = data.dataset

    var name = dataSet.name
    var stock = dataSet.dataset_code
    var startDate = dataSet.start_date
    var endDate = dataSet.end_date
    var dates = unpack(data.dataset.data, 0)
    var open = unpack(data.dataset.data, 1)
    var high = unpack(data.dataset.data, 2)
    var low = unpack(data.dataset.data, 3)
    var close = unpack(data.dataset.data, 4)
    console.log(high)

    // @TODO: Grab Name, Stock, Start Date, and End Date from the response json object to build the plots
    
    // @TODO: Unpack the dates, open, high, low, and close prices


    getMonthlyData();

    // Closing Scatter Line Trace
    var trace1 = {
      x:dates,
      y:close,
      type:"scatter"
    };

    // Candlestick Trace
    var trace2 = {
      type:"candlestick",
      x:dates,
      open:open,
      close:close,
      high:high,
      low:low
    };

    var data = [trace1, trace2];

    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("plot", data, layout);

  });
}
buildPlot();

// from bs4 import BeautifulSoup
// import requests

// url = 'https://en.wikipedia.org/wiki/Amazon_(company)'
// response = requests.get(url)
// soup = BeautifulSoup(response.text, 'html.parser')
// results = soup.find_all('span', class_='rt-commentedText')
// results