
var linechart = d3.select(".linechart").select("svg"),
		margin = {top: 20, right: 80, bottom: 30, left: 100},
		width = linechart.attr("width") - margin.left - margin.right,
		height = linechart.attr("height") - margin.top - margin.bottom,
		g = linechart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0]);

var tooltip2 = d3.select("body")
							.append("div")
							.attr("class", "tooltip2")
							.style("padding", "10px")
							.style("opacity", 0);

var line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.year); })
		.y(function(d) { return y(d.rate); });

d3.csv("../../data/states_arrest_rate.csv", type, function(error, data) {
	if (error) throw error;
	var states = data.columns.slice(1).map(function(id) {
		return {
			id: id,
			values: data.map(function(d) {
				return {year: d.year, rate: d[id]};
			})
		};
	});

	x.domain(d3.extent(data, function(d) { return d.year; }));
	y.domain([
		d3.min(states, function(c) { return d3.min(c.values, function(d) { return d.rate; }); }),
		d3.max(states, function(c) { return d3.max(c.values, function(d) { return d.rate; }); })
	]);

	g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

	g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y))
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("fill", "#000")
			.text("Rate of Arrest");

	var state = g.selectAll(".state")
		.data(states)
		.enter().append("g")
			.attr("class", "state");

	state.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function(d) {
				if (d.id != "United States")
					return("#d0cee5")
				else { return  "#f76288"};})
			.style("stroke-width", function(d){
				if (d.id != "United States")
					return(1.5)
				else { return 2};})
			.on("mousemove", function(d) {
				tooltip2.transition()
						.duration(10)
						.style("opacity",1)
				tooltip2.html('<div class ="linetip">'+d.id +'</div>')
						.style("left", (d3.event.pageX - 40) + "px")
						.style("top", (d3.event.pageY + 17) + "px")
			d3.select(this)
						.style("stroke", "#6f3687")
						.style("stroke-width", 3);
					})

			.on("mouseout", function(d) {
				tooltip2.transition()
						.duration(200)
						.style("opacity", 0)
					d3.select(this)
						.style("stroke", function(d) {
				if (d.id != "United States")
					return("#d0cee5")
				else { return  "#f76288"};
			})
			.style("stroke-width", function(d){
				if (d.id != "United States")
					return(1.5)
				else { return 2};});
		})

				d3.selectAll('g').on('mouseenter', function() {
				this.parentElement.appendChild(this);
			})
	state.append("text")
			.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.rate) + ")"; })
			.attr("x", 3)
			.attr("dy", "0.35em")
			.style("font", "10px sans-serif")
			.text(function(d) { if (d.id != "United States")
					return("")
				else { return  "National Average"}; });
});

function type(d, _, columns) {
	d.year = parseTime(d.year);
	for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
	return d;
}
