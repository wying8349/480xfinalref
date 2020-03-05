function legendDots() {
    svgMap.selectAll("mycolors")
        .data(colorScale)
        .enter()
        .append("rect")
        .attr("x", widthMap - 100)
        .attr("y", function (d, i) { return heightMap - marginMap.bottom - marginMap.top - (1 - i) * 15 })
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
        .attr("x", widthMap - 80)
        .attr("y", function (d, i) { return heightMap - marginMap.bottom - marginMap.top + i * 15 + 2.5 })
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
    svgMap.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#000")
        .style("stroke-width", "0.5px")
        .style("fill", function (d) {
            //get the data value
            var value = d.properties.value;
            console.log(value);
            console.log(color(value));
            return color(value);
        })
        .attr("class", function(d,i) { return "pt" + i; })
        .attr("id", function(d) { return "mapChart"; })
        .style("opacity", .9)
        .on("mouseover", function(d, i){
            onMouseDimBar(true);
            onMouseDimMap(true);
            onMouseLightSelectedPt(true,i);
            tooltip
                .style("opacity", 1);
            tooltip.html(d.properties.name + "<br>" + d.properties.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d, i){
            onMouseDimBar(false);
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