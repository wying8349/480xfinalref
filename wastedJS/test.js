/*d3.csv("State.csv", function(d) {
    return {
        index : +d.index,
        State : d.State,
        Counts : +d.Counts
    };
}).then(function(data) {
    console.log(data);
    //console.log(data[0]);
});*/
//console.log(a.PromiseValue);

// define color scale and color function

let colorScale = ["#ffffff","#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"];
let domain = [0.1,10.1,30.1,100.1,500.1,1000.1,4000.1];
let color = d3.scaleThreshold()
    .domain(domain)
    .range(colorScale);

//Width and height
let widthMap = 675,
    heightMap = 425,
    marginMap = {top: 60, bottom: 40, left: 70, right: 40 };

// define map projection
let projection = d3.geoAlbersUsa()
    .translate([275 + marginMap.left, 150 + marginMap.top])
    .scale([800]);

//Define default path generator
let path = d3.geoPath()
    .projection(projection);

//map svg
let svgMap = d3.select("#svgMap")
    .append("svg")
    .attr("id", "chart")
    .attr("width", widthMap)
    .attr("height", heightMap)
    .append("g")
    .attr("tranform", "translate(0" + marginMap.left + "," + marginMap.top + ")");

svgMap.append("line")
    .attr("x1", 100)
    .attr("x2", 500)
    .attr("y1", 50)
    .attr("y2", 50)
    .attr("stroke", "black")/*

// define tooptip
let tooltip = d3.select("#svgMap").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);

let sum = 0;

/!*!// read data and draw charts
d3.csv("State.csv", function(d) {
    //console.log(d);
    return {
        index : +d.index,
        State : d.State,
        Counts : +d.Counts
    };
}).then(function(data) {
    legend(data);
    console.log(data);
    mapChart(data);

    x.domain(data.map(function (d) { return d.state; }));
    y.domain([0, d3.max(data, function (d) { return d.value; })]);

});*!/

var d_State, d_Earthquakes, d_Hour, d_Map;
Promise.all([
    d3.csv("State.csv",function(d) {
        return {
            index : +d.index,
            State : d.State,
            Counts : +d.Counts
        }}),
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
    }),
    d3.csv("Hour.csv", function (d) {
        return {
            index : +d.index,
            Hour : d.Hour,
            Counts : +d.Counts
        }
    }),
    d3.json("us-states.json"),
]).then(function(data) {
    d_State = data[0];
    d_Earthquakes = data[1];
    d_Hour = data[2];
    d_Map = data[3];

    legend(d_State);
});*/