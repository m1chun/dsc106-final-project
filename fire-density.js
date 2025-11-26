document.addEventListener("DOMContentLoaded", function () {

    // --- COLOR SCALES ---
    const densityThresholds = [0.00005, 0.0005, 0.005, 0.015];
    const densityColors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#990000']; 
    const densityLabels = ['Very Low', 'Low', 'Medium', 'High', 'Extreme'];

    const densityColorScale = d3.scaleThreshold()
        .domain(densityThresholds)
        .range(densityColors);

    // --- LEGEND ---
    function renderLegend() {
        const legendContainer = d3.select("#color-legend").html("");
        const legendData = [];

        legendData.push({
            color: densityColors[0],
            label: densityLabels[0],
            range: `0 - ${d3.format(".5f")(densityThresholds[0])}`
        });

        for (let i = 0; i < densityThresholds.length - 1; i++) {
            legendData.push({
                color: densityColors[i + 1],
                label: densityLabels[i + 1],
                range: `${d3.format(".5f")(densityThresholds[i])} - ${d3.format(".5f")(densityThresholds[i + 1])}`
            });
        }

        legendData.push({
            color: densityColors[densityColors.length - 1],
            label: densityLabels[densityLabels.length - 1],
            range: `> ${d3.format(".5f")(densityThresholds[densityThresholds.length - 1])}`
        });

        legendContainer.selectAll(".legend-item")
            .data(legendData)
            .enter().append("div")
            .attr("class", "legend-item")
            .html(d => `
                <div class="legend-color" style="background-color: ${d.color};"></div>
                <div>
                    <span class="font-medium text-gray-800">${d.label}</span><br>
                    <span class="text-xs text-gray-500">${d.range}</span>
                </div>
            `);
    }

    // --- MAP RENDERING ---
    function renderMap(data) {
        const container = document.getElementById("map-container");
        const width = container.clientWidth;
        const height = width * 0.75;

        d3.select("#fire-map").selectAll("*").remove();

        const svg = d3.select("#fire-map")
            .attr("viewBox", `0 0 ${width} ${height}`);

        const projection = d3.geoMercator().fitSize([width, height], data);
        const path = d3.geoPath().projection(projection);

        const mapGroup = svg.append("g");
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        mapGroup.selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "region")
            .attr("fill", d => densityColorScale(d.properties.fire_density ?? 0))
            .style("stroke", "#333")
            .on("mouseover", (event, d) => {
                const density = d.properties.fire_density;
                const densityColor = densityColorScale(density);
                const densityCategory = densityLabels[densityColors.indexOf(densityColor)];

                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`
                    <strong>Zone:</strong> ${d.properties.SEED_ZONE}<br/>
                    <strong>Category:</strong> ${densityCategory}<br/>
                    <strong>Fires:</strong> ${d.properties.fire_count}<br/>
                    <strong>Raw Density: </strong> ${d3.format(".6f")(density)}<br/>
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(300).style("opacity", 0);
            });

        mapGroup.selectAll(".zone-label")
            .data(data.features)
            .enter()
            .append("text")
            .attr("class", "zone-label")
            .attr("transform", d => `translate(${path.centroid(d)})`)
            .attr("dy", "0.35em")
            .text(d => d.properties.SEED_ZONE);

        renderLegend();
    }

    // --- LOAD GEOJSON ---
    const GEOJSON_URL = "fire_density_map.geojson";

    function loadAndRenderMap() {
        d3.json(GEOJSON_URL)
            .then(data => renderMap(data))
            .catch(err => console.error("GeoJSON load error:", err));
    }

    loadAndRenderMap();
    window.addEventListener("resize", loadAndRenderMap);

});
