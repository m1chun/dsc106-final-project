document.addEventListener("DOMContentLoaded", function () {
  (function () {

    // ================================
    // SVG + PROJECTION
    // ================================
    const width = 800;
    const height = 800;

    const margin = { top: 50, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#fire-map")
      .attr("width", width)
      .attr("height", height);

    const gFire = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const projection = d3.geoAlbers()
      .center([1, 36])
      .rotate([120.5, 0])
      .parallels([34, 40.5])
      .scale(3400)
      .translate([
        innerWidth / 2,
        innerHeight / 2
      ]);

    const path = d3.geoPath().projection(projection);

    // ================================
    // FIRE DENSITY COLOR SCALE
    // ================================
    const densityThresholds = [0.00005, 0.0005, 0.005, 0.015];
    const densityColors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#990000'];
    const densityLabels = ['Very Low', 'Low', 'Medium', 'High', 'Extreme'];

    const fireScale = d3.scaleThreshold()
      .domain(densityThresholds)
      .range(densityColors);

    // ================================
    // STARTING STATE
    // ================================
    let fireVisible = false; // 🔥 map starts gray

    // ================================
    // TOOLTIP
    // ================================
    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select("body").append("div").attr("class", "tooltip");
    }

    // ================================
    // LEGEND
    // ================================
    function drawLegend() {
      const legend = svg.append("g")
        .attr("class", "fire-legend")
        .style("opacity", 0) // ⛔ hidden until fire is revealed
        .attr("transform", `translate(${width - 360}, 40)`);

      legend.append("text")
        .attr("x", 95)
        .attr("y", 28)
        .attr("text-anchor", "middle")
        .attr("font-weight", "800")
        .attr("font-size", "16px")
        .attr("fill", "#7f1d1d")
        .text("Fire Density");

      const legendData = [];

      legendData.push({
        color: densityColors[0],
        label: densityLabels[0],
        range: `0 – ${d3.format(".5f")(densityThresholds[0])}`
      });

      for (let i = 0; i < densityThresholds.length - 1; i++) {
        legendData.push({
          color: densityColors[i + 1],
          label: densityLabels[i + 1],
          range: `${d3.format(".5f")(densityThresholds[i])} – ${d3.format(".5f")(densityThresholds[i + 1])}`
        });
      }

      legendData.push({
        color: densityColors[densityColors.length - 1],
        label: densityLabels[densityLabels.length - 1],
        range: `> ${d3.format(".5f")(densityThresholds[densityThresholds.length - 1])}`
      });

      const items = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(20, ${45 + i * 22})`);

      items.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("rx", 4)
        .attr("fill", d => d.color)
        .attr("stroke", "#111");

      items.append("text")
        .attr("x", 28)
        .attr("y", 13)
        .attr("font-size", "13px")
        .attr("fill", "#111")
        .text(d => `${d.label}: ${d.range}`);
    }

    // Build legend now (but hidden)
    drawLegend();

    // ================================
    // LOAD + DRAW GEOJSON
    // ================================
    d3.json("fire_density_map.geojson").then(data => {

      const zones = gFire.selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", path)
        
        // ⭐ START GRAY
        .attr("fill", "#d1d5db")
        .attr("stroke", "#334155")
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer");

      // LABELS
      gFire.selectAll("text.zone-label")
        .data(data.features)
        .join("text")
        .attr("class", "zone-label")
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "10px")
        .style("font-weight", "900")
        .style("fill", "#111")
        .style("stroke", "white")
        .style("stroke-width", 4)
        .style("paint-order", "stroke")
        .text(d => d.properties.SEED_ZONE);

      // ================================
      // BUTTON TOGGLE FIRE DATA
      // ================================
      const btn = document.getElementById("reveal-colors-btn");
      if (!btn) return; // safe exit if missing

      btn.addEventListener("click", () => {

        fireVisible = !fireVisible;

        if (fireVisible) {
          // ⭐ REVEAL FIRE COLORS
          btn.textContent = "Hide Fire Data";

          zones.transition()
            .duration(1000)
            .attr("fill", d => fireScale(d.properties.fire_density ?? 0));

          svg.select(".fire-legend")
            .transition()
            .duration(600)
            .style("opacity", 1);

        } else {
          // ⭐ RETURN TO GRAY
          btn.textContent = "Reveal Fire Data";

          zones.transition()
            .duration(1000)
            .attr("fill", "#d1d5db");

          svg.select(".fire-legend")
            .transition()
            .duration(600)
            .style("opacity", 0);
        }
      });

      // TOOLTIP (only shows fire info if fireVisible = true)
      zones
        .on("mouseenter", (event, d) => {
          if (!fireVisible) return;

          const density = d.properties.fire_density ?? 0;
          const densityColor = fireScale(density);
          const densityCategory = densityLabels[densityColors.indexOf(densityColor)];

          const seed = Number(d.properties.SEED_ZONE);
          const region = getPhysioRegion(seed) || "Unknown Region";

          tooltip
            .style("display", "block")
            .style("opacity", 1)
            .html(`
              <strong>Region:</strong> ${region}<br/>
              <strong>Seed Zone:</strong> ${d.properties.SEED_ZONE}<br/>
              <strong>Category:</strong> ${densityCategory}<br/>
              <strong>Fires:</strong> ${d.properties.fire_count}<br/>
              <strong>Density:</strong> ${d3.format(".6f")(density)}
            `);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", (event.clientX + 12) + "px")
            .style("top", (event.clientY + 12) + "px");
        })
        .on("mouseleave", () => {
          tooltip.style("opacity", 0).style("display", "none");
        });

    });

  })();
});
