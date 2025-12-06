/******************************************************
 *                FIRE MAP FUNCTION
 ******************************************************/
function drawFireMap(svgId) {
  const width = 800, height = 800;
  const margin = { top: 50, right: 20, bottom: 20, left: 20 };

  const svg = d3.select(svgId)
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ⭐ Inner group so we can scale it uniformly later
  const mapGroup = g.append("g").attr("class", "map-inner");

  const projection = d3.geoAlbers()
    .center([1, 36])
    .rotate([120.5, 0])
    .parallels([34, 40.5])
    .scale(3400)
    .translate([(width - margin.left - margin.right) / 2,
    (height - margin.top - margin.bottom) / 2]);

  const path = d3.geoPath().projection(projection);

  const thresholds = [0.00005, 0.0005, 0.005, 0.015];
  const colors = ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#990000"];
  const labels = ["Very Low", "Low", "Medium", "High", "Extreme"];

  const colorScale = d3.scaleThreshold().domain(thresholds).range(colors);

  let tooltip = d3.select(".tooltip");
  if (tooltip.empty()) tooltip = d3.select("body").append("div").attr("class", "tooltip");

  d3.json("fire_density_map.geojson").then(data => {
    // PATHS
    mapGroup.selectAll("path")
      .data(data.features)
      .join("path")
      .attr("d", path)
      .attr("fill", d => colorScale(d.properties.fire_density ?? 0))
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.4)
      .on("mouseenter", (event, d) => {
        const regionName = getPhysioRegion(d.properties.SEED_ZONE);

        tooltip.style("opacity", 1).html(`
    <strong>Region:</strong> ${regionName}<br/>
    <strong>Seed Zone:</strong> ${d.properties.SEED_ZONE}<br/>
    <strong>Density:</strong> ${d3.format(".6f")(d.properties.fire_density ?? 0)}
  `);
      })

      .on("mousemove", e => {
        tooltip.style("left", e.clientX + 12 + "px")
          .style("top", e.clientY + 12 + "px");
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    // LABELS
    mapGroup.selectAll("text")
      .data(data.features)
      .join("text")
      .attr("x", d => path.centroid(d)[0] - 12)
      .attr("y", d => path.centroid(d)[1])
      .text(d => d.properties.SEED_ZONE)
      .attr("font-size", "10px")
      .attr("font-weight", "900")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("paint-order", "stroke");

    // LEGEND
    const legend = svg.append("g").attr("transform", "translate(275,40)");

    legend.append("text")
      .text("Fire Density")
      .attr("font-size", "17px")
      .attr("font-weight", "800")
      .attr("fill", "#7f1d1d");

    const legendData = [
      { label: labels[0], color: colors[0], range: `0 – ${thresholds[0]}` },
      { label: labels[1], color: colors[1], range: `${thresholds[0]} – ${thresholds[1]}` },
      { label: labels[2], color: colors[2], range: `${thresholds[1]} – ${thresholds[2]}` },
      { label: labels[3], color: colors[3], range: `${thresholds[2]} – ${thresholds[3]}` },
      { label: labels[4], color: colors[4], range: `> ${thresholds[3]}` }
    ];

    legend.selectAll("g.row")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "row")
      .attr("transform", (d, i) => `translate(0, ${25 + i * 22})`)
      .each(function (d) {
        const row = d3.select(this);
        row.append("rect").attr("width", 18).attr("height", 18).attr("fill", d.color);
        row.append("text")
          .attr("x", 26)
          .attr("y", 13)
          .text(`${d.label} (${d.range})`)
          .attr("font-size", "13px");
      });
  });
}


/******************************************************
 *               PRECIP MAP FUNCTION
 ******************************************************/
