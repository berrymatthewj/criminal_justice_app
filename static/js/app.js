//===============================
//  Read the data               // --?? need to add error checking ??
//===============================

// Load data from csv file and assign to variable
d3.csv("data/crime_and_incarceration_by_state.csv").then((csvData) => {
  console.log(csvData);

  // convert string values to number format
  csvData.forEach(d => {
    d.year = +d.year;
    d.prisoner_count = +d.prisoner_count;
    d.state_population = +d.state_population;

    //console.log(d);
    
  });
});

//-------------------------
//  Dropdown menu
//-------------------------

// Use the D3 library to read in csv file and
// create dropdown list of Years and States
function dropDownMenu() {
  
  // use d3 to select the dropdown html element
  var dropdownYear = d3.select("#selYear");
  var dropdownState = d3.select("#selState");

  // Load data from csv file and assign to variable
  d3.csv("data/crime_and_incarceration_by_state.csv").then((csvData) => {  
    //console.log(csvData);     

    // create list of unique values of years
    var allYears = d3.map(csvData, function(d) {return (d.year)}).keys();
    console.log(allYears);
    console.log(allYears.length);

    // create list of unique values of states
    var allStates = d3.map(csvData, function(d) { return (d.jurisdiction)}).keys();
    console.log(allStates);
    
    // create dropdown menu for Years
    for (var i=0; i < allYears.length; i++) {
      dropdownYear.append("option").text(allYears[i]).property("value", allYears[i]);
    }

    // create dropdown menu for States 
    for (var i=0; i < allStates.length; i++) {
      dropdownState.append("option").text(allStates[i]).property("value", allStates[i].jurisdiction);
    }    


    // initialize the dashboard with the first sample
    var theFirst = csvData[0];
    console.log(theFirst);

    var initialState = theFirst.jurisdiction;
    console.log(initialState);
    var initialYear = theFirst.year;
    console.log(initialYear);

    stateSummaryInfo(initialYear, initialState);
    buildPieChart(initialYear, initialState);
    buildMap(initialYear);
    //buildPlot(initialState);    
    buildLinePlot(initialState);
    


  });
  
}

//-------------------------
//  Summary Info Panel
//-------------------------
function stateSummaryInfo(chosenYear, chosenState) {
  console.log(chosenState)
  
  d3.csv("data/crime_and_incarceration_by_state.csv").then((csvData) => { 
  
     var filteredData = csvData.filter(d => (d.year === chosenYear) && (d.jurisdiction === chosenState))
     console.log(filteredData);

    // use d3 to select 'Demographic Info' panel by id
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
  d3.csv("data/crime_and_incarceration_by_state.csv").then((csvData) => { 
    
    var filteredData = csvData.filter(d => (d.year === chosenYear) && (d.jurisdiction === chosenState))
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
    })
    console.log(dataArray);

        /*
        agg_assault: "12250"
        burglary: "40642"
        jurisdiction: "ALABAMA"
        larceny: "119992"
        murder_manslaughter: "379"
        prisoner_count: "24741"
        property_crime_total: "173253"
        rape_legacy: "1369"
        robbery: "5584"
        state_population: "4468912"
        vehicle_theft: "12619"
        violent_crime_total: "19582"
        year: "2001"

        ** Notes:  two categories: violent and property crimes.
             Aggravated assault, rape, murder, and robbery are classified as violent while burglary, larceny, and motor vehicle theft are classified as property crimes
        */

    var values=[];
    var labels=[];

    Object.entries(dataArray[0]).forEach(([key, value]) => {
      //console.log(key);       
      values.push(value);
      labels.push(key);
    });    
    
    console.log(values);
    console.log(labels); 

    var pieChartData = [{
      values: values,
      labels: labels,
      type: 'pie',
      // for donut chart add the following
      text: 'violent_crime_total',
      textposition: 'inside',
      domain: {column: 0},
      //name: 'some name here',
      //hoverinfo: 'label+percent+name',
      hole: .5      
    }];
    
    var layout = {
      height: 400,
      width: 500,
      title: "Type of Crime",
      annotations: [
        { text: "<b>Total: </b><br>violent crime<br>"+`${filteredData[0].violent_crime_total}`+"<br>property_crime<br>"+`${filteredData[0].property_crime_total}`,
          x: 0.55,
          y: 0.35
        }
      ]
      
    };
    
    Plotly.newPlot("pie", pieChartData, layout);

  });    
}


