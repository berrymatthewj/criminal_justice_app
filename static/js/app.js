//===============================
//  Read the data
//===============================

// Create URL to the Flask app route
const url = '/loadData';

//-------------------------
//  Dropdown menu
//-------------------------

// Fetch the JSON data and console log it
function dropDownMenu() {

    // use d3 to select the dropdown html element
    var dropdownYear = d3.select("#selYear");
    var dropdownState = d3.select("#selState");

    // Load data from  file and assign to variable
    d3.json(url).then(function(data) {
        console.log(data);

        // create list of unique values of years
        var allYears = d3.map(data, function(d) { return (d.year) }).keys();
        //console.log(allYears);      

        // create list of unique values of states
        var allStates = d3.map(data, function(d) { return (d.jurisdiction) }).keys();
        //console.log(allStates);

        // create dropdown menu for Years
        for (var i = 0; i < allYears.length; i++) {
            dropdownYear.append("option").text(allYears[i]).property("value", allYears[i]);
        }

        // create dropdown menu for States 
        for (var i = 0; i < allStates.length; i++) {
            dropdownState.append("option").text(allStates[i]).property("value", allStates[i].jurisdiction);
        }


        // initialize the dashboard with the first state and year
        var theFirst = data[0];

        var initialState = theFirst.jurisdiction;
        var initialYear = theFirst.year;

        stateSummaryInfo(initialYear, initialState);
        buildPieChart(initialYear, initialState);
        buildLinePlot(initialState);
        buildMap(initialYear);

    });
}


//-------------------------
//  Summary Info Panel
//-------------------------
function stateSummaryInfo(chosenYear, chosenState) {

    d3.json(url).then((data) => {

        var filteredData = data.filter(d => (d.year === chosenYear) && (d.jurisdiction === chosenState))
        console.log(filteredData);

        // use d3 to select 'Summary Info' panel by id
        var infoPanel = d3.select("#sumState");

        // clear any previous input
        infoPanel.html("");

        // add each key-value pair to the panel
        Object.entries(filteredData[0]).forEach(([key, value]) => {
            infoPanel.append("p").text(`${key}: ${value}`);
        });

    });
}


//===============================
//  Build Plots
//===============================

// Create a function to build plots
function buildPieChart(chosenYear, chosenState) {
    // use d3 to fetch the data for the plots
    d3.json(url).then((data) => {

        var filteredData = data.filter(d => (d.year === chosenYear) && (d.jurisdiction === chosenState))
        console.log(filteredData);

        //-------------------------
        //  Pie Chart
        //-------------------------

        var dataArray = filteredData.map(function(d) {
            return {
                agg_assault: +d.agg_assault,
                burglary: +d.burglary,
                larceny: +d.larceny,
                murder_manslaughter: +d.murder_manslaughter,
                //property_crime_total: +d.property_crime_total,
                rape_legacy: +d.rape_legacy,
                robbery: +d.robbery,
                vehicle_theft: +d.vehicle_theft,
                //violent_crime_total: +d.violent_crime_total
            }
        });
        console.log(dataArray);

        var values = [];
        var labels = [];

        Object.entries(dataArray[0]).forEach(([key, value]) => {
            values.push(value);
            labels.push(key);
        });

        // console.log(values);
        // console.log(labels);

        var pieChartData = [{
            values: values,
            labels: labels,
            type: 'pie',
            text: 'violent_crime_total',
            textposition: 'inside',
            domain: { column: 0 },
            hole: .5
        }];

        var layout = {
            height: 400,
            width: 500,
            title: '<b>' + `${chosenState}` + ", " + `${chosenYear}` + '</b><br>Types of Crime',
            annotations: [{
                text: "<b>Total: </b><br>violent crime<br>" + `${filteredData[0].violent_crime_total}` + "<br>property crime<br>" + `${filteredData[0].property_crime_total}`,
                x: 0.55,
                y: 0.35
            }]
        };

        Plotly.newPlot("pie", pieChartData, layout);

    });
}


function unpack(rows, key) {
    return rows.map(function(row) {
        return row[key];
    });
}

//-------------------------
//  Line Plot
//-------------------------
function buildLinePlot(chosenState) {
    d3.json(url).then((data) => {
        var filteredData = data.filter(d => d.jurisdiction === chosenState)
        console.log(filteredData);

        var trace1 = {
            x: unpack(filteredData, 'year'),
            y: unpack(filteredData, "property_crime_total"),
            type: 'scatter',
            name: "Property Crime, Total"
        };

        var trace2 = {
            x: unpack(filteredData, 'year'),
            y: unpack(filteredData, "violent_crime_total"),
            type: 'scatter',
            name: "Violent Crime, Total"
        };

        var data = [trace1, trace2];

        var layout = {
            title: '<b>' + `${chosenState}` + '</b><br>Property Crime and Violent Crime Over Time'
        };

        Plotly.newPlot('line', data, layout);
    });
}


//-------------------------
//  Choropleth Map - Plotly
//-------------------------
function buildMap(chosenYear) {
    d3.json(url).then((data) => {
        var filteredData = data.filter(d => d.year === chosenYear)
        console.log(filteredData);

        var dataArray = filteredData.map(function(d) {
            return {
                jurisdiction: d.jurisdiction,
                location: d.location,
                state_population: +d.state_population,
                prisoner_count: +d.prisoner_count
            }
        });
        console.log(dataArray);

        var mapData = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: unpack(dataArray, 'location'),
            z: unpack(dataArray, 'prisoner_count'),
            text: unpack(dataArray, "jurisdiction"),
            colorbar: {
                title: '<b># of Prisoners</b>'
            },
            autocolorscale: true
        }];

        var layout = {
            title: "Number of Prisoners in Each State, " + `${chosenYear}`,
            geo: {
                scope: 'usa',
                //countrycolor: 'rgb(255, 255, 255)',
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                showlakes: true,
                lakecolor: 'rgb(255, 255, 255)',
                subunitcolor: 'rgb(255, 255, 255)',
                //lonaxis: {},
                //lataxis: {}
            }
        };

        Plotly.newPlot("map", mapData, layout, { showLink: false });

    });
}


//===============================
//  Create Event Handlers
//===============================

// Select the html ids and create event handlers
d3.select("#selYear").on("change", optionChanged);
d3.select("#selState").on("change", optionChanged);

// Function to update entries
function optionChanged(chosenYear, chosenState) {

    // get value of the year selection
    var newYear = d3.select("#selYear").property("value")
    if (newYear !== chosenYear) {

        // replaces chosenYear with a new value
        chosenYear = newYear;
        //console.log(chosenYear);
    }

    // get value of the next state selection
    var newState = d3.select("#selState").property("value")
    if (newState != chosenState) {

        // replace chosenState with a new value
        chosenState = newState;
        //console.log(newState);
    }

    // update plots with the new values
    stateSummaryInfo(chosenYear, chosenState);
    buildPieChart(chosenYear, chosenState);
    buildLinePlot(chosenState);
    buildMap(chosenYear);

}

dropDownMenu();