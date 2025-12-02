document.addEventListener("DOMContentLoaded", () => {
  (function() {

    // ❌ DO NOT REMOVE OTHER VIZ TOOLTIPS ANYMORE
    // d3.selectAll(".tooltip").remove();

    // =====================================================
    // =============== Seed Zones Visualization ============
    // =====================================================

    const width = 800;
    const height = 800;

    const margin = { top: 50, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const projection = d3.geoAlbers()
      .center([1, 36])
      .rotate([120.5, 0])
      .parallels([34, 40.5])
      .scale(3400) // bigger map
      .translate([
        innerWidth / 2,
        innerHeight / 2
      ]);

    const path = d3.geoPath().projection(projection);

    // We **do not** create a new tooltip here.
    // We’ll always grab the current one on demand.

    function addLabels(g, data) {
      g.selectAll("text.zone-label")
        .data(data.features)
        .join("text")
        .attr("class", "zone-label")
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .attr("fill", "#000")
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("paint-order", "stroke")
        .text(d => d.properties.SEED_ZONE);
    }

    const svg1 = d3.select("#map1")
      .attr("width", width)
      .attr("height", height);

    const g1 = svg1.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.json("ca-seed-zones.geojson").then(data => {
      g1.selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#cce5ff")
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("cursor", "pointer")

        .on("mouseenter", (event, d) => {
          const tooltip = d3.select(".tooltip"); // ✅ always grab current tooltip
          tooltip
            .style("display", "block")
            .style("opacity", 1)
            .html(`
              <strong>Seed Zone:</strong> ${d.properties.SEED_ZONE}<br>
              <strong>Subzone:</strong> ${d.properties.SUBZONE}
            `);
        })

        .on("mousemove", (event) => {
          const tooltip = d3.select(".tooltip");
          tooltip
            .style("left", (event.clientX + 12) + "px")
            .style("top", (event.clientY + 12) + "px");
        })

        .on("mouseleave", () => {
          const tooltip = d3.select(".tooltip");
          tooltip
            .style("opacity", 0)
            .style("display", "none");
        });

      addLabels(g1, data);
    });

  })();
});
