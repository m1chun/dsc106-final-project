(function() {
  // --- Setup ---
  const width = 960;
  const height = 800;

  const svg = d3.select("#map")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const tooltip = d3.select("#tooltip");

  // Projection & path
  const projection = d3.geoAlbers()
    .center([0, 37.5])
    .rotate([120, 0])
    .parallels([34, 40.5])
    .scale(2800)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  // Zoom behavior
  const g = svg.append("g");

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom);

  // --- Load GeoJSON ---
  d3.json("rare-vegetation.geojson").then(data => {
    g.selectAll("path")
      .data(data.features)
      .join("path")
      .attr("d", path)
      .attr("class", d => d.properties.RareVeg ? "polygon rare" : "polygon")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 0.9)
          .html(`
            <strong>Eco Section:</strong> ${d.properties.Eco_Name}<br/>
            <strong>County:</strong> ${d.properties.County}<br/>
            <strong>Rare Vegetation:</strong> ${d.properties.RareVeg_types || "None"}<br/>
            <strong>Area:</strong> ${Math.round(d.properties.Shape__Area).toLocaleString()} m²
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  });

})();
