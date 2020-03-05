// set the dimensions and margins of the graph
var margin_b = {top: 10, right: 30, bottom: 30, left: 40},
    width_b = 1000 - margin_b.left - margin_b.right,
    height_b = 800 - margin_b.top - margin_b.bottom;

// append the svg object to the body of the page
var svg_b = d3.select("#boxPlot")
    .append("svg")
    .attr("width", width_b + margin_b.left + margin_b.right)
    .attr("height", height_b + margin_b.top + margin_b.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_b.left + "," + margin_b.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("earthquakes.csv", function (d) {
    return{
        id : d.id,
        impact: {
            gap: +d.gap,
            magnitude: +d.magnitude,
            significance: +d.significance
        },
        location: {
            depth: +d.depth,
            distance: +d.distance,
            latitude: +d.latitude,
            longitude: +d.longitude,
            name: d.name
        },
        time: {
            hour: +d.hour
        }
    }
}).then(function (data) {
    /*console.log(data);*/
    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) {
            return d.time.hour;
        })
        .rollup(function(d) {
            mapout = d.map(function(g) { return Number(g.impact.significance);}).sort(d3.ascending)
            q1 = d3.quantile(d.map(function(g) { return Number(g.impact.significance);}).sort(d3.ascending),.25)
            median = d3.quantile(d.map(function(g) { return Number(g.impact.significance);}).sort(d3.ascending),.5)
            q3 = d3.quantile(d.map(function(g) { return Number(g.impact.significance);}).sort(d3.ascending),.75)
            interQuantileRange = q3 - q1

            min = mapout[0]
            max = q3 + 1.5 * interQuantileRange
            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data);


    var x = d3.scaleBand()
        .range([ 0, width_b ])
        .domain(['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23',"0", "1", "2", '3', '4', '5', '6', '7', '8', '9', '10','11'])
        .paddingInner(2)
        .paddingOuter(1)
    svg_b.append("g")
        .attr("transform", "translate(0," + height_b + ")")
        .call(d3.axisBottom(x))
    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([0,140])
        .range([height_b, 0])
    svg_b.append("g").call(d3.axisLeft(y))

    // Show the main vertical line
    svg_b
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.key))})
        .attr("x2", function(d){return(x(d.key))})
        .attr("y1", function(d){return(y(d.value.min))})
        .attr("y2", function(d){return(y(d.value.max))})
        .attr("stroke", "black")
        .style("width", 40)

    // rectangle for the main box
    var boxWidth = 32
    svg_b
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#90874E")

    // Show the median
    svg_b
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
        .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
        .attr("y1", function(d){return(y(d.value.median))})
        .attr("y2", function(d){return(y(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80)
})