function unpack(rows, key) {
  return rows.map(function(row) { return row[key];
  });
}


//  *** Grouped Bar ***
// function buildPlot(chosenState) {
//   d3.csv("data/crime_and_incarceration_by_state.csv").then((csvData) => {
//     var filteredData = csvData.filter(d => d.jurisdiction === chosenState)
//      console.log(filteredData);

//      var trace1 = {
//       x: unpack(filteredData, 'year'),
//       y: unpack(filteredData, "property_crime_total"),
//       type: 'bar',
//       name: "Property Crime, Total"
//     };
    
//     var trace2 = {
//       x: unpack(filteredData, 'year'),
//       y: unpack(filteredData, "violent_crime_total"),
//       type: 'bar',
//       name: "Violent Crime, Total"
//     };
    
//     var data = [trace1, trace2];

//     var layout = {
//       barmode: "group",
//       title: '<b>'+`${chosenState}`+'</b><br>Property Crime and Violent Crime Over Time'
//     };
    
//     Plotly.newPlot('gr-bar', data, layout);
//   });
// }

//-----------------------------------------------------------------


// *** Line Plot ***
function buildLinePlot(chosenState) {
  d3.csv("data/crime_and_incarceration_by_state.csv").then((csvData) => {
    var filteredData = csvData.filter(d => d.jurisdiction === chosenState)
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
      title: '<b>'+`${chosenState}`+'</b><br>Property Crime and Violent Crime Over Time'
    };
    
    Plotly.newPlot('line', data, layout);
  });
}


// *** Map ***
function buildMap(chosenYear) {
  d3.csv("data/crime_and_incarceration_by_state.csv").then((csvData) => {
    var filteredData = csvData.filter(d => d.year === chosenYear)
      console.log(filteredData);

      console.log(unpack(filteredData, "prisoner_count"));
      
    //-------------------------
    //  Choropleth Map - Plotly
    //-------------------------
    var dataArray = filteredData.map(function(d) {
      return {
        jurisdiction: d.jurisdiction,
        state_population: +d.state_population,
        prisoner_count: +d.prisoner_count
      }      
    });
    console.log(dataArray);   
    
    console.log(unpack(dataArray, "prisoner_count"))

    var mapData = [{
      type: 'choropleth',
      locationmode: 'USA-states',
      locations: ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','PR','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'],
      //unpack(dataArray, 'jurisdiction'), //unpack(rows, 'Postal'),
       // --> sh b state abbr!!
      z: unpack(dataArray, 'prisoner_count'),  //unpack(rows, 'Population'),
      text: unpack(dataArray, "jurisdiction"), //unpack(rows, 'State'), 
      // colorscale: [
      //   [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
      //   [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
      //   [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
      // ],
      colorbar: {
        title: '# of Prisoners',
      //   thickness: 0.2
      },
      autocolorscale: true

      }];
        
    var layout = {
      title: "Number of Prisoners in Each State, "+`${chosenYear}`,
      geo:{
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

    Plotly.newPlot("map", mapData, layout, {showLink: false}); 
  
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
        console.log(chosenYear);        

      }
  // get value of the next state selection
      var newState = d3.select("#selState").property("value")
      if (newState != chosenState) {

        // replace chosenState with a new value
        chosenState = newState;
        console.log(newState);
      }
  
  // update plots with the new values
  stateSummaryInfo(chosenYear, chosenState);
  buildPieChart(chosenYear, chosenState);
  buildLinePlot(chosenState);
  buildMap(chosenYear);
  
  
}


dropDownMenu();


  