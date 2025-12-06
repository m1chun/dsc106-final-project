document.addEventListener("DOMContentLoaded", () => {

  const svg = d3.select("#map-chooser");
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

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const projection = d3.geoAlbers()
    .center([0, 37])
    .rotate([120, 0])
    .parallels([34, 40.5])
    .scale(innerWidth * 5.3)
    .translate([innerWidth / 2, innerHeight / 2]);

  const path = d3.geoPath().projection(projection);

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

  // =====================================
  //  LOAD + DRAW MAP
  // =====================================
  d3.json("ca-seed-zones.geojson").then(data => {

    g.selectAll("path")
      .data(data.features)
      .join("path")
      .attr("d", path)
      .attr("fill", "#e5e7eb")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1)
      .attr("opacity", 1)
      .style("cursor", "pointer")
      .style("pointer-events", "all")
      .style("transition", "opacity 0.15s ease, fill 0.15s ease")

      // =============================
      //  ⭐ FIXED TOOLTIP HANDLERS
      // =============================
      // =============================
      //  ⭐ FIXED TOOLTIP HANDLERS
      // =============================
      .on("mouseenter", function (event, d) {

        const seed = Number(d.properties.SEED_ZONE);
        const regionName = getPhysioRegion(seed);

        const regionKey = Object.keys(displayMap)
          .find(k => displayMap[k] === regionName);

        // highlight the region polygons
        highlightRegion(regionKey);

        // ⭐ Always show tooltip using reliable pattern
        const tooltip = d3.select(".tooltip");
        tooltip
          .style("display", "block")
          .style("opacity", 1)
          .html(`
        ${regionName}<br/>
      `);
      })

      .on("mousemove", function (event) {
        d3.select(".tooltip")
          .style("left", (event.clientX + 12) + "px")
          .style("top", (event.clientY + 12) + "px");
      })

      .on("mouseleave", function () {
        // ⭐ Hide tooltip cleanly
        d3.select(".tooltip")
          .style("opacity", 0)
          .style("display", "none");

        clearHighlight();  // Un-highlight map
      });


    setupChooserHover();
  });

  // =====================================
  //  REGION LIST INTERACTION
  // =====================================
  function setupChooserHover() {
    const items = document.querySelectorAll(".region-preview-list li");

    items.forEach(li => {
      const regionKey = li.dataset.region;

      li.addEventListener("mouseenter", () => highlightRegion(regionKey));
      li.addEventListener("mouseleave", () => clearHighlight());
      li.addEventListener("click", () => {
        if (typeof enterRegionAdventure === "function") {
          enterRegionAdventure(regionKey);
        }
      });
    });
  }

  // =====================================
  //  HIGHLIGHT & RESET HELPERS
  // =====================================
  function highlightRegion(regionKey) {
    const target = displayMap[regionKey];
    const paths = d3.select("#map-chooser").selectAll("path");

    paths
      .classed("map-glow", false)
      .style("opacity", 0.15)
      .attr("fill", "#e5e7eb")
      .attr("stroke-width", 1);

    paths
      .filter(d => getPhysioRegion(d.properties.SEED_ZONE) === target)
      .classed("map-glow", true)
      .style("opacity", 1)
      .attr("fill", regionColors[target])
      .attr("stroke-width", 2.5);
  }

  function clearHighlight() {
    d3.select("#map-chooser")
      .selectAll("path")
      .classed("map-glow", false)
      .style("opacity", 1)
      .attr("fill", "#e5e7eb")
      .attr("stroke-width", 1);
  }

});
