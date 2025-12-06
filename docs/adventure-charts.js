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

window.globalFireMean = 6.24;
window.globalBurnedMean = 43.75;

// =======================================
// ✅ ADVENTURE FIRE VIEW — TWO SEPARATE BAR CHART SVGS
// =======================================
window.drawAdventureFireView = function (regionKey) {

    const container = d3.select("#adventure-fire-chart");
    container.interrupt();
    container.selectAll("*").remove();

    const displayMap = {
        "north-coast-redwood": "North Coast Redwood",
        "central-coast": "Central Coast",
        "north-coast-interior": "North Coast Interior",
        "west-slope-sierra": "West Slope Cascades-Sierra",
        "east-slope-sierra": "East Slope Cascades-Sierra",
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

    });

    drawAdventureFireDensityMap(regionKey);
};



// =======================================
// ✅ SINGLE BAR BUILDER (REUSABLE)
// =======================================
function drawSingleFireBar({ container, label, value, max, color }) {

    const width = container.node().clientWidth;
    const height = 90;

    const margin = { top: 10, right: 70, bottom: 28, left: 200 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    // ✅ SCALE
    const x = d3.scaleLinear()
        .domain([0, max * 1.05])
        .range([margin.left, width - margin.right])
        .clamp(true);

    // ✅ THICK BAR
    const barHeight = 26;
    const barY = height / 2 - barHeight / 2;

    // ===============================
    // ✅ BAR WITH TOOLTIP INTERACTION
    // ===============================
    const tooltip = d3.select(".tooltip");

    svg.append("rect")
        .attr("x", margin.left)
        .attr("y", barY)
        .attr("height", barHeight)
        .attr("width", x(value) - margin.left)
        .attr("rx", 10)
        .attr("fill", color || "#4682b4")
        .style("cursor", "pointer")

        // 🔥 Hover ON
        .on("mouseenter", (event) => {
            tooltip
                .style("display", "block")
                .style("opacity", 1)
                .html(`
                <strong>${label}</strong><br>
                Value: ${value.toFixed(2)}
            `);
        })

        // 🔥 Move tooltip with mouse
        .on("mousemove", (event) => {
            tooltip
                .style("left", (event.clientX + 12) + "px")
                .style("top", (event.clientY + 12) + "px");
        })

        // 🔥 Hover OFF
        .on("mouseleave", () => {
            tooltip
                .style("opacity", 0)
                .style("display", "none");
        });


    // ✅ Metric label (left)
    svg.append("text")
        .attr("x", margin.left - 16)
        .attr("y", height / 2 + 5)
        .attr("text-anchor", "end")
        .attr("font-size", "14px")
        .attr("font-weight", "700")
        .text(label);

    // ✅ X Axis
    const axis = d3.axisBottom(x)
        .ticks(5)

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(axis);

    // ======================================
    // ✅ MEAN REFERENCE LINE + LABEL
    // ======================================
    const meanValue = label.includes("Fires")
        ? window.globalFireMean
        : window.globalBurnedMean;

    const meanX = x(meanValue);

    // ✅ Dashed vertical line
    svg.append("line")
        .attr("x1", meanX)
        .attr("x2", meanX)
        .attr("y1", barY - 6)
        .attr("y2", barY + barHeight + 6)
        .attr("stroke", "#111")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,3")
        .attr("opacity", 0.8);

    // ✅ Mean label above line
    svg.append("text")
        .attr("x", meanX)
        .attr("y", barY - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("font-weight", "700")
        .attr("fill", "#111")
        .text(`State Mean: ${meanValue.toFixed(2)}`);
}


// // ================================
// // ✅ GLOBAL RARE VEGETATION SCALES
// // ================================
// window.globalRareVegDensityMax = null;
// window.globalRareVegPercentMax = null;

// d3.json("./final_combined_data.geojson").then(seedData => {

//     const regions = d3.group(seedData.features, d => d.properties.physio_region);

//     let maxDensity = 0;
//     let maxPercent = 0;

//     regions.forEach(features => {
//         const totalArea = d3.sum(features, f => f.properties.zone_area_km2);
//         const totalRareVeg = d3.sum(features, f => f.properties.rare_vegetation_area_km2 || 0);

//         const density = (totalRareVeg / totalArea) * 100;
//         const percent = d3.mean(features, f => f.properties.percent_zone_rare_veg || 0);

//         maxDensity = Math.max(maxDensity, density);
//         maxPercent = Math.max(maxPercent, percent);
//     });

//     window.globalRareVegDensityMax = maxDensity;
//     window.globalRareVegPercentMax = maxPercent;
// });

// // =======================================
// // ✅ ADVENTURE VEGETATION VIEW — MATCHES FIRE STYLE
// // =======================================
// window.drawAdventureVegView = function (regionKey) {

//     const displayMap = {
//         "north-coast-redwood": "North Coast Redwood",
//         "central-coast": "Central Coast",
//         "north-coast-interior": "North Coast Interior",
//         "west-slope-sierra": "West Slope Cascades–Sierra",
//         "east-slope-sierra": "East Slope Cascades–Sierra",
//         "great-basin": "Great Basin",
//         "central-valley": "Central Valley",
//         "socal-desert": "SoCal Desert",
//         "socal-mountains": "SoCal Mountains"
//     };

//     const selectedRegion = displayMap[regionKey];
//     if (!selectedRegion) return;

//     d3.json("final_combined_data.geojson").then(seedData => {

//         const regions = d3.group(seedData.features, d => d.properties.physio_region);
//         const features = regions.get(selectedRegion);
//         if (!features) return;

//         // ================================
//         // ✅ AGGREGATE VEG METRICS
//         // ================================
//         const totalArea = d3.sum(features, f => f.properties.zone_area_km2);
//         const totalRareVeg = d3.sum(features, f => f.properties.rare_vegetation_area_km2 || 0);

//         const rareVegDensity = (totalRareVeg / totalArea) * 100;
//         const rareVegPercent = d3.mean(features, f => f.properties.percent_zone_rare_veg || 0);

//         // ================================
//         // ✅ HARD RESET CONTAINER
//         // ================================
//         const container = d3.select("#adventure-veg-chart");
//         container.interrupt();
//         container.selectAll("*").remove();

//         // ✅ Title (matches fire)
//         container.append("h3")
//             .style("text-align", "center")
//             .style("margin-bottom", "1rem")
//             .text("Rare & Sensitive Vegetation by Region");

//         // ================================
//         // ✅ SVG 1 — RARE VEG DENSITY (MATCHES FIRE)
//         // ================================
//         drawSingleFireBar({
//             container: container,
//             label: "Rare Veg km² per 100 km²",
//             value: rareVegDensity,
//             max: window.globalRareVegDensityMax,
//             color: window.regionColors[selectedRegion]
//         });

//         // ================================
//         // ✅ SVG 2 — % RARE VEGETATION (MATCHES FIRE)
//         // ================================
//         drawSingleFireBar({
//             container: container,
//             label: "% of Region Rare Vegetation",
//             value: rareVegPercent,
//             max: window.globalRareVegPercentMax,
//             color: window.regionColors[selectedRegion]
//         });

//     });
// };

// =======================================
// ✅ ADVENTURE FIRE DENSITY MAP (FULL STATE + REGION EMPHASIS)
// =======================================
window.drawAdventureFireDensityMap = function (regionKey) {

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

    const svg = d3.select("#adventure-fire-map");
    if (svg.empty()) return;

    const container = svg.node().parentElement;

    const width = container.clientWidth;
    const height = 700;

    const margin = { top: 40, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    svg
        .attr("width", width)
        .attr("height", height)
        .style("display", "block");

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    drawAdventureFireLegend(svg, width);

    // ✅ Projection (statewide)
    const projection = d3.geoAlbers()
        .center([1, 36.5])
        .rotate([120.5, 0])
        .parallels([34, 40.5])
        .scale(innerWidth * 5)
        .translate([innerWidth / 2, innerHeight / 2]);

    const path = d3.geoPath().projection(projection);

    // ✅ Fire density scale (same as main map)
    const densityThresholds = [0.00005, 0.0005, 0.005, 0.015];
    const densityColors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#990000'];

    const densityColorScale = d3.scaleThreshold()
        .domain(densityThresholds)
        .range(densityColors);

    // ✅ Tooltip (shared)
    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body").append("div").attr("class", "tooltip");
    }

    d3.json("fire_density_map.geojson").then(data => {

        g.selectAll("path")
            .data(data.features)
            .join("path")
            .attr("d", path)

            // ✅ Color = fire density for ALL of CA
            .attr("fill", d => densityColorScale(d.properties.fire_density ?? 0))

            .attr("stroke", "#334155")
            .attr("stroke-width", 1.2)

            // ✅ DIM NON-SELECTED REGIONS
            .style("opacity", d => {
                const seed = Number(d.properties.SEED_ZONE);
                const region = getPhysioRegion(seed);
                return region === selectedRegion ? 1 : 0.2;
            })

            // ✅ EMPHASIZE SELECTED REGION BOUNDARY
            .attr("stroke-width", d => {
                const seed = Number(d.properties.SEED_ZONE);
                const region = getPhysioRegion(seed);
                return region === selectedRegion ? 2.8 : 1.2;
            })

            .style("cursor", "default")

            // ✅ TOOLTIP
            .on("mouseenter", (event, d) => {
                const density = d.properties.fire_density ?? 0;

                tooltip
                    .style("display", "block")
                    .style("opacity", 1)
                    .html(`
            <strong>Seed Zone:</strong> ${d.properties.SEED_ZONE}<br/>
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
                tooltip
                    .style("opacity", 0)
                    .style("display", "none");
            });

    });
};

// =======================================
// ✅ FIRE DENSITY LEGEND (ADVENTURE MAP)
// =======================================
function drawAdventureFireLegend(svg, width) {

    const densityThresholds = [0.00005, 0.0005, 0.005, 0.015];
    const densityColors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#990000'];
    const densityLabels = ['Very Low', 'Low', 'Medium', 'High', 'Extreme'];

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

    const legend = svg.append("g")
        .attr("class", "adventure-fire-legend")
        .attr("transform", `translate(${width - 300}, 20)`);

    // ✅ TITLE
    legend.append("text")
        .attr("x", 90)
        .attr("y", 18)
        .attr("text-anchor", "middle")
        .attr("font-weight", "700")
        .attr("font-size", "14px")
        .attr("fill", "#7f1d1d")
        .text("Fire Density");

    const items = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(10, ${30 + i * 18})`);

    items.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("rx", 3)
        .attr("fill", d => d.color)
        .attr("stroke", "#111");

    items.append("text")
        .attr("x", 20)
        .attr("y", 11)
        .attr("font-size", "11px")
        .attr("fill", "#111")
        .text(d => `${d.label}`);
}

// =======================================
// ✅ ADVENTURE PRECIPITATION MAP (REGION EMPHASIS)
// =======================================
window.drawAdventurePrecipMap = function (regionKey) {

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

    const svg = d3.select("#adventure-precip-map");
    if (svg.empty()) return;

    const container = svg.node().parentElement;

    const width = container.clientWidth;
    const height = 600;

    const margin = { top: 40, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    svg
        .attr("width", width)
        .attr("height", height)
        .style("display", "block");

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    drawAdventurePrecipLegend(svg, width);

    // ================================
    // PROJECTION
    // ================================
    const projection = d3.geoIdentity().reflectY(true);
    const path = d3.geoPath(projection);

    // ================================
    // PRECIP SCALE (same as main map)
    // ================================
    const thresholds = [50, 100, 150, 200];
    const colors = ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1e3a8a"];

    const colorScale = d3.scaleThreshold().domain(thresholds).range(colors);

    // ================================
    // TOOLTIP
    // ================================
    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body").append("div").attr("class", "tooltip");
    }

    // ================================
    // LOAD + DRAW
    // ================================
    d3.json("final_combined_data.geojson").then(data => {

        projection.fitSize([innerWidth, innerHeight], data);

        g.selectAll("path")
            .data(data.features)
            .join("path")
            .attr("d", path)

            // NORMAL COLORING
            .attr("fill", d => colorScale(d.properties.Weighted_Avg_Precipitation ?? 0))

            .attr("stroke", "#334155")
            .attr("stroke-width", 1.3)

            // ⭐ DIM NON-SELECTED REGIONS
            .style("opacity", d => {
                const seed = Number(d.properties.SEED_ZONE);
                const region = getPhysioRegion(seed);
                return region === selectedRegion ? 1 : 0.2;
            })

            // ⭐ THICKEN BORDER FOR SELECTED REGION
            .attr("stroke-width", d => {
                const seed = Number(d.properties.SEED_ZONE);
                const region = getPhysioRegion(seed);
                return region === selectedRegion ? 2.5 : 1.3;
            })

            // =============================
            // TOOLTIP WITH CATEGORY
            // =============================
            .on("mouseenter", (event, d) => {

                const precip = d.properties.Weighted_Avg_Precipitation ?? 0;

                // ⭐ Determine numeric category using thresholds
                let category = "";
                if (precip < 50) category = "Very Low";
                else if (precip < 100) category = "Low";
                else if (precip < 150) category = "Moderate";
                else if (precip < 200) category = "High";
                else category = "Very High";

                tooltip
                    .style("display", "block")
                    .style("opacity", 1)
                    .html(`
            <strong>Seed Zone:</strong> ${d.properties.SEED_ZONE}<br/>
            <strong>Category:</strong> ${category}<br/>
            <strong>Avg Precip:</strong> ${d3.format(".1f")(precip)} mm
        `);
            })
            .on("mousemove", event => {
                tooltip
                    .style("left", event.clientX + 12 + "px")
                    .style("top", event.clientY + 12 + "px");
            })
            .on("mouseleave", () => {
                tooltip
                    .style("opacity", 0)
                    .style("display", "none");
            });

    });
};

function drawAdventurePrecipLegend(svg, width) {
    const thresholds = [50, 100, 150, 200];
    const colors = ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1e3a8a"];
    const labels = [
        "Very Low (0–50 mm)",
        "Low (50–100 mm)",
        "Moderate (100–150 mm)",
        "High (150–200 mm)",
        "Very High (>200 mm)"
    ];

    const legend = svg.append("g")
        .attr("class", "adventure-precip-legend")
        .attr("transform", `translate(${width - 325}, 20)`);

    legend.append("text")
        .attr("x", 90)
        .attr("y", 18)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "700")
        .attr("fill", "#1e3a8a")
        .text("Avg Precipitation");

    labels.forEach((label, i) => {
        const row = legend.append("g")
            .attr("transform", `translate(10, ${30 + i * 20})`);

        row.append("rect")
            .attr("width", 14)
            .attr("height", 14)
            .attr("fill", colors[i])
            .attr("stroke", "#111");

        row.append("text")
            .attr("x", 20)
            .attr("y", 11)
            .attr("font-size", "11px")
            .text(label);
    });
}

