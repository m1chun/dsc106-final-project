// fire-density.js
document.addEventListener("DOMContentLoaded", function () {

  // ==============================
  // SVG + DIMENSIONS
  // ==============================
  const svg = d3.select("#fire-map");

const width = 2000;
const height = 1700;

    svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "100%");


    svg.style("max-width", "100%");


  // ==============================
  // COLOR SCALE
  // ==============================
  const densityThresholds = [0.00005, 0.0005, 0.005, 0.015];
  const densityColors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#990000']; 
  const densityLabels = ['Very Low', 'Low', 'Medium', 'High', 'Extreme'];

  const densityColorScale = d3.scaleThreshold()
    .domain(densityThresholds)
    .range(densityColors);

  // ==============================
  // LEGEND
  // ==============================
function renderLegend() {
  const legendContainer = d3.select("#color-legend").html("");

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

  legendContainer.selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .html(d => `
      <div class="legend-color" style="background:${d.color};"></div>
      <div>
        <strong>${d.label}</strong><br/>
        <span class="legend-range">${d.range}</span>
      </div>
    `);
}

  // ==============================
  // TOOLTIP
  // ==============================
  let tooltip = d3.select(".tooltip");
  if (tooltip.empty()) {
    tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip");
  }

  // ==============================
  // MAP RENDER
  // ==============================
  function renderMap(data) {

    svg.selectAll("*").remove();

    const padding = 40;

    const projection = d3.geoMercator()
      .fitExtent(
        [[padding, padding], [width - padding, height - padding]],
        data
      );

    const path = d3.geoPath().projection(projection);
    const mapGroup = svg.append("g");

    // Polygons
    mapGroup.selectAll("path.zone")
      .data(data.features)
      .enter()
      .append("path")
      .attr("class", "zone")
      .attr("d", path)
      .attr("fill", d => densityColorScale(d.properties.fire_density ?? 0))
      .attr("stroke", "#333")
      .attr("stroke-width", 2.5)
      .on("mouseenter", (event, d) => {
        const density = d.properties.fire_density ?? 0;
        const densityColor = densityColorScale(density);
        const densityCategory = densityLabels[densityColors.indexOf(densityColor)];

        tooltip
          .style("display", "block")
          .style("opacity", 1)
          .html(`
            <strong>Zone:</strong> ${d.properties.SEED_ZONE}<br/>
            <strong>Category:</strong> ${densityCategory}<br/>
            <strong>Fires:</strong> ${d.properties.fire_count}<br/>
            <strong>Raw Density:</strong> ${d3.format(".6f")(density)}
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

    // Zone labels (BIG + BOLD + OUTLINED)
    mapGroup.selectAll("text.zone-label")
      .data(data.features)
      .enter()
      .append("text")
      .attr("class", "zone-label")
      .attr("transform", d => `translate(${path.centroid(d)})`)
      .attr("dy", "0.35em")
      .text(d => d.properties.SEED_ZONE);

    renderLegend();
  }

  // ==============================
  // LOAD GEOJSON
  // ==============================
  const GEOJSON_URL = "fire_density_map.geojson";

  d3.json(GEOJSON_URL)
    .then(renderMap)
    .catch(err => console.error("GeoJSON load error:", err));

});