function drawPrecipMap(svgId) {
  const width = 800, height = 800;
  const margin = { top: 50, right: 20, bottom: 20, left: 20 };

  const svg = d3.select(svgId)
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const mapGroup = g.append("g").attr("class", "map-inner");

  const projection = d3.geoIdentity().reflectY(true);
  const path = d3.geoPath(projection);

  const thresholds = [50, 100, 150, 200];
  const colors = ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1e3a8a"];
  const labels = [
    `Very Low (0 - ${thresholds[0]} mm)`,
    `Low (${thresholds[0]} - ${thresholds[1]} mm)`,
    `Moderate (${thresholds[1]} - ${thresholds[2]} mm)`,
    `High (${thresholds[2]} - ${thresholds[3]} mm)`,
    `Very High (> ${thresholds[3]} mm)`
  ];

  const colorScale = d3.scaleThreshold().domain(thresholds).range(colors);

  let tooltip = d3.select(".tooltip");
  if (tooltip.empty()) tooltip = d3.select("body").append("div").attr("class", "tooltip");

  d3.json("final_combined_data.geojson").then(data => {
    projection.fitSize(
      [width - margin.left - margin.right, height - margin.top - margin.bottom],
      data
    );

    // PATHS
    mapGroup.selectAll("path")
      .data(data.features)
      .join("path")
      .attr("d", path)
      .attr("fill", d => colorScale(d.properties.Weighted_Avg_Precipitation ?? 0))
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.2)
      .on("mouseenter", (event, d) => {
        tooltip.style("opacity", 1).html(`
          <strong>Region:</strong> ${d.properties.physio_region}<br/>
          <strong>Seed Zone:</strong> ${d.properties.SEED_ZONE}<br/>
          <strong>Avg Precip:</strong> ${d3.format(".1f")(d.properties.Weighted_Avg_Precipitation)} mm
        `);
      })
      .on("mousemove", e => {
        tooltip.style("left", e.clientX + 12 + "px")
          .style("top", e.clientY + 12 + "px");
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    mapGroup.selectAll("text")
      .data(data.features)
      .join("text")
      .attr("x", d => path.centroid(d)[0] - 12)
      .attr("y", d => path.centroid(d)[1])
      .text(d => d.properties.SEED_ZONE)
      .attr("font-size", "14px")
      .attr("font-weight", "900")
      .attr("fill", "#0f172a")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("paint-order", "stroke");


    // LEGEND
    const legend = svg.append("g")
      .attr("transform", "translate(275,40)");

    // ⭐ Legend Title (larger, bolder)
    legend.append("text")
      .text("Average Precipitation")
      .attr("font-size", "17px")    // ⬅ bigger title
      .attr("font-weight", "700")   // ⬅ bold
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", "#1e3a8a");

    // ⭐ Updated labels including numeric ranges
    const labels = [
      "Very Low (0 – 50 mm)",
      "Low (50 – 100 mm)",
      "Moderate (100 – 150 mm)",
      "High (150 – 200 mm)",
      "Very High (> 200 mm)"
    ];

    labels.forEach((label, i) => {
      const row = legend.append("g")
        .attr("transform", `translate(0, ${30 + i * 24})`);

      // Color box
      row.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", colors[i]);

      // ⭐ Legend item text (slightly smaller)
      row.append("text")
        .attr("x", 26)
        .attr("y", 13)
        .style("font-size", "13px")     // ⬅ slightly smaller than title
        .style("font-weight", "400")    // ⬅ medium weight
        .text(label);
    });
  });
}

/******************************************************
 *        AUTO-SCALE BOTH MAPS TO SAME SIZE
 ******************************************************/
function alignMap(svgId) {
  const svg = d3.select(svgId);
  const g = svg.select(".map-inner");
  if (g.empty()) return;

  const bbox = g.node().getBBox();
  const targetWidth = 420;
  const scale = targetWidth / bbox.width;

  // ⭐ SHIFT LEFT MORE BY REDUCING X-OFFSET
  const finalX = 10 - bbox.x * scale;   // <— changed!
  const finalY = 40 - bbox.y * scale;

  g.attr("transform", `translate(${finalX}, ${finalY}) scale(${scale})`);
}

/******************************************************
 *                MAIN EXECUTION
 ******************************************************/
document.addEventListener("DOMContentLoaded", () => {
  drawFireMap("#map-left");
  drawPrecipMap("#map-right");

  setTimeout(() => {
    alignMap("#map-left");
    alignMap("#map-right");
  }, 200);
});
