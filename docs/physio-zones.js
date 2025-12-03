document.addEventListener("DOMContentLoaded", () => {
  (function () {

    // ==============================
    // ✅ GLOBAL REGION CLASSIFIER
    // ==============================
    window.getPhysioRegion = function(seedZone) {
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
    };

    // ==============================
    // ✅ RESPONSIVE TWO-COLUMN SETUP
    // ==============================
    const svg = d3.select("#map-physio");
    const container = svg.node().parentElement;

    const width = container.clientWidth;
    const height = 820;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 auto");

    svg.selectAll("*").remove();

    const gPhysio = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const projection = d3.geoAlbers()
      .center([0, 37])
      .rotate([120, 0])
      .parallels([34, 40.5])
      .scale(innerWidth * 5.3)
      .translate([innerWidth / 2, innerHeight / 2]);

    const path = d3.geoPath().projection(projection);

    // ================================
    // ✅ COLOR PALETTE
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
    // ✅ LABELS (HIDDEN BY DEFAULT)
    // ================================
    function addLabels(data) {
      gPhysio.selectAll("text.zone-label")
        .data(data.features)
        .join("text")
        .attr("class", "zone-label physio-label")
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-size", "12px")
        .attr("font-weight", "800")
        .attr("fill", "#0f172a")
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("paint-order", "stroke")
        .style("opacity", 0)
        .text(d => d.properties.SEED_ZONE);
    }

    // ================================
    // ✅ LEGEND
    // ================================
    function drawLegend() {
      const legend = svg.append("g")
        .attr("class", "physio-legend")
        .attr("transform", `translate(${width - 220}, 20)`);

      legend.append("text")
        .attr("x", 100)
        .attr("y", 22)
        .attr("text-anchor", "middle")
        .attr("font-weight", "800")
        .attr("font-size", "17px")
        .attr("fill", "#7f1d1d")
        .text("Physio Regions");

      Object.entries(regionColors).forEach(([label, color], i) => {
        const row = legend.append("g")
          .attr("transform", `translate(16, ${48 + i * 30})`);

        row.append("rect")
          .attr("width", 16)
          .attr("height", 16)
          .attr("rx", 4)
          .attr("fill", color)
          .attr("stroke", "#111");

        row.append("text")
          .attr("x", 22)
          .attr("y", 12)
          .attr("font-size", "14px")
          .attr("fill", "#111")
          .text(label);
      });
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
          return regionColors[getPhysioRegion(seed)] || "#e5e7eb";
        })
        .attr("stroke", "#334155")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")

        .on("mouseenter", function (event, d) {
          d3.select(this).classed("map-glow", true);

          const seed = Number(d.properties.SEED_ZONE);
          const region = getPhysioRegion(seed);

          d3.select(".tooltip")
            .style("opacity", 1)
            .html(`
              <strong>Seed Zone:</strong> ${seed}<br>
              <strong>Physio Region:</strong> ${region}
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
      drawLegend();
    });

    // ==============================
    // ✅ LABEL TOGGLE
    // ==============================
    const physioToggleBtn = document.getElementById("toggle-physio-labels-btn");
    let physioLabelsVisible = false;

    if (physioToggleBtn) {
      physioToggleBtn.addEventListener("click", () => {
        physioLabelsVisible = !physioLabelsVisible;

        d3.selectAll(".physio-label")
          .transition()
          .duration(300)
          .style("opacity", physioLabelsVisible ? 1 : 0);

        physioToggleBtn.textContent = physioLabelsVisible
          ? "Hide Seed Zone Numbers"
          : "Show Seed Zone Numbers";
      });
    }

  })();
});

// ==============================
// ✅ HIGHLIGHT A PHYSIO REGION (SAFE)
// ==============================
window.highlightPhysioRegionOnMap = function(regionKey) {

  const displayMap = {
    "north-coast-redwood": "North Coast Redwood",
    "central-coast": "Central Coast",
    "north-coast-interior": "North Coast Interior",
    "west-slope-sierra": "West Slope Cascades–Sierra",
    "east-slope-sierra": "East Slope Cascades–Sierra",
    "great-basin": "Great Basin",
    "central-valley": "Central Valley",
    "socal-desert": "SoCal Desert",
    "socal-mountains": "SoCal Mountains"
  };

  const targetRegion = displayMap[regionKey];
  const paths = d3.select("#map-chooser").selectAll("path");

  paths
    .classed("map-glow", false)
    .transition()
    .duration(150)
    .style("opacity", 0.15);

  const active = paths
    .filter(d => {
      const seed = Number(d.properties.SEED_ZONE);
      return getPhysioRegion(seed) === targetRegion;
    });

  active
    .transition()
    .duration(150)
    .style("opacity", 1);

  active.classed("map-glow", true);
};


// ==============================
// ✅ CLEAR HIGHLIGHT (SAFE)
// ==============================
window.clearPhysioRegionHighlight = function() {

  const paths = d3.select("#map-chooser").selectAll("path");

  paths
    .classed("map-glow", false)
    .transition()
    .duration(150)
    .style("opacity", 1)
    .attr("fill", "#e5e7eb");
};


