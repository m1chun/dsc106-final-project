// ================================
// ✅ GLOBAL FIRE + BURNED SCALES (SHARED)
// ================================
window.globalFireScaleMax = null;
window.globalBurnedScaleMax = null;

d3.json("final_combined_data.geojson").then(seedData => {

    const regions = d3.group(seedData.features, d => d.properties.physio_region);

    let maxFire = 0;
    let maxBurned = 0;

    regions.forEach(features => {
        const totalArea = d3.sum(features, f => f.properties.zone_area_km2);
        const totalFireCount = d3.sum(features, f => f.properties.total_fire_count);
        const totalBurnedArea = d3.sum(features, f => f.properties.total_burned_area_km2);

        const fireDensity = (totalFireCount / totalArea) * 100;
        const burnedDensity = (totalBurnedArea / totalArea) * 100;

        maxFire = Math.max(maxFire, fireDensity);
        maxBurned = Math.max(maxBurned, burnedDensity);
    });

    window.globalFireScaleMax = maxFire;
    window.globalBurnedScaleMax = maxBurned;

    console.log("✅ Global fire scale:", maxFire);
    console.log("✅ Global burned scale:", maxBurned);
});

// =======================================
// ✅ ADVENTURE FIRE VIEW — TWO SEPARATE SVGS
// =======================================
window.drawAdventureFireView = function (regionKey) {

  const container = d3.select("#adventure-fire-chart");
  container.interrupt();
  container.selectAll("*").remove();

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

  const selectedRegion = displayMap[regionKey];
  if (!selectedRegion) return;

  d3.json("final_combined_data.geojson").then(seedData => {

    const regions = d3.group(seedData.features, d => d.properties.physio_region);
    const features = regions.get(selectedRegion);
    if (!features) return;

    // ✅ AGGREGATE METRICS (SAFE)
    const totalArea = d3.sum(features, f => f.properties.zone_area_km2);
    const totalFireCount = d3.sum(features, f => f.properties.total_fire_count);
    const totalBurnedArea = d3.sum(features, f => f.properties.total_burned_area_km2);

    const fireDensity = (totalFireCount / totalArea) * 100;
    const burnedDensity = (totalBurnedArea / totalArea) * 100;

    // ✅ HARD RESET
    container.selectAll("*").remove();

    // ✅ Title
    container.append("h3")
      .style("text-align", "center")
      .style("margin-bottom", "1 rem")
      .text("Wildfire Density per 100 km²");

    // ✅ FIRE BAR
    drawSingleFireBar({
      container,
      label: "Fires per 100 km²",
      value: fireDensity,
      max: window.globalFireScaleMax,
      color: window.regionColors[selectedRegion]
    });

    // ✅ BURNED BAR
    drawSingleFireBar({
      container,
      label: "Burned km² per 100 km²",
      value: burnedDensity,
      max: window.globalBurnedScaleMax,
      color: window.regionColors[selectedRegion]
    });

    // ✅ ✅ ✅ ACTIVATE SLIDER — NOW SAFE
    enableFireMultiplier(fireDensity, burnedDensity);

  });
};



// =======================================
// ✅ SINGLE BAR BUILDER (REUSABLE)
// =======================================
function drawSingleFireBar({ container, label, value, max, color }) {

    const width = container.node().clientWidth;
    const height = 110;

    const margin = { top: 20, right: 90, bottom: 35, left: 220 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    // ✅ SCALE
    const x = d3.scaleLinear()
        .domain([0, max * 1.05])
        .range([margin.left, width - margin.right])
        .clamp(true);

    // ✅ THICK BAR
    const barHeight = 30;
    const barY = height / 2 - barHeight / 2;

    svg.append("rect")
        .attr("x", margin.left)
        .attr("y", barY)
        .attr("height", barHeight)
        .attr("width", x(value) - margin.left)
        .attr("rx", 10)
        .attr("fill", color || "#4682b4");

    // ✅ Metric label (left)
    svg.append("text")
        .attr("x", margin.left - 16)
        .attr("y", height / 2 + 5)
        .attr("text-anchor", "end")
        .attr("font-size", "14px")
        .attr("font-weight", "700")
        .text(label);

    // ✅ Value label (right of bar)
    svg.append("text")
        .attr("x", x(value) + 10)
        .attr("y", height / 2 + 5)
        .attr("font-size", "14px")
        .attr("font-weight", "700")
        .text(value.toFixed(2));

    // ✅ X Axis
    const axis = d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d3.format(".2f"));

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(axis);

}

