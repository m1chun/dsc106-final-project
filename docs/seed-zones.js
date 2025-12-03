document.addEventListener("DOMContentLoaded", () => {
  (function () {

    const svg = d3.select("#seed-zones-svg");

    // ✅ FORCE SAME SIZE AS PHYSIO & CHOOSER MAPS
    const SIZE = 760;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = SIZE - margin.left - margin.right;
    const innerHeight = SIZE - margin.top - margin.bottom;

    svg
      .attr("width", SIZE)
      .attr("height", SIZE)
      .style("display", "block")
      .style("margin", "0 auto");

    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ✅ PROJECTION MATCHED TO PHYSIO SCALE
    const projection = d3.geoAlbers()
      .center([0, 37])
      .rotate([120, 0])
      .parallels([34, 40.5])
      .scale(innerWidth * 4.8)   // ✅ tuned for 760px map
      .translate([innerWidth / 2, innerHeight / 2]);

    const path = d3.geoPath().projection(projection);

    function addLabels(data) {
      g.selectAll("text.zone-label")
        .data(data.features)
        .join("text")
        .attr("class", "zone-label")
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#000")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("paint-order", "stroke")
        .text(d => d.properties.SEED_ZONE);
    }

    d3.json("ca-seed-zones.geojson").then(data => {

      g.selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#cce5ff")
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")

        .on("mouseenter", function (event, d) {
          d3.select(this).classed("map-glow", true);

          const tooltip = d3.select(".tooltip");

          tooltip
            .style("opacity", 1)
            .html(`
              <strong>Seed Zone:</strong> ${d.properties.SEED_ZONE}<br>
              <strong>Subzone:</strong> ${d.properties.SUBZONE || "N/A"}
            `);
        })

        .on("mousemove", function (event) {
          d3.select(".tooltip")
            .style("left", event.clientX + 14 + "px")
            .style("top", event.clientY + 14 + "px");
        })

        .on("mouseleave", function () {
          d3.select(this).classed("map-glow", false);
          d3.select(".tooltip").style("opacity", 0);
        });

      addLabels(data);
    });

  })();
});
