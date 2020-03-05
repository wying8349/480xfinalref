function pieChart(data,color) {
    let g = svgPie.selectAll("arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", color)
        .style("stroke",color[0])
        .attr("class", function(d,i) { return "Piept" + i; })
        .attr("id", function(d) { return "pieChart"; });

    g.append("text")
        .attr("transform", function(d) { let t = labelArc.centroid(d)[0]-18.5; return "translate(" + [t, labelArc.centroid(d)[1]] + ")"; })
        .attr("dy", ".35em")
        .style("opacity", 0)
        .attr("class", function(d,i) { return "txt" + i; })
        .text(function(d) { return (d.value*100/sum).toFixed(2) + "%"; });
}