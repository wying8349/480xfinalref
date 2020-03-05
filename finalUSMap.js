function computeSum(data){
    return d3.sum(data);
}

function legendDots() {
    svgMap.selectAll("mycolors")
        .data(colorScale)
        .enter()
        .append("rect")
        .attr("x", widthMap - 200)
        .attr("y", function (d, i) { return heightMap - marginMap.bottom - marginMap.top - (15 - i) * 15 })
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", function (d) { return d; })
        .style("stroke", "#000")
        .style("stroke-width", "0.5px");
}

function legendLabels(domain) {
    svgMap.selectAll("mydots")
        .data(domain)
        .enter()
        .append("text")
        .style("fill", "black")
        .style("font-size", "9px")
        .attr("x", widthMap - 180)
        .attr("y", function (d, i) { return heightMap - marginMap.bottom - marginMap.top - (14 - i) * 15 + 2.5 })
        .text(function (d) { return Math.floor(d); });
}

function legend(data) {
    legendDots();
    legendLabels(domain)
}

function mapChart(data,json) {
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
    mapCharthelper(data,json);
}
function mapCharthelper(data,json) {
    let mapDot = svgMap.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#000")
        .style("stroke-width", "0.5px")
        .style("fill", function (d) {
            //get the data value
            var value = d.properties.value;
            return color(value);
        })
        .attr("class", function(d,i) { return "pt" + i; })
        .attr("id", function(d) { return "mapChart"; })
        .style("opacity", .9)
        .on("mouseover", function(d, i){
            //onMouseDimBar(true);
            onMouseDimMap(true);
            onMouseLightSelectedPt(true,i);
            tooltip
                .style("opacity", 1);
            tooltip.html(d.properties.name + "<br>" + d.properties.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d, i){
            //onMouseDimBar(false);
            onMouseDimMap(false);
            onMouseLightSelectedPt(false,i);
            tooltip
                .style("opacity", 0);
        });
}



function onMouseDimMap(b) {
    d3.selectAll("#mapChart")
        .transition()
        .style("opacity", (b) ? 0.7 : 0.9);
}

function onMouseLightSelectedPt(b,i) {
    d3.selectAll("path.pt" + i)
        .style("opacity", 1)
        .style("fill", (b) ?
            "#d01c8b" :
            function (d) {
                return color(d.properties.value);
            });
    d3.selectAll("rect.pt" + i)
        .style("opacity", 1)
        .style("fill", (b) ?
            "#d01c8b" :
            function (d) {
                if (d.value) { return color(d.value);
                } else { return "#ccc" }
            });
    d3.selectAll("path.Piept" + i)
        .style("opacity", 1)
        .style("fill", (b) ?
            function (d) {
                if (d.value) { return color(d.value);
                } else { return "#ccc" }
            }
            : "#a06a72");
    d3.selectAll("text.txt" + i)
        .style("opacity", (b) ? 1 : 0);
}


// define color scale and color function

let colorScale = ["#ffffff","#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"];
let domain = [0.1,10.1,30.1,100.1,500.1,1000.1,4000.1];
let color = d3.scaleThreshold()
    .domain(domain)
    .range(colorScale);

//Width and height
let widthMap = 1000,
    heightMap = 900,
    marginMap = {top: 60, bottom: 40, left: 70, right: 40 };

let marginBar = {top: 20, right: 20, bottom: 100, left: 40},
    widthBar = 1200 - marginBar.left - marginBar.right,
    heightBar = 400 - marginBar.top - marginBar.bottom;

// let widthPie = 550,
//     heightPie = 425,
//     radiusPie = Math.min(widthPie,heightPie)/2;

// define map projection
let projection = d3.geoAlbersUsa()
    .translate([400 + marginMap.left, 300 + marginMap.top])
    .scale([1200]);

//Define default path generator
let path = d3.geoPath()
    .projection(projection);

// // process pie data
// let pie = d3.pie()
//     .sort(null)
//     .value(function(d) { return d.value; });

// set the bar ranges
let x = d3.scaleBand()
    .range([0, widthBar])
    .padding(0.1);
let y = d3.scaleLinear()
    .range([heightBar, 0]);

// // set the pie arc
// let arc = d3.arc()
//     .outerRadius(radiusPie - 20)
//     .innerRadius(0);
// // set the arc of the label of pie
// let labelArc = d3.arc()
//     .outerRadius(radiusPie - 5)
//     .innerRadius(radiusPie - 5);

//map svg
let svgMap = d3.select("#usMap")
    .append("svg")
    .attr("id", "chart")
    .attr("width", widthMap)
    .attr("height", heightMap)
    .append("g")
    .attr("tranform", "translate(0" + marginMap.left + "," + marginMap.top + ")");

// define tooptip
let tooltip = d3.select("#usMap").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);

