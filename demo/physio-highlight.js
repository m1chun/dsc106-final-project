// ================================
// ✅ PHYSIO HIGHLIGHT CONTROLLER
// ================================

let physioMapReady = false;
let physioPaths = [];
let physioStatsBoxes = [];

// ✅ STATS STORAGE (FROM CSV)
let physioStatsData = {};

// ✅ COLOR MATCHING physio-zones.js (✅ NORMALIZED TO HYPHENS)
const physioColors = {
  "North Coast Redwood": "#1b9e77",
  "Central Coast": "#66a61e",
  "North Coast Interior": "#7570b3",
  "West Slope Cascades-Sierra": "#e7298a",
  "East Slope Cascades-Sierra": "#d95f02",
  "Great Basin": "#e6ab02",
  "Central Valley": "#a6761d",
  "SoCal Desert": "#ffd92f",
  "SoCal Mountains": "#666666"
};

// ✅ SERIES-BASED CLASSIFIER (✅ NORMALIZED TO HYPHENS)
function getPhysioRegion(seed) {
  const z = Number(seed);

  if (z >= 90 && z < 100) return "North Coast Redwood";
  if (z >= 100 && z < 200) return "Central Coast";
  if (z >= 300 && z < 400) return "North Coast Interior";
  if (z >= 500 && z < 600) return "West Slope Cascades-Sierra";
  if (z >= 700 && z < 800) return "East Slope Cascades-Sierra";

  if (z >= 950 && z < 960) return "Great Basin";
  if (z >= 960 && z < 970) return "Central Valley";
  if (z >= 980 && z < 990) return "SoCal Desert";
  if (z >= 990 && z < 1000) return "SoCal Mountains";

  return "Other";
}

// ================================
// ✅ LOAD & AGGREGATE CSV STATS
// ================================

d3.csv("physio_summary.csv").then(data => {

  data.forEach(d => {
    const region = d.physio_region
      .trim()
      .replace(/\s+/g, " ")
      .replace(/–/g, "-");

    physioStatsData[region] = {
      totalFires: isNaN(+d.total_fires) ? 0 : +d.total_fires,
      meanDensity: isNaN(+d.mean_density)
        ? "0.000"
        : (+d.mean_density).toFixed(3),
      meanRareVeg: isNaN(+d.mean_rare_veg)
        ? "0.0"
        : (+d.mean_rare_veg).toFixed(1)
    };
  });

  console.log("✅ CLEAN Physio Stats:", physioStatsData);
});

// ================================
// ✅ DRAW ALL HIGHLIGHT MAPS ONCE
// ================================

document.addEventListener("DOMContentLoaded", () => {

  const svgs = d3.selectAll(".map-physio-highlight");

  svgs.each(function () {

    const svg = d3.select(this);
    const statsBox = this.nextElementSibling;

    physioStatsBoxes.push(statsBox);

    const width = 800;
    const height = 650;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g");

const projection = d3.geoAlbers()
  .center([2, 35])              // ✅ pull map LEFT
  .rotate([120.5, 0])
  .parallels([34, 40.5])
  .scale(2600)                   // ✅ full CA visible
  .translate([width * 0.45, height * 0.55]);  // ✅ centered + slightly down


    const path = d3.geoPath().projection(projection);

    d3.json("ca-seed-zones.geojson").then(data => {

      const paths = g.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#e5e7eb")
        .attr("stroke", "#334155")
        .attr("stroke-width", 1);

      physioPaths.push(paths);
      physioMapReady = true;
    });

  });

});

// ================================
// ✅ SCROLL-DRIVEN HIGHLIGHT + STATS
// ================================

document.addEventListener("physioStepEnter", (event) => {

  const regions = event.detail.regions.map(r =>
    r.replace(/–/g, "-").trim()
  );

  if (!physioMapReady || !regions) return;

  // ✅ HIGHLIGHT MULTIPLE REGIONS
  physioPaths.forEach(paths => {
    paths
      .transition()
      .duration(600)
      .attr("fill", d => {
        const seed = Number(d.properties.SEED_ZONE);
        const r = getPhysioRegion(seed);
        return regions.includes(r)
          ? physioColors[r]
          : "#e5e7eb";
      });
  });

  // ✅ ✅ ✅ REAL STATS DISPLAY (FROM CSV)
  physioStatsBoxes.forEach(box => {
    if (!box) return;

    const statsHTML = regions.map(r => {
      const s = physioStatsData[r];

      if (!s) {
        return `<p><strong>${r}:</strong> No data</p>`;
      }

      return `
        <div class="physio-stat-row">
          <h4>${r}</h4>
          <p><strong>Total Fires:</strong> ${s.totalFires.toLocaleString()}</p>
          <p><strong>Mean Fire Density:</strong> ${s.meanDensity}</p>
          <p><strong>% Rare Vegetation:</strong> ${s.meanRareVeg}%</p>
        </div>
      `;
    }).join("");

    box.innerHTML = statsHTML;
  });

});
