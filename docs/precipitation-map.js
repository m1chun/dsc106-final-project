document.addEventListener("DOMContentLoaded", function () {
    (function () {

        // ================================
        // ✅ SVG SETUP (MATCH FIRE MAP)
        // ================================
        const width = 800;
        const height = 800;

        const margin = { top: 50, right: 20, bottom: 20, left: 20 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select("#precip-map")
            .attr("width", width)
            .attr("height", height);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // ✅ ONLY DEFINE THESE ONCE
        const projection = d3.geoIdentity().reflectY(true);
        const path = d3.geoPath(projection);

        // ================================
        // ✅ PRECIP COLOR SCALE
        // ================================
        const precipThresholds = [50, 100, 150, 200];
        const precipColors = ['#eff6ff', '#bfdbfe', '#60a5fa', '#2563eb', '#1e3a8a'];
        const precipLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

        const precipColorScale = d3.scaleThreshold()
            .domain(precipThresholds)
            .range(precipColors);


        // ================================
        // ✅ LEGEND
        // ================================
        function drawLegend() {

            const legendData = [];

            legendData.push({
                color: precipColors[0],
                label: precipLabels[0],
                range: `0 – ${precipThresholds[0]} mm`
            });

            for (let i = 0; i < precipThresholds.length - 1; i++) {
                legendData.push({
                    color: precipColors[i + 1],
                    label: precipLabels[i + 1],
                    range: `${precipThresholds[i]} – ${precipThresholds[i + 1]} mm`
                });
            }

            legendData.push({
                color: precipColors[precipColors.length - 1],
                label: precipLabels[precipLabels.length - 1],
                range: `> ${precipThresholds[precipThresholds.length - 1]} mm`
            });

            const legend = svg.append("g")
                .attr("transform", `translate(${width - 400}, 40)`);

            legend.append("text")
                .attr("x", 110)
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .attr("font-weight", "800")
                .attr("font-size", "16px")
                .attr("fill", "#1e3a8a")
                .text("Avg Precipitation");

            const items = legend.selectAll(".legend-item")
                .data(legendData)
                .enter()
                .append("g")
                .attr("transform", (d, i) => `translate(20, ${40 + i * 24})`);

            items.append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("rx", 4)
                .attr("fill", d => d.color)
                .attr("stroke", "#111");

            items.append("text")
                .attr("x", 30)
                .attr("y", 14)
                .style("font-size", "13px")
                .text(d => `${d.label}: ${d.range}`);
        }


        // ================================
        // ✅ TOOLTIP
        // ================================
        let tooltip = d3.select(".tooltip");
        if (tooltip.empty()) {
            tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip");
        }

        // ================================
        // ✅ LOAD + DRAW MAP
        // ================================
        d3.json("final_combined_data.geojson").then(data => {

            // ✅ FIT GEOJSON TO SVG CORRECTLY
            projection.fitSize(
                [innerWidth * 0.92, innerHeight * 0.92],
                data
            );

            g.selectAll("path")
                .data(data.features)
                .join("path")
                .attr("d", path)
                .attr("fill", d => precipColorScale(d.properties.Weighted_Avg_Precipitation ?? 0))
                .attr("stroke", "#334155")
                .attr("stroke-width", 1.3)
                .style("cursor", "pointer")

                // ✅ TOOLTIP
                .on("mouseenter", (event, d) => {
                    tooltip
                        .style("display", "block")
                        .style("opacity", 1)
                        .html(`
              <strong>Seed Zone:</strong> ${d.properties.SEED_ZONE}<br/>
              <strong>Region:</strong> ${d.properties.physio_region}<br/>
              <strong>Avg Precip:</strong> ${d3.format(".1f")(d.properties.Weighted_Avg_Precipitation)} mm
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

            // ✅ SEED ZONE LABELS
            g.selectAll("text.zone-label")
                .data(data.features)
                .join("text")
                .attr("class", "zone-label")
                .attr("x", d => path.centroid(d)[0])
                .attr("y", d => path.centroid(d)[1])
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .style("font-size", "10px")
                .style("font-weight", "900")
                .style("fill", "#111")
                .style("stroke", "white")
                .style("stroke-width", 4)
                .style("paint-order", "stroke")
                .text(d => d.properties.SEED_ZONE);

            drawLegend();
        });

    })();
});

window.drawAdventurePrecipView = function (regionKey) {
    const svg = d3.select("#map-precip");
    if (svg.empty()) return;

    svg.selectAll("*").remove();

    const container = svg.node().parentElement;
    const width = container.clientWidth;
    const height = 420;

    svg.attr("width", width).attr("height", height);

    const g = svg.append("g")
        .attr("transform", "translate(0, 50)");

    const projection = d3.geoIdentity().reflectY(true);
    const path = d3.geoPath(projection);

    // ✅ 5-BIN PRECIP SCALE
    const precipScale = d3.scaleThreshold()
        .domain([50, 100, 150, 200])
        .range(["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1e3a8a"]);

    const precipLabels = [
        "Very Low (0–50 mm)",
        "Low (50–100 mm)",
        "Moderate (100–150 mm)",
        "High (150–200 mm)",
        "Very High (200+ mm)"
    ];

    // ✅ TOOLTIP
    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
    }

    d3.json("final_combined_data.geojson").then(data => {
        const topOffset = 60;   // how far down the map is shifted
        const bottomPadding = 20;

        projection.fitSize(
            [width, height - topOffset - bottomPadding],
            data
        );

        g.selectAll("path")
            .data(data.features)
            .join("path")
            .attr("d", path)
            .attr("fill", d => precipScale(d.properties.Weighted_Avg_Precipitation ?? 0))
            .attr("stroke", "#334155")
            .attr("stroke-width", 1.1)
            .style("cursor", "pointer")

            // ✅ ✅ TOOLTIP EVENTS
            .on("mouseenter", (event, d) => {
                const val = d.properties.Weighted_Avg_Precipitation ?? 0;

                tooltip
                    .style("display", "block")
                    .style("opacity", 1)
                    .html(`
            <strong>Seed Zone:</strong> ${d.properties.SEED_ZONE}<br/>
            <strong>Region:</strong> ${d.properties.physio_region}<br/>
            <strong>Avg Precip:</strong> ${d3.format(".1f")(val)} mm
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

        // ✅ ✅ DISCRETE LEGEND (5 BINS)
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 240}, 60)`);

        legend.append("text")
            .attr("x", 0)
            .attr("y", -6)
            .attr("font-size", "15px")
            .attr("font-weight", "800")
            .text("Avg Precipitation");

        const legendItem = legend.selectAll(".legend-item")
            .data(precipScale.range())
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(0, ${i * 22})`);

        legendItem.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", d => d)
            .attr("stroke", "#111");

        legendItem.append("text")
            .attr("x", 26)
            .attr("y", 13)
            .style("font-size", "13px")
            .text((d, i) => precipLabels[i]);
    });
};

