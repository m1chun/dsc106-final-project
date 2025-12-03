document.addEventListener("DOMContentLoaded", () => {
  (function() {

    // ✅ REMOVE OLD TOOLTIP + OLD SVG CONTENT
    d3.selectAll(".tooltip").remove();
    d3.select("#map").selectAll("*").remove();

    // ==============================
    // ✅ EXACT SAME SIZE AS SEED ZONES
    // ==============================
    const width = 800;
    const height = 800;

    const margin = { top: 50, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#map")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ==============================
    // ✅ EXACT SAME PROJECTION AS SEED ZONES
    // ==============================
    const projection = d3.geoAlbers()
      .center([1, 36])
      .rotate([120.5, 0])
      .parallels([34, 40.5])
      .scale(3400)
      .translate([
        innerWidth / 2,
        innerHeight / 2 + 20
      ]);

    const path = d3.geoPath().projection(projection);

    // ==============================
    // ✅ TOOLTIP
    // ==============================
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "fixed")
      .style("z-index", "99999")
      .style("pointer-events", "none")
      .style("background", "rgba(0,0,0,0.85)")
      .style("color", "white")
      .style("padding", "8px 10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("display", "none")
      .style("opacity", 0);

    // ==============================
    // ✅ COLOR LOGIC
    // ==============================
    const nonRareColor = "#e6e6e6";
    const rareColor = "#6e016b";

    function hasRareVeg(d) {
      const p = d.properties || {};
      return (
        p.RareVeg === true ||
        p.RareVeg === 1 ||
        p.RareVeg === "Yes" ||
        (p.RareVeg_types && p.RareVeg_types !== "None")
      );
    }

    // ==============================
    // ✅ MATCHED SVG LEGEND (TOP RIGHT)
    // ==============================
    function drawLegend() {
      const legend = svg.append("g")
        .attr("class", "rare-veg-legend")
        .attr("transform", `translate(${width - 360}, 40)`);

      // Background
      legend.append("rect")
        .attr("width", 320)
        .attr("height", 110)
        .attr("rx", 18)
        .attr("fill", "rgba(255,255,255,0.96)")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 2);

      // Title
      legend.append("text")
        .attr("x", 160)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-weight", "800")
        .attr("font-size", "18px")
        .attr("fill", "#7f1d1d")
        .text("Rare Vegetation");

      const legendData = [
        { label: "Rare Vegetation", color: rareColor },
        { label: "No Rare Vegetation Recorded", color: nonRareColor }
      ];

      const items = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(24, ${50 + i * 26})`);

      items.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("rx", 4)
        .attr("fill", d => d.color)
        .attr("stroke", "#111");

      items.append("text")
        .attr("x", 30)
        .attr("y", 13)
        .attr("font-size", "14px")
        .attr("fill", "#111")
        .text(d => d.label);
    }

    // ==============================
    // ✅ LOAD + DRAW
    // ==============================
    d3.json("rare-vegetation.geojson").then(data => {

      g.selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", path)
        .attr("fill", d => hasRareVeg(d) ? rareColor : nonRareColor)
        .attr("stroke", "#555")
        .attr("stroke-width", 0.4)
        .attr("cursor", "pointer")

        .on("mouseenter", (event, d) => {
          tooltip
            .style("display", "block")
            .style("opacity", 1)
            .html(`
              <strong>Eco Section:</strong> ${d.properties.Eco_Name}<br/>
              <strong>County:</strong> ${d.properties.County}<br/>
              <strong>Rare Vegetation:</strong> ${d.properties.RareVeg_types || "None"}<br/>
              <strong>Area:</strong> ${Math.round(d.properties.Shape__Area).toLocaleString()} m²
            `);
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

      // ✅ DRAW MATCHED LEGEND
      drawLegend();

    });

  })();
});
