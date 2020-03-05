function computeSum(data){
    return d3.sum(data);
}



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

let marginBar = {top: 20, right: 20, bottom: 100, left: 40},
    widthBar = 1200 - marginBar.left - marginBar.right,
    heightBar = 400 - marginBar.top - marginBar.bottom;

let widthPie = 550,
    heightPie = 425,
    radiusPie = Math.min(widthPie,heightPie)/2;

// define map projection
let projection = d3.geoAlbersUsa()
    .translate([275 + marginMap.left, 150 + marginMap.top])
    .scale([800]);

//Define default path generator
let path = d3.geoPath()
    .projection(projection);

/*// process pie data
let pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });*/

// set the bar ranges
let x = d3.scaleBand()
    .range([0, widthBar])
    .padding(0.1);
let y = d3.scaleLinear()
    .range([heightBar, 0]);

/*// set the pie arc
let arc = d3.arc()
    .outerRadius(radiusPie - 20)
    .innerRadius(0);
// set the arc of the label of pie
let labelArc = d3.arc()
    .outerRadius(radiusPie - 5)
    .innerRadius(radiusPie - 5);*/

//map svg
let svgMap = d3.select("#svgMap")
    .append("svg")
    .attr("id", "chart")
    .attr("width", widthMap)
    .attr("height", heightMap)
    .append("g")
    .attr("tranform", "translate(0" + marginMap.left + "," + marginMap.top + ")");

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
let svgBar = d3.select("#svgBar").append("svg")
    .attr("width", widthBar + marginBar.left + marginBar.right)
    .attr("height", heightBar + marginBar.top + marginBar.bottom)
    .append("g")
    .attr("transform",
        "translate(" + marginBar.left + "," + marginBar.top + ")");


// pie svg
let svgPie = d3.select("#svgPie").append("svg")
    .attr("width", widthPie)
    .attr("height", heightPie)
    .append("g")
    .attr("transform", "translate(" + widthPie / 2 + "," + heightPie / 2 + ")");

// define tooptip
let tooltip = d3.select("#svgMap").append("div")
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

    console.log(d_Map);

    legend(d_State);
    mapChart(d_State,d_Map);

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) { return d.state; }));
    /*x.domain(dataProcessed.map(function (d) {
        return d.state
    }));*/
    y.domain([0, d3.max(data, function (d) { return d.value; })]);

    let places = [];

    for (let i = 0; i < d_Earthquakes.length; i ++){
        let temp = [d_Earthquakes[i].location.longitude,d_Earthquakes[i].location.latitude];
        places.push(temp);
    }

    console.log(places);


    // or insert your own custom dots by hand
    svgMap.selectAll("circle")
        .data(places).enter()
        .append("circle")
        .attr("transform", function(d){
            return "translate(" + projection(d) + ")";
        })
        .attr("r", "1px")
        .attr("fill", "red")
});


    //barChart(data);
    //barChartAxis();
/*    data.forEach(function (d) {
        if (d.value){
            sum = sum + d.value;
        }
    });*/

    //pieChart(data,["#a06a72"]);

