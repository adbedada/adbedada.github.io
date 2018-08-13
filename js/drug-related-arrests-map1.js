
var width = 900;
var height = 500
var map1 = d3.select(".map-1").append("svg")
.attr("width", width)
.attr("height", height)
.style('display', 'block')
.style('position', 'relative');

function scale (scaleFactor,width,height) {
return d3.geoTransform({
point: function(x, y) {
  this.stream.point( (x - width/2) * scaleFactor + width/2 , (y - height/2) * scaleFactor + height/2);
}
});
}

var first_period_r= d3.map();
var third_period_nd=d3.map();
var third_period_fd= d3.map();
var third_period_sd= d3.map();

var county_name = d3.map();

var path = d3.geoPath().projection(scale(0.7,width,height));

var x = d3.scaleLinear()
.domain([0, 2000])
.rangeRound([600, 865]);

var color = d3.scaleThreshold()
.domain([0, 125, 250, 500, 1000, 1500])
// .range(d3.schemePurples[8]);
.range(['#ffffff','#fbe3e3','#f5b6b6','#ed7a7a','#a61717','#6a0f0f','#200404']);

var g = map1.append("g")
.attr("class", "key")
.style("font-size", "9")
.attr("transform", "translate(0,20)");

var tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("padding", "5px")
          .style("opacity", 0);

g.selectAll("rect")
.data(color.range().map(function(d) {
  d = color.invertExtent(d);
  if (d[0] == null) d[0] = x.domain()[0];
  if (d[1] == null) d[1] = x.domain()[1];
  return d;
}))
.enter().append("rect")
.style("margin-top", 10)
.attr("height", 7)
.attr("x", function(d) { return x(d[0]); })
.attr("width", function(d) { return x(d[1]) - x(d[0]); })
.attr("fill", function(d) { return color(d[0]); });

g.append("text")
.attr("padding", "20px")
.attr("class", "caption")
.attr("x", x.range()[0])
.attr("y", -6)
.attr("fill", "#000")
.attr("text-anchor", "start")
 .attr("font-size", "12px")
.attr("font-weight", "bold")
.text("Incarceration rate (person/100,000)")
.attr("font-family", "Titillium Web");
g.call(d3.axisBottom(x)
.tickSize(9)
.tickFormat(function(x, i) { return i ? x : x ; })
.tickValues(color.domain()))
.select(".domain")
.remove();

d3.queue()
.defer(d3.json, "../../data/us-10m.v1.json")
.defer(d3.csv, "../../data/arrest_rate_v6.csv", function(d){
  first_period_r.set(d.id, +d.rate8992);
  third_period_nd.set(d.id, d.npd0912);
  third_period_fd.set(d.id, d.tpd0912_f);
  third_period_sd.set(d.id, d.tpd0912_s);
  county_name.set(d.id, d.name);
})

.await(ready);

function ready(error, us) {
if (error) throw error;

  map1.append("g")
  .attr("class", "counties")
  .attr("transform", "translate(0,-30)")
.selectAll("path")
.data(topojson.feature(us, us.objects.counties).features)
.enter().append("path")
  .attr("fill", function(d) { return color(d.rate = first_period_r.get(d.id)); })
  .attr("d", path)
.on("mousemove", function(d) {
    tooltip.transition()
        .duration(100)
        .style("opacity",0.95)
    tooltip.html("<div class = 'tip1'>"+ county_name.get(d.id) +"</div>"+
         "<br/>" + '<div class ="tip2">' + "Rate of arrest (per 100,000): " + d.rate +
          "<br><br/>"+ '<span class ="tip3">'+ third_period_nd.get(d.id)+'</span>'+ " the national average" +
          "<br/>"+ '<span class ="tip3">'+third_period_fd.get(d.id) + '</span>'+" the 1989 - 1992 rate" +
          "<br/>"+ '<span class ="tip3">'+third_period_sd.get(d.id) + '</span>'+" the 1992 - 2002 rate"
          +'</div>' )
        .style("left", (d3.event.pageX ) + "px")
        .style("top", (d3.event.pageY + 18) + "px")
  d3.select(this)
        .style("stroke", "#000")
        .style("stroke-width", 3);
      })
  .on("mouseout", function(d) {
    tooltip.transition()
        .duration(100)
        .style("opacity", 0)
        d3.select(this)
      .style("stroke", "none");
});

map1.append("path")
  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
  .attr("class", "states")
  .attr("d", path);
}
