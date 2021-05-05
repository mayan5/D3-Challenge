// Part 1: The x-axis scale & y-axis scale
// Part 2: The axis label below the X axis and next to the Y axis
// Part 3: The circle bubbles
// Part 4: The (abbr state) text inside the circle bubbles
// Part 5: The tooltip popup on mouse move-over

// Set SVG parameters

var svgWidth = 1000;
var svgHeight = 500;

// Margin for SVG graphics

var margin = {
  top: 20,
  bottom: 80,
  left: 100,
  right: 40
};

var width = svgWidth - margin.left - margin.right;    // 860
var height = svgHeight - margin.top - margin.bottom;  // 400

// Create the SVG canvas container inside <div id="scatter"> in index.html
// Change background color, check .chart in css/d3Style.css
// From Inspector, <svg width="1000" height="500" fill="red" class="chart"></svg>

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("fill", "red")      // font color for labels
  .attr("class", "chart");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// from Inspect, SVG tag got created  
//* <div id="scatter">
// {/* <svg width="960" height="500" class="chart"><g transform="translate(100, 20)"></g></svg></div > *// */}
//Import data

d3.csv("assets/data/data.csv").then(function (myData) {
  console.log("myData");
  console.log(myData);

  myData.forEach(function (st_data) {
    // st_data.state = st_data.state;
    // st_data.abbr = st_data.abbr;
    st_data.poverty = +st_data.poverty;
    st_data.obesity = +st_data.obesity;
    console.log("obesity")
    console.log(st_data.obesity)
  });


  // Part 1: The x-axis scale & y-axis scale
  // define scale, wich accepts input between 20 and max (the domain) and maps it to output between 0 and width (the range)

  var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(myData, d => d.obesity + 1)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([5, d3.max(myData, d => d.poverty + 5)])
    .range([height, 0]);

  // create axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //Append to chartGroup
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //   // ================================================

  // Part 2: The axis label below the X axis and next to the Y axis
  // y-axis labels  -200 -40 (y axis is used for x coordinate because of -90 rotation.)

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("class", "aText")
    .text("In Poverty (%)");

  console.log("y axis label")
  console.log((0 - (height / 2)), (0 - margin.left + 60))

  // x-axis labels  430  450

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("Obesity (%)");

  console.log("x axis label")
  console.log((width / 2), (height + margin.top + 30))

  //   // ================================================
  //   // Part 3: The circle bubbles

  var circlesGroup = chartGroup.selectAll("null")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "10")
    .attr("fill", "blue")   // remove fill: from .stateCircle in css/d3Style.css 
    .attr("class", "stateCircle");

  //   //<circle cx="320.5917" cy="292.0930" r="10" fill="blue" class="stateCircle"></circle>
  //   //======================================================================================
  //   // Part 4: The (abbr state) text inside the circle bubbles

  var stateAbbr = chartGroup.selectAll(null)
    .data(myData)
    .enter()
    .append("text");

  stateAbbr
    .attr("x", function (d) {
      return xLinearScale(d.obesity);
    })
    .attr("y", function (d) {
      return yLinearScale(d.poverty) + 4
    })
    .text(function (d) {
      return d.abbr;
    })
    .attr("class", "stateText")
    .attr("font-size", "9px");

  //   // ===================================================================================
  //   // Part 5: The tooltip popup on mouse move-over
  //   // .d3-tip in css/d3Style.css
  //   // .offset[top-down, left-right]

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, 60])
    .html(function (tp) {
      var theState = "<div>" + tp.state + "</div>";
      var theX = "<div>Obesity: " + tp.obesity + "%</div>";
      var theY = "<div>Poverty: " + tp.poverty + "%</div>";
      //return (`${tp.state}`);
      return theState + theX + theY;
    });

  chartGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    //mouseout
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

}).catch(function (error) {
  console.log(error);
});