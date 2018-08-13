d3.csv("hwy-fatals.csv", function(data) {
    
    var dateFormat = d3.time.format('%m/%d/%Y %H%M');
        data.forEach(function (d) {
          d.dd = dateFormat.parse(d.Timestamp);
          d.datestamp = d3.time.day(new Date(d.dd));
  });      

      var xf = crossfilter(data);
      var all = xf.groupAll().reduceSum(function(d){return d.fatals;});

    
      var fatalsMap = dc_leaflet.markerChart("#holder .map"),
          DayweekChart = dc.pieChart(".fatal-summary-vert .pie"),
          DailyChart = dc.lineChart(".fatal-summary-vert .line"),
          HourlyChart = dc.barChart(".fatal-summary-vert .bar"),
          fatalCount = dc.dataCount(".dc-data-count"),
          YearRoundChart =dc.lineChart(".year .year-round-chart")
           

       
      var fatalsLocation = xf.dimension(function(d) { return d.geo; });
      var day_of_week = xf.dimension(function(d) { return d.day_of_week; });
      var day = xf.dimension(function(d) { return +d.day; });
      var hour = xf.dimension(function(d) { return d.hour; });
      var yearRound= xf.dimension(function(d) {return d.datestamp; });



      var LocationGroup = fatalsLocation.group().reduceCount(function(d){return d.fatals;});
      var Day_of_weekGroup = day_of_week.group().reduceSum(function(d){return d.fatals ;});
      var DayGroup = day.group().reduceSum(function(d){return d.fatals; });
      var hourGroup = hour.group().reduceSum(function(d){return d.fatals ;});
      var yearRoundGroup = yearRound.group().reduceSum(function(d){return d.fatals ;});
    
  
      fatalsMap
         .dimension(fatalsLocation)
          .group(LocationGroup)
          .center([38.66,-112.859])
          .zoom (4.4999)
          .cluster(true);  


      DayweekChart 
          .dimension(day_of_week)
          .group(Day_of_weekGroup)
          .height(175)
          .externalRadiusPadding(11)
          .innerRadius(37)
          .renderLabel(true)
          .renderTitle(true)
          .ordering(function(d) {
          if(d.day_of_week == "Monday") return 0;
            else if(d.day_of_week == "Tuesday") return 1; });

       HourlyChart
          .dimension(hour)
          .group(hourGroup)
          .elasticY(true)
          .gap(1)
          .x(d3.scale.linear().domain([0,24]))
          .margins({top: 20, right: 15, bottom: 20, left: 40})
          .width(300)
          .colors(["#1a87e0"])
          .height(182);
          
           

      DailyChart
          .dimension(day)
          .group(DayGroup)
          .width(300)
          .height(182)
          .x(d3.scale.linear().domain([0,31]))
          .margins({top: 20, right: 15, bottom: 20, left: 40})
          .renderDataPoints(true)
          .elasticY(true)
          .colors(["#1a87e0"])
          .interpolate('step-before');



      fatalCount
        .dimension(xf)
        .group(all)
         .html({
            some: '<div class ="filter-count">%filter-count</div>' +
                '<div class ="reset-filters-button"><a class ="reset" href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset Filter</a></div>'
        });
      // YearRoundChart
      //   .dimension(yearRound)
      //   .group(yearRoundGroup)
      //   .width(900)
      //   .height(120)
      //   .x(d3.time.scale().domain([new Date(01,01, 2015), new Date (11,31, 2015)]))
      //   .xUnits(d3.time.months);


      dc.renderAll();
});
