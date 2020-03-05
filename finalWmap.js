//Width and height
let widthMap_w = 1000,
    heightMap_w = 800,
    marginMap_w = {top: 60, bottom: 40, left: 70, right: 40 };

let marginBar_w = {top: 20, right: 20, bottom: 100, left: 40},
    widthBar_w = 1200 - marginBar_w.left - marginBar_w.right,
    heightBar_w = 400 - marginBar_w.top - marginBar_w.bottom;

function legendDots_w() {
    svgMap_w.selectAll("mycolors")
        .data(colorScale_w)
        .enter()
        .append("rect")
        .attr("x", widthMap_w - 100)
        .attr("y", function (d, i) { return heightMap_w - marginMap_w.bottom - marginMap_w.top - (1 - i) * 15 })
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", function (d) { return d; })
        .style("stroke", "#000")
        .style("stroke-width", "0.5px");
}

function legendLabels_w(domain) {
    svgMap_w.selectAll("mydots")
        .data(domain)
        .enter()
        .append("text")
        .style("fill", "#f2f0f7")
        .style("font-size", "9px")
        .attr("x", widthMap_w - 80)
        .attr("y", function (d, i) { return heightMap_w - marginMap_w.bottom - marginMap_w.top + i * 15 + 2.5 })
        .text(function (d) { return Math.floor(d); });
}

function legend_w(data) {
    legendDots_w();
    legendLabels_w(domain_w)
}

function mapChart_w(data, json) {
    for (let i = 0; i < data.length; i++) {
        let dataState = data[i].State;
        let dataValue = parseFloat(data[i].Counts);
        let n = 0;
        for (n = 0; n < json.features.length; n++) {
            var jsonState = json.features[n].properties.name;
            if (dataState == jsonState) {
                json.features[n].properties.value = dataValue;
                break;
            }
        }
    }
    for (var n = 0; n < json.features.length; n++){
        if (json.features[n].properties.value == null){
            json.features[n].properties.value = 0;
        }
    }
    mapCharthelper_w(data,json);
}
function mapCharthelper_w(data, json) {
    let mapDot = svgMap_w.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path_w)
        .style("stroke", "#000")
        .style("stroke-width", "0.5px")
        .style("fill", function (d) {
            //get the data value
            var value = d.properties.value;
            return color_w(value);
        })
        .attr("class", function(d,i) { return "pt" + i; })
        .attr("id", function(d) { return "mapChart"; })
        .style("opacity", .9)
        .on("mouseover", function(d, i){
            //onMouseDimBar(true);
            onMouseDimMap_w(true);
            onMouseLightSelectedPt_w(true,i);
            tooltip_w
                .style("opacity", 1);
            tooltip_w.html(d.properties.name + "<br>" + d.properties.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d, i){
            //onMouseDimBar(false);
            onMouseDimMap_w(false);
            onMouseLightSelectedPt_w(false,i);
            tooltip_w
                .style("opacity", 0);
        });
}



function onMouseDimMap_w(b) {
    d3.selectAll("#mapChartw")
        .transition()
        .style("opacity", (b) ? 0.7 : 0.9);
}

function onMouseLightSelectedPt_w(b, i) {
    d3.selectAll("path.pt" + i)
        .style("opacity", 1)
        .style("fill", (b) ?
            "#d01c8b" :
            function (d) {
                return color_w(d.properties.value);
            });
    d3.selectAll("rect.pt" + i)
        .style("opacity", 1)
        .style("fill", (b) ?
            "#d01c8b" :
            function (d) {
                if (d.value) { return color_w(d.value);
                } else { return "#ccc" }
            });
    d3.selectAll("path.Piept" + i)
        .style("opacity", 1)
        .style("fill", (b) ?
            function (d) {
                if (d.value) { return color_w(d.value);
                } else { return "#ccc" }
            }
            : "#a06a72");
    d3.selectAll("text.txt" + i)
        .style("opacity", (b) ? 1 : 0);
}


// define color scale and color function

console.log("im in")

let colorScale_w = ["#ffffff","#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"];
let domain_w = [0.1,10.1,30.1,40.1,50.1,60.1];
let color_w = d3.scaleThreshold()
    .domain(domain_w)
    .range(colorScale_w);

// define map projection
var projection_w = d3.geoMercator()
    .scale(175)
    .center([0,40])
    .translate([widthMap_w/2, heightMap_w / 2]);

//Define default path generator
let path_w = d3.geoPath()
    .projection(projection_w);

