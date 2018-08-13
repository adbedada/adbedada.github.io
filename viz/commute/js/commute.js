
var width = 700,
    height = 700,
    outerRadius = Math.min(width, height) / 2 - 70,
    innerRadius = outerRadius - 15;

var formatPercent = d3.format("0.01%");

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var layout = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.ascending);

var path = d3.svg.chord()
    .radius(innerRadius);

var svg = d3.select(".commute").append("svg")
    .attr("color", "#fff")
    .attr("width", width)
    .attr("height", height)
    .attr("margin", "0 auto")
  .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("circle")
    .attr("r", outerRadius);

queue()
    .defer(d3.csv, "data/atl_commute.csv")
    .defer(d3.json, "data/commute_matrix.json")
    .await(ready);

function ready(error, cities, matrix) {
  if (error) throw error;

  // Compute the chord layout.
  layout.matrix(matrix);

  // Add a group per neighborhood.
  var group = svg.selectAll(".group")
      .data(layout.groups)
    .enter().append("g")
      .attr("class", "group")
      .on("mouseover", mouseover);

  // Add a mouseover title.
  group.append("title").text(function(d, i) {
    return cities[i].name + ": " + formatPercent(d.value) + " of origins";
  });

  // Add the group arc.
  var groupPath = group.append("path")
      .attr("id", function(d, i) { return "group" + i; })
      .attr("d", arc)
      .style("fill", function(d, i) { return cities[i].color; });

  // Add a text label.
  var groupText = group.append("text")
      // .attr("x", 6)
      .attr("dy", 15)
      .attr("font-size", "13px")
      .attr("color", "#fff")
      .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (innerRadius + 26) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      .text(function(d, i) { return cities[i].name; });



  var chord = svg.selectAll(".chord")
      .data(layout.chords)
    .enter().append("path")
      .attr("class", "chord")
      .style("fill", function(d) { return cities[d.source.index].color; })
      .attr("d", path);

  // Add an elaborate mouseover title for each chord.
  chord.append("title").text(function(d) {
    return cities[d.source.index].name
        + " → " + cities[d.target.index].name
        + ": " + formatPercent(d.source.value)
        + "\n" + cities[d.target.index].name
        + " → " + cities[d.source.index].name
        + ": " + formatPercent(d.target.value);
  });

  function mouseover(d, i) {
    chord.classed("fade", function(p) {
      return p.source.index != i
          && p.target.index != i;
    });
  }
}