let sum = 0;

// read data and draw charts
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
    mapChart(d_State,d_Map);

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) { return d.state; }));
    /*x.domain(dataProcessed.map(function (d) {
        return d.state
    }));*/
    y.domain([0, d3.max(data, function (d) { return d.value; })]);

    let places1 = [],
        places2 = [],
        places3 = [],
        places4 = [],
        places5 = [],
        places6 = [];
    let name1 = [],
        name2 = [],
        name3 = [],
        name4 = [],
        name5 = [],
        name6 = [];


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

    for (let i = 0; i < d_Earthquakes.length; i ++){
        let tempPlace = [d_Earthquakes[i].location.longitude,d_Earthquakes[i].location.latitude],
            tempMag = Math.round(d_Earthquakes[i].impact.magnitude),
            tempSName = d_Earthquakes[i].location.name;
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
        }
    }


    // or insert your own custom dots by hand
    let group1 = svgMap.selectAll("circle")
        .data(places1).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection(d) + ")";
        })
        .attr("r", "2px")
        .attr("fill", "black")
        .attr("opacity", 0.5)



    let group2 = svgMap.selectAll("circle")
        .data(places2, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection(d) + ")";
        })
        .attr("r", "4px")
        .attr("opacity", 0.5)
        .attr("fill", "black")

    let group3 = svgMap.selectAll("circle")
        .data(places3, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection(d) + ")";
        })
        .attr("r", "6px")
        .attr("opacity", 0.5)
        .attr("fill", "black")
        .attr("class", function(d,i) { return "gy" + i; })

    let group4 = svgMap.selectAll("circle")
        .data(places4, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection(d) + ")";
        })
        .attr("r", "8px")
        .attr("opacity", 0.5)
        .attr("fill", "black")

    let group5 = svgMap.selectAll("circle")
        .data(places5, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection(d) + ")";
        })
        .attr("r", "10px")
        .attr("opacity", 0.5)
        .attr("fill", "black")
        .attr("class", function(d,i) { return "gy" + i; })

    let group6 = svgMap.selectAll("circle")
        .data(places6, function(d) { return d; }).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection(d) + ")";
        })
        .attr("r", "12px")
        .attr("opacity", 0.5)
        .attr("fill", "black")
        .attr("class", function(d,i) { return "gy" + i; })

    var button1 = d3.select('#G1');
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

    var button2 = d3.select('#G2');
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
                        .attr("r", "4px")
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

    var button3 = d3.select('#G3');
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
                        .attr("r", "6px")
                        .attr("opacity", 0.5) // second opacity
                        .attr("fill", "black") // second color
                        .delay(50) // second delay
                        .duration(25) // second time
                })});

    var button4 = d3.select('#G4');
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
                        .attr("r", "8px")
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

    var button5 = d3.select('#G5');
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
                        .attr("r", "10px")
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

    var button6 = d3.select('#G6');
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
                .attr("opacity", 1)
                .attr("fill", level6)
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
                        .attr("r", "12px")
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


//barChart(data);
//barChartAxis();
/*    data.forEach(function (d) {
        if (d.value){
            sum = sum + d.value;
        }
    });*/

//pieChart(data,["#a06a72"]);