// set the bar ranges
let x_w = d3.scaleBand()
    .range([0, widthBar_w])
    .padding(0.1);
let y_w = d3.scaleLinear()
    .range([heightBar_w, 0]);

//map svg
let svgMap_w = d3.select("#mapChartw")
    .append("svg")
    .attr("id", "chart")
    .attr("width", widthMap_w)
    .attr("height", heightMap_w)
    .append("g")
    .attr("tranform", "translate(0" + marginMap_w.left + "," + marginMap_w.top + ")");

// define tooptip
let tooltip_w = d3.select("#mapChartw").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);

// read data and draw charts
var d_State_w, d_Earthquakes_w, d_Map_w;
Promise.all([
    d3.csv("wasteData/State.csv",function(d) {
        return {
            index : +d.index,
            State : d.State,
            Counts : +d.Counts
        }}),
    d3.csv("wasteData/earthquakes.csv", function (d) {
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
    d3.json("World.json"),
]).then(function(data) {
    d_State_w = data[0];
    d_Earthquakes_w = data[1];
    d_Map_w = data[2];

    legend_w(d_State_w);
    mapChart_w(d_State_w,d_Map_w);

    // Scale the range of the data in the domains
    x_w.domain(data.map(function (d) { return d.state; }));
    /*x.domain(dataProcessed.map(function (d) {
        return d.state
    }));*/
    y_w.domain([0, d3.max(data, function (d) { return d.value; })]);

    let places1 = [],
        places2 = [],
        places3 = [],
        places4 = [],
        places5 = [],
        places6 = [],
        places7 = [],
        places8 = [];
    let name1 = [],
        name2 = [],
        name3 = [],
        name4 = [],
        name5 = [],
        name6 = [],
        name7 = [],
        name8 = [];

    let level1 = '#ffffcc',
        level0 = '#ffeda0',
        level2 = '#fed976',
        level33 = '#feb24c',
        level3 = '#fd8d3c',
        level4 = '#fc4e2a',
        level44 = '#e31a1c',
        level5 = '#bd0026',
        level66 = '#800026',
        level6 = '#800026';

    for (let i = 0; i < d_Earthquakes_w.length; i ++){
        let tempPlace = [d_Earthquakes_w[i].location.longitude,d_Earthquakes_w[i].location.latitude],
            tempMag = Math.round(d_Earthquakes_w[i].impact.magnitude),
            tempSName = d_Earthquakes_w[i].location.name;
        console.log(tempMag)
        if (tempMag === 1){
            places1.push(tempPlace);
            name1.push(tempSName);
        }else if (tempMag === 2){
            places2.push(tempPlace);
            name2.push(tempSName);
        }else if (tempMag === 3){
            places3.push(tempPlace);
            name3.push(tempSName);
        }else if (tempMag === 4){
            places4.push(tempPlace);
            name4.push(tempSName);
        }else if (tempMag === 5){
            places5.push(tempPlace);
            name5.push(tempSName);
        }else if (tempMag === 6){
            places6.push(tempPlace);
            name6.push(tempSName);
        }else if (tempMag === 6){
            places6.push(tempPlace);
            name6.push(tempSName);
        }else if (tempMag === 7){
            places7.push(tempPlace);
            name7.push(tempSName);
        }else if (tempMag === 8){
            places8.push(tempPlace);
            name8.push(tempSName);
        }
    }


    // or insert your own custom dots by hand
    let group1 = svgMap_w.selectAll("circle")
        .data(places1).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection_w(d) + ")";
        })
        .attr("r", "2px")
        .attr("fill", "black")
        .attr("opacity", 0.5)



    let group2 = svgMap_w.selectAll("circle")
        .data(places2, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection_w(d) + ")";
        })
        .attr("r", "2px")
        .attr("opacity", 0.5)
        .attr("fill", "black")

    let group3 = svgMap_w.selectAll("circle")
        .data(places3, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection_w(d) + ")";
        })
        .attr("r", "2px")
        .attr("opacity", 0.5)
        .attr("fill", "black")
        .attr("class", function(d,i) { return "gy" + i; })

    let group4 = svgMap_w.selectAll("circle")
        .data(places4, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection_w(d) + ")";
        })
        .attr("r", "2px")
        .attr("opacity", 0.5)
        .attr("fill", "black")

    let group5 = svgMap_w.selectAll("circle")
        .data(places5, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection_w(d) + ")";
        })
        .attr("r", "2px")
        .attr("opacity", 0.5)
        .attr("fill", "black")
        .attr("class", function(d,i) { return "gy" + i; })

    let group6 = svgMap_w.selectAll("circle")
        .data(places6, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection_w(d) + ")";
        })
        .attr("r", "2px")
        .attr("opacity", 0.5)
        .attr("fill", "black")
        .attr("class", function(d,i) { return "gy" + i; })

    let group7 = svgMap_w.selectAll("circle")
        .data(places7, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection_w(d) + ")";
        })
        .attr("r", "2px")
        .attr("opacity", 0.5)
        .attr("fill", "black")
        .attr("class", function(d,i) { return "gy" + i; })

    let group8 = svgMap_w.selectAll("circle")
        .data(places8, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection_w(d) + ")";
        })
        .attr("r", "2px")
        .attr("opacity", 0.5)
        .attr("fill", "black")
        .attr("class", function(d,i) { return "gy" + i; })

    var button1 = d3.select('#G1w');
    button1
        .on("click", function(i) {
            // group4.attr("opacity", 0)
            // group3.attr("opacity", 0)
            // group5.attr("opacity", 0)
            // group6.attr("opacity", 0)
            // group2.attr("opacity", 0)
            group1.transition()
                .attr("cx", 5)
                .attr("opacity", 1)
                .attr("fill", level1)
                .delay(50)
                .duration(25)
                .transition()
                .attr("cx", -5)
                .attr("opacity", 1)
                .delay(50)
                .duration(25)
                .on("end",function() { // on end of transition...
                    d3.select(this)
                        .transition() // second transition
                        .attr("cx", 0) // second x
                        .attr("opacity", 0.5) // second opacity
                        .attr("fill", "black") // second color
                        .delay(50) // second delay
                        .duration(90) // second time

                    // group4.attr("opacity", 0.5)
                    // group3.attr("opacity", 0.5)
                    // group5.attr("opacity", 0.5)
                    // group6.attr("opacity", 0.5)
                    // group2.attr("opacity", 0.5)
                })});

    var button2 = d3.select('#G2w');
    button2
        .on("click", function(i) {
            // group4.attr("opacity", 0)
            // group3.attr("opacity", 0)
            // group5.attr("opacity", 0)
            // group6.attr("opacity", 0)
            // group1.attr("opacity", 0)

            group2.transition()
                .attr("cx", 5)
                .attr("r", "4px")
                .attr("opacity", 1)
                .attr("fill", level2)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", 5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .on("end",function() { // on end of transition...
                    d3.select(this)
                        .transition() // second transition
                        .attr("cx", 0) // second x
                        .attr("r", "2px")
                        .attr("opacity", 0.5) // second opacity
                        .attr("fill", "black") // second color
                        .delay(50) // second delay
                        .duration(90) // second time

                    // group4.attr("opacity", 0.5)
                    // group3.attr("opacity", 0.5)
                    // group5.attr("opacity", 0.5)
                    // group6.attr("opacity", 0.5)
                    // group1.attr("opacity", 0.5)
                })});

    var button3 = d3.select('#G3w');
    button3
        .on("click", function(i) {
            group3.transition()
                .attr("cx", 5)
                .attr("r", "6px")
                .attr("opacity", 1)
                .attr("fill", level3)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", 5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .on("end",function() { // on end of transition...
                    d3.select(this)
                        .transition() // second transition
                        .attr("cx", 0) // second x
                        .attr("r", "2px")
                        .attr("opacity", 0.5) // second opacity
                        .attr("fill", "black") // second color
                        .delay(50) // second delay
                        .duration(25) // second time
                })});

    var button4 = d3.select('#G4w');
    button4
        .on("click", function(i) {

            // group2.attr("opacity", 0)
            // group3.attr("opacity", 0)
            // group5.attr("opacity", 0)
            // group6.attr("opacity", 0)
            // group1.attr("opacity", 0)

            group4.transition()
                .attr("cx", 5)
                .attr("r", "8px")
                .attr("opacity", 1)
                .attr("fill", level4)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", 5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .on("end",function() { // on end of transition...
                    d3.select(this)
                        .transition() // second transition
                        .attr("cx", 0) // second x
                        .attr("r", "2px")
                        .attr("opacity", 0.5) // second opacity
                        .attr("fill", "black") // second color
                        .delay(50) // second delay
                        .duration(90) // second time
                    // group2.attr("opacity", 0.5)
                    // group3.attr("opacity", 0.5)
                    // group5.attr("opacity", 0.5)
                    // group6.attr("opacity", 0.5)
                    // group1.attr("opacity", 0.5)
                })});

    var button5 = d3.select('#G5w');
    button5
        .on("click", function(i) {
            // group2.attr("opacity", 0)
            // group3.attr("opacity", 0)
            // group4.attr("opacity", 0)
            // group6.attr("opacity", 0)
            // group1.attr("opacity", 0)

            group5.transition()
                .attr("cx", 5)
                .attr("r", "10px")
                .attr("opacity", 1)
                .attr("fill", level5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", 5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .on("end",function() { // on end of transition...
                    d3.select(this)
                        .transition() // second transition
                        .attr("cx", 0) // second x
                        .attr("r", "2px")
                        .attr("opacity", 0.5) // second opacity
                        .attr("fill", "black") // second color
                        .delay(50) // second delay
                        .duration(90) // second time

                    // group2.attr("opacity", 0.5)
                    // group3.attr("opacity", 0.5)
                    // group4.attr("opacity", 0.5)
                    // group6.attr("opacity", 0.5)
                    // group1.attr("opacity", 0.5)
                })});

    var button6 = d3.select('#G6w');
    button6
        .on("click", function(i) {
            // group2.attr("opacity", 0)
            // group3.attr("opacity", 0)
            // group4.attr("opacity", 0)
            // group5.attr("opacity", 0)
            // group1.attr("opacity", 0)

            group6.transition()
                .attr("cx", 5)
                .attr("r", "12px")
                .attr("opacity", level6)
                .attr("fill", "red")
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", 5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .on("end",function() { // on end of transition...
                    d3.select(this)
                        .transition() // second transition
                        .attr("cx", 0) // second x
                        .attr("r", "2px")
                        .attr("opacity", 0.5) // second opacity
                        .attr("fill", "black") // second color
                        .delay(50) // second delay
                        .duration(90) // second time
                    // group2.attr("opacity", 0.5)
                    // group3.attr("opacity", 0.5)
                    // group4.attr("opacity", 0.5)
                    // group5.attr("opacity", 0.5)
                    // group1.attr("opacity", 0.5)
                })});

    var button7 = d3.select('#G7w');
    button7
        .on("click", function(i) {
            // group2.attr("opacity", 0)
            // group3.attr("opacity", 0)
            // group4.attr("opacity", 0)
            // group5.attr("opacity", 0)
            // group1.attr("opacity", 0)

            group7.transition()
                .attr("cx", 5)
                .attr("r", "14px")
                .attr("opacity", level6)
                .attr("fill", "red")
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", 5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .on("end",function() { // on end of transition...
                    d3.select(this)
                        .transition() // second transition
                        .attr("cx", 0) // second x
                        .attr("r", "2px")
                        .attr("opacity", 0.5) // second opacity
                        .attr("fill", "black") // second color
                        .delay(50) // second delay
                        .duration(90) // second time
                    // group2.attr("opacity", 0.5)
                    // group3.attr("opacity", 0.5)
                    // group4.attr("opacity", 0.5)
                    // group5.attr("opacity", 0.5)
                    // group1.attr("opacity", 0.5)
                })});

    var button8 = d3.select('#G8w');
    button8
        .on("click", function(i) {
            // group2.attr("opacity", 0)
            // group3.attr("opacity", 0)
            // group4.attr("opacity", 0)
            // group5.attr("opacity", 0)
            // group1.attr("opacity", 0)

            group8.transition()
                .attr("cx", 5)
                .attr("r", "16px")
                .attr("opacity", level6)
                .attr("fill", "red")
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", 5)
                .delay(50)
                .duration(90)
                .transition()
                .attr("cx", -5)
                .delay(50)
                .duration(90)
                .on("end",function() { // on end of transition...
                    d3.select(this)
                        .transition() // second transition
                        .attr("cx", 0) // second x
                        .attr("r", "2px")
                        .attr("opacity", 0.5) // second opacity
                        .attr("fill", "black") // second color
                        .delay(50) // second delay
                        .duration(90) // second time
                    // group2.attr("opacity", 0.5)
                    // group3.attr("opacity", 0.5)
                    // group4.attr("opacity", 0.5)
                    // group5.attr("opacity", 0.5)
                    // group1.attr("opacity", 0.5)
                })});
});
