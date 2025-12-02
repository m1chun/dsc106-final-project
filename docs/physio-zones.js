document.addEventListener("DOMContentLoaded", () => {
  (function () {

    // ================================
    // SVG + PROJECTION (MATCH SEED ZONES)
    // ================================
    const width = 800;
    const height = 800;

    const margin = { top: 50, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#map-physio")
      .attr("width", width)
      .attr("height", height);

    const gPhysio = svg.append("g")
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
    // ✅ COLOR-BLIND SAFE PALETTE
    // ================================
    const regionColors = {
      "North Coast Redwood": "#1b9e77",
      "Central Coast": "#66a61e",
      "North Coast Interior": "#7570b3",
      "West Slope Cascades–Sierra": "#e7298a",
      "East Slope Cascades–Sierra": "#d95f02",
      "Great Basin": "#e6ab02",
      "Central Valley": "#a6761d",
      "SoCal Desert": "#ffd92f",
      "SoCal Mountains": "#666666"
    };

    // ================================
    // ✅ SERIES-BASED REGION CLASSIFIER
    // ================================
    function getPhysioRegion(seedZone) {
      const z = Number(seedZone);

      if (z >= 90 && z < 100) return "North Coast Redwood";
      if (z >= 100 && z < 200) return "Central Coast";
      if (z >= 300 && z < 400) return "North Coast Interior";
      if (z >= 500 && z < 600) return "West Slope Cascades–Sierra";
      if (z >= 700 && z < 800) return "East Slope Cascades–Sierra";

      if (z >= 950 && z < 960) return "Great Basin";
      if (z >= 960 && z < 970) return "Central Valley";
      if (z >= 980 && z < 990) return "SoCal Desert";
      if (z >= 990 && z < 1000) return "SoCal Mountains";

      return "Unknown";
    }

    // ================================
    // ✅ SEED ZONE LABELS
    // ================================
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
        .attr("fill", "#0f172a")
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("paint-order", "stroke")
        .text(d => d.properties.SEED_ZONE);
    }

    // ================================
    // ✅ TOP-RIGHT LEGEND
    // ================================
    function drawLegend() {
      const legend = svg.append("g")
        .attr("class", "physio-legend")
        .attr("transform", `translate(${width - 260}, 30)`); // ✅ top-right

      const legendBg = legend.append("rect")
        .attr("width", 240)
        .attr("height", 260)
        .attr("rx", 14)
        .attr("fill", "rgba(255,255,255,0.95)")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1);

      legend.append("text")
        .attr("x", 120)
        .attr("y", 22)
        .attr("text-anchor", "middle")
        .attr("font-weight", "800")
        .attr("font-size", "14px")
        .attr("fill", "#7f1d1d")
        .text("Physio Regions");

      const legendData = Object.entries(regionColors);

      const items = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(16, ${40 + i * 24})`);

      items.append("rect")
        .attr("width", 16)
        .attr("height", 16)
        .attr("rx", 4)
        .attr("fill", d => d[1])
        .attr("stroke", "#111");

      items.append("text")
        .attr("x", 24)
        .attr("y", 12)
        .attr("font-size", "12px")
        .attr("fill", "#111")
        .text(d => d[0]);
    }

    // ================================
    // ✅ LOAD + DRAW MAP
    // ================================
    d3.json("ca-seed-zones.geojson").then(data => {

      gPhysio.selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", path)
        .attr("fill", d => {
          const seed = Number(d.properties.SEED_ZONE);
          const region = getPhysioRegion(seed);
          return regionColors[region] || "#e5e7eb";
        })
        .attr("stroke", "#334155")
        .attr("stroke-width", 1)
        .attr("cursor", "pointer")

        .on("mouseenter", (event, d) => {
          const tooltip = d3.select(".tooltip");

          const seed = Number(d.properties.SEED_ZONE);
          const region = getPhysioRegion(seed);

          tooltip
            .style("display", "block")
            .style("opacity", 1)
            .html(`
              <strong>Seed Zone:</strong> ${seed}<br>
              <strong>Physio Region:</strong> ${region}
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

      // ✅ ADD SEED ZONE NUMBERS
      addLabels(gPhysio, data);

      // ✅ ADD LEGEND
      drawLegend();

    });

  })();
});
