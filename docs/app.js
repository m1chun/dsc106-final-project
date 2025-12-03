document.addEventListener("DOMContentLoaded", () => {

  const regionItems = document.querySelectorAll(".region-preview-list li");
  const adventure = document.getElementById("region-adventure");
  const exitBtn = document.getElementById("exit-adventure");

  console.log("✅ Region items:", regionItems.length);
  console.log("✅ Region data:", window.regionData);

  // ============================
  // ✅ HOVER → PREVIEW HIGHLIGHT
  // ============================
  regionItems.forEach(item => {
    const region = item.dataset.region;

    item.addEventListener("mouseenter", () => {
      window.highlightPhysioRegionOnMap?.(region);
    });

    item.addEventListener("mouseleave", () => {
      window.clearPhysioRegionHighlight?.();
    });

    // ============================
    // ✅ CLICK → ENTER ADVENTURE
    // ============================
    item.addEventListener("click", () => {
      const data = window.regionData?.[region];

      if (!data) {
        console.error("❌ Missing region data for:", region);
        return;
      }

      document.body.style.overflow = "hidden";
      document.querySelectorAll("section.step")
        .forEach(s => s.classList.add("hidden"));

      adventure.classList.remove("hidden");

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

      drawAdventurePhysioMap(displayMap[region]);
      window.currentRegionDisplayName = displayMap[region];
      initAdventureScroll(region);

      document.getElementById("adventure-title").textContent = data.title;
      document.getElementById("adventure-description").textContent = data.description;
      document.getElementById("adventure-fire").textContent = data.fire;
      document.getElementById("adventure-veg").textContent = data.veg;
      document.getElementById("adventure-overview-image").src = data.image;
    });
  });

  // ============================
  // ✅ EXIT ADVENTURE → BACK
  // ============================
  exitBtn?.addEventListener("click", () => {
    document.body.style.overflow = "auto";
    document.querySelectorAll("section.step")
      .forEach(s => s.classList.remove("hidden"));
    adventure.classList.add("hidden");
    window.clearPhysioRegionHighlight?.();
  });

});

// =======================================
// ✅ REAL ADVENTURE MAP: HIGHLIGHT REGION
// =======================================
window.initAdventureMap = function(regionKey) {

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

  const selectedRegionName = displayMap[regionKey];
  if (!selectedRegionName) return;

  const svg = d3.select("#adventure-map");
  const container = svg.node().parentElement;

  const width = container.clientWidth;
  const height = 620;

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg.selectAll("*").remove();

  svg
    .attr("width", width)
    .attr("height", height)
    .style("display", "block");

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const projection = d3.geoAlbers()
    .center([0, 37])
    .rotate([120, 0])
    .parallels([34, 40.5])
    .scale(innerWidth * 5)
    .translate([innerWidth / 2, innerHeight / 2]);

  const path = d3.geoPath().projection(projection);

  d3.json("ca-seed-zones.geojson").then(data => {

    g.selectAll("path")
      .data(data.features)
      .join("path")
      .attr("d", path)
      .attr("stroke", "#334155")
      .attr("stroke-width", 1)
      .attr("fill", d => {
        const seed = Number(d.properties.SEED_ZONE);
        const region = getPhysioRegion(seed);

        return region === selectedRegionName
          ? "#f97316"   // ✅ highlighted region
          : "#e5e7eb";  // ✅ background
      })
      .style("opacity", d => {
        const seed = Number(d.properties.SEED_ZONE);
        const region = getPhysioRegion(seed);
        return region === selectedRegionName ? 1 : 0.2;
      });

  });
};

// ============================
// ✅ ADVENTURE SCROLL CONTROLLER
// ============================
// ============================
// ✅ ADVENTURE SCROLL CONTROLLER (VIEW SWITCHING)
// ============================
function initAdventureScroll(regionKey) {

  const scroller = scrollama();

  scroller
    .setup({
      step: "#region-adventure .adventure-text .step",
      offset: 0.6
    })
    .onStepEnter(({ element }) => {

      const stepType = element.dataset.adventureStep;
      console.log("Entering adventure step:", stepType);

      // ✅ HIDE ALL RIGHT VIEWS
      document.querySelectorAll(".adventure-view")
        .forEach(v => v.classList.add("hidden"));

      // ✅ SWITCH BASED ON STEP
      if (stepType === "overview") {
        document.getElementById("adventure-view-map")
          .classList.remove("hidden");

        drawAdventurePhysioMap(window.currentRegionDisplayName);
      }

      if (stepType === "fire") {
        document.getElementById("adventure-view-fire")
          .classList.remove("hidden");

        drawAdventureFireView?.(regionKey); // you can implement this later
      }

      if (stepType === "veg") {
        document.getElementById("adventure-view-veg")
          .classList.remove("hidden");

        drawAdventureVegView?.(regionKey); // you can implement this later
      }

    });

  window.addEventListener("resize", scroller.resize);
}

