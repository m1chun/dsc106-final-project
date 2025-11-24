(function() {

// =====================================================
// =============== Seed Zones Visualization ============
// =====================================================

const width = 400;
const height = 400;

// Margins for titles + spacing
const margin = { top: 50, right: 20, bottom: 20, left: 20 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Projection for California
const projection = d3.geoAlbers()
  .center([1, 36])
  .rotate([120.5, 0])
  .parallels([34, 40.5])
  .scale(2050)              
  .translate([
    innerWidth / 2,
    innerHeight / 2 + 20   
  ]);

const path = d3.geoPath().projection(projection);

// Tooltip
const tooltip = d3.select("body").append("div").attr("class", "tooltip");

// Label style
function addLabels(g, data) {
  g.selectAll("text.zone-label")
    .data(data.features)
    .join("text")
      .attr("class", "zone-label")
      .attr("x", d => path.centroid(d)[0])
      .attr("y", d => path.centroid(d)[1])
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("paint-order", "stroke")
      .text(d => d.properties.SEED_ZONE);
}

// -----------------
// MAP 1 — Single color
// -----------------
const svg1 = d3.select("#map1")
  .attr("width", width)
  .attr("height", height);

svg1.append("rect")
  .attr("x", 0).attr("y", 0)
  .attr("width", width).attr("height", height)
  .attr("fill", "none")
  .attr("stroke", "#333")
  .attr("stroke-width", 2);

const g1 = svg1.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("ca-seed-zones.geojson").then(data => {
  g1.selectAll("path")
    .data(data.features)
    .join("path")
      .attr("d", path)
      .attr("fill", "#cce5ff")
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`Seed Zone: ${d.properties.SEED_ZONE}<br>Subzone: ${d.properties.SUBZONE}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", event.pageX + 5 + "px")
               .style("top", event.pageY + 5 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"));

  addLabels(g1, data);
});

// -----------------
// MAP 2 — Colored by SUBZONE
// -----------------
const svg2 = d3.select("#map2")
  .attr("width", width)
  .attr("height", height);

svg2.append("rect")
  .attr("x", 0).attr("y", 0)
  .attr("width", width).attr("height", height)
  .attr("fill", "none")
  .attr("stroke", "#333")
  .attr("stroke-width", 2);

const g2 = svg2.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json("ca-seed-zones.geojson").then(data => {
  g2.selectAll("path")
    .data(data.features)
    .join("path")
      .attr("d", path)
      .attr("fill", d => color(d.properties.SUBZONE))
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`Seed Zone: ${d.properties.SEED_ZONE}<br>Subzone: ${d.properties.SUBZONE}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", event.pageX + 5 + "px")
               .style("top", event.pageY + 5 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"));

  addLabels(g2, data);
});

})(); // END IIFE
