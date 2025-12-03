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

      initAdventureMap(region);

      document.getElementById("adventure-title").textContent = data.title;
      document.getElementById("adventure-description").textContent = data.description;
      document.getElementById("adventure-fire").textContent = data.fire;
      document.getElementById("adventure-veg").textContent = data.veg;
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

// ============================
// ✅ ADVENTURE MAP PLACEHOLDER
// ============================
window.initAdventureMap = function(regionKey) {
  const svg = d3.select("#adventure-map");
  svg.selectAll("*").remove();

  const width = svg.node().clientWidth || 600;
  const height = svg.node().clientHeight || 600;

  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#f1f5f9");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "22px")
    .attr("font-weight", "700")
    .attr("fill", "#0f172a")
    .text(`Exploring ${regionKey.replaceAll("-", " ")}`);
};
