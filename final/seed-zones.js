document.addEventListener("DOMContentLoaded", () => {
  (function() {

    // ✅ REMOVE ANY OLD TOOLTIPS
    d3.selectAll(".tooltip").remove();

    // =====================================================
    // =============== Seed Zones Visualization ============
    // =====================================================

    const width = 800;
    const height = 800;

    const margin = { top: 50, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Projection for California
  const projection = d3.geoAlbers()
    .center([1, 36])
    .rotate([120.5, 0])
    .parallels([34, 40.5])
    .scale(3400)                     // ✅ MAKE MAP BIGGER
    .translate([
      innerWidth / 2,               // ✅ PERFECT HORIZONTAL CENTER
      innerHeight / 2               // ✅ PERFECT VERTICAL CENTER
    ])
    const path = d3.geoPath().projection(projection);

    // ✅ GLOBAL TOOLTIP (FORCED DISPLAY + OPACITY)
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "fixed")
      .style("z-index", "99999")
      .style("pointer-events", "none")
      .style("background", "rgba(0,0,0,0.85)")
      .style("color", "white")
      .style("padding", "6px 8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("display", "none")     // ✅ IMPORTANT
      .style("opacity", 0);

    // Label helper
    function addLabels(g, data) {
      g.selectAll("text.zone-label")
        .data(data.features)
        .join("text")
          .attr("class", "zone-label")
          .attr("x", d => path.centroid(d)[0])
          .attr("y", d => path.centroid(d)[1])
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .attr("stroke", "white")
          .attr("stroke-width", 3)
          .attr("paint-order", "stroke")
          .text(d => d.properties.SEED_ZONE);
    }

    // -----------------
    // MAP 1 — Single color
    // -----------------
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

        // ✅ FORCE TOOLTIP ON
        .on("mouseenter", (event, d) => {
          console.log("✅ TOOLTIP TRIGGERED"); // DEBUG CONFIRMATION
          tooltip
            .style("display", "block")
            .style("opacity", 1)
            .html(
              `Seed Zone: ${d.properties.SEED_ZONE}<br>` +
              `Subzone: ${d.properties.SUBZONE}`
            );
        })

        .on("mousemove", (event) => {
          tooltip
            .style("left", (event.clientX + 12) + "px")
            .style("top", (event.clientY + 12) + "px");
        })

        .on("mouseleave", () => {
          tooltip
            .style("opacity", 0)
            .style("display", "none");
        });

      addLabels(g1, data);
    });

  })();
});
