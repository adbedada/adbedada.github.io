// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var barGraph2 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("../../data/arrest_rate_v6.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.sales = +d.rate0912;
  });

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  // append the rectangles for the bar chart
  barGraph2.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.sales); })
      .attr("height", function(d) { return height - y(d.sales); });

  // add the x Axis
  barGraph2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  barGraph2.append("g")
      .call(d3.axisLeft(y));

});

// // set margins
// var margin ={top: 20, right:20, bottom:30, left:40},
// 		graphWidth= 950 - margin.left - margin.right,
// 		graphHeight = 500 - margin.top - margin.bottom;
//
// // set scales
// var x = d3.scaleBand().range([0,graphWidth])
// var y = d3.scaleLinear().range([graphHeight,0])
//
// // append svg
//
// var barGraph = d3.select("body").append("svg")
// 			.attr("width", width + margin.left + margin.right)
// 			.attr("height", height + margin.top + margin.bottom)
// 		.append("g")
// 			.attr("transform",
// 						"translate("+ margin.left +"," + margin.top+")");
//
// d3.csv("../../data/arrest_rate_v6.csv", function(error, data){
// 	if (error) throw error;
// data.forEach(function(d){
// 	d.rate0912 = +d.rate0912;
// });
// // scale the range of the Data
//
// x.domain(d3.extent(function(){return d.name;}));
// y.domain([0,d3.max(data, function(d){return d.rate0912;})]);
//
// barGraph.selectAll(".bar")
// 			.data(data)
// 			.enter().append("rect")
// 			.attr("x", function(d){return x(d.name);})
// 			.attr("width",x.bandWidth())
// 			.attr("y", function(d){return y(d.rate0912);})
// 			.attr("height", function(d){return height -y (d.rate0912);});
//
// barGraph.append("g")
// 				.attr("transform",
// 							"translate(0,"+graphHeight+")")
// 				.call(d3.axisBottom(x));
//
// barGraph.append("g")
// 				.call(d3.axisLeft(y));
// });