// =======================================
// ✅ FIRE INTENSITY SIMULATOR
// =======================================
window.enableFireMultiplier = function (originalFire, originalBurned) {

    const slider = document.getElementById("fireMultiplier");
    const label = document.getElementById("fireMultiplierValue");

    if (!slider) return;

    slider.value = 1;
    label.textContent = "1.00×";

    slider.oninput = () => {
        const multiplier = Number(slider.value);
        label.textContent = multiplier.toFixed(2) + "×";

        const adjustedFire = originalFire * multiplier;
        const adjustedBurned = originalBurned * multiplier;

        // ✅ REBUILD FIRE VIEW WITH NEW VALUES
        const container = d3.select("#adventure-fire-chart");
        container.selectAll("*").remove();

        drawSingleFireBar({
            container,
            label: "Fires per 100 km²",
            value: adjustedFire,
            max: window.globalFireScaleMax,
            color: window.regionColors[window.currentRegionDisplayName]
        });

        drawSingleFireBar({
            container,
            label: "Burned km² per 100 km²",
            value: adjustedBurned,
            max: window.globalBurnedScaleMax,
            color: window.regionColors[window.currentRegionDisplayName]
        });
    };
};


// ================================
// ✅ GLOBAL RARE VEGETATION SCALES
// ================================
window.globalRareVegDensityMax = null;
window.globalRareVegPercentMax = null;

d3.json("./final_combined_data.geojson").then(seedData => {

    const regions = d3.group(seedData.features, d => d.properties.physio_region);

    let maxDensity = 0;
    let maxPercent = 0;

    regions.forEach(features => {
        const totalArea = d3.sum(features, f => f.properties.zone_area_km2);
        const totalRareVeg = d3.sum(features, f => f.properties.rare_vegetation_area_km2 || 0);

        const density = (totalRareVeg / totalArea) * 100;
        const percent = d3.mean(features, f => f.properties.percent_zone_rare_veg || 0);

        maxDensity = Math.max(maxDensity, density);
        maxPercent = Math.max(maxPercent, percent);
    });

    window.globalRareVegDensityMax = maxDensity;
    window.globalRareVegPercentMax = maxPercent;
});

// =======================================
// ✅ ADVENTURE VEGETATION VIEW — MATCHES FIRE STYLE
// =======================================
window.drawAdventureVegView = function (regionKey) {

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

    const selectedRegion = displayMap[regionKey];
    if (!selectedRegion) return;

    d3.json("final_combined_data.geojson").then(seedData => {

        const regions = d3.group(seedData.features, d => d.properties.physio_region);
        const features = regions.get(selectedRegion);
        if (!features) return;

        // ================================
        // ✅ AGGREGATE VEG METRICS
        // ================================
        const totalArea = d3.sum(features, f => f.properties.zone_area_km2);
        const totalRareVeg = d3.sum(features, f => f.properties.rare_vegetation_area_km2 || 0);

        const rareVegDensity = (totalRareVeg / totalArea) * 100;
        const rareVegPercent = d3.mean(features, f => f.properties.percent_zone_rare_veg || 0);

        // ================================
        // ✅ HARD RESET CONTAINER
        // ================================
        const container = d3.select("#adventure-veg-chart");
        container.interrupt();
        container.selectAll("*").remove();

        // ✅ Title (matches fire)
        container.append("h3")
            .style("text-align", "center")
            .style("margin-bottom", "1rem")
            .text("Rare & Sensitive Vegetation by Region");

        // ================================
        // ✅ SVG 1 — RARE VEG DENSITY (MATCHES FIRE)
        // ================================
        drawSingleFireBar({
            container: container,
            label: "Rare Veg km² per 100 km²",
            value: rareVegDensity,
            max: window.globalRareVegDensityMax,
            color: window.regionColors[selectedRegion]
        });

        // ================================
        // ✅ SVG 2 — % RARE VEGETATION (MATCHES FIRE)
        // ================================
        drawSingleFireBar({
            container: container,
            label: "% of Region Rare Vegetation",
            value: rareVegPercent,
            max: window.globalRareVegPercentMax,
            color: window.regionColors[selectedRegion]
        });

    });
};
