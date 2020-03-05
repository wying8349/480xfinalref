function barChart(data) {
    // append the rectangles for the bar chart
    svgBar.selectAll("bar")
        .data(data)
        .enter().append("rect")
        //.attr("class", "bar")
        .attr("x", function (d) { return x(d.state); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            if (d.value == 'N/a'){
                return y(0);
            }
            return y(d.value); })
        .attr("height", function (d) { return heightBar - y(d.value); })
        .style("fill", function (d) { return color(d.value); } )
        .style("stroke", "#000")
        .style("stroke-width", "0.5px")
        .attr("class", function(d,i) { return "pt" + i; })
        .attr("id", function(d) { return "barChart"; })
        .style("opacity", .9)
        .on("mouseover", function(d, i){
            onMouseDimBar(true);
            //onMouseDimMap(true);
            onMouseLightSelectedPt(true,i);
        })
        .on("mouseleave", function(d, i){
            onMouseDimBar(false);
            onMouseDimMap(false);
            onMouseLightSelectedPt(false,i);
        });
}

function barChartAxis() {
    // add the x Axis
    svgBar.append("g")
        .attr("transform", "translate(0," + heightBar + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "start")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "translate(7.5,12.5) rotate(65)");
    // add the y Axis
    svgBar.append("g")
        .call(d3.axisLeft(y));
}

function onMouseDimBar(b) {
    d3.selectAll("#barChart")
        .transition()
        .style("opacity", (b) ? 0.7 : 0.9);
}