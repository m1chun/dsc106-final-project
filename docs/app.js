// =========================================
// 🩹 AUTO-RELOAD ONE TIME (GitHub Pages fix)
// =========================================
if (!sessionStorage.getItem("pageReloaded")) {
  sessionStorage.setItem("pageReloaded", "true");
  window.location.reload();
}

window.hardResetAdventureState = function () {

  console.log("🔥 HARD RESET ADVENTURE");

  // ✅ KILL SCROLLAMA
  if (window.adventureScroller) {
    window.adventureScroller.destroy();
    window.adventureScroller = null;
  }

  // ✅ FORCE ADVENTURE SCROLL TO TOP
  const adventure = document.getElementById("region-adventure");
  if (adventure) {
    adventure.scrollTop = 0;
  }

  // ✅ RESET ACTIVE REGION LOCKS
  window.activeFireRegion = null;
  window.currentRegionDisplayName = null;

  // ✅ CLEAR ALL ADVENTURE VISUALS
  d3.select("#adventure-map").interrupt().selectAll("*").remove();
  d3.select("#adventure-fire-chart").interrupt().selectAll("*").remove();
  d3.select("#adventure-veg-chart").interrupt().selectAll("*").remove();

  // ✅ HIDE ALL ADVENTURE VIEWS
  document.querySelectorAll(".adventure-view")
    .forEach(v => v.classList.add("hidden"));
};

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

      // ✅✅✅ FULL HARD RESET FIRST (THIS WAS MISSING)
      window.hardResetAdventureState();

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

      const displayName = displayMap[region];
      window.currentRegionDisplayName = displayName;

      // ✅ Draw fresh map
      drawAdventurePhysioMap(displayName);

      // ✅ Start fresh scroll
      initAdventureScroll(region);

      // ✅ Set new text content
      document.getElementById("adventure-title").textContent = data.title;
      document.getElementById("adventure-description").textContent = data.description;
      document.getElementById("adventure-fire").textContent = data.fire;
      document.getElementById("adventure-veg").textContent = data.veg;
      document.getElementById("adventure-precip").textContent = data.precip;
      document.getElementById("adventure-overview-image").src = data.image;
      renderRegionVegetationInfo(region);
    });
  });

  // ============================
  // ✅ EXIT ADVENTURE → BACK (FULL RESET)
  // ============================
  exitBtn?.addEventListener("click", () => {
    location.reload();
  });

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

        if (stepType === "precip") {
          document.getElementById("adventure-view-precip")
            .classList.remove("hidden");

          drawAdventurePrecipMap(regionKey);
        }

        if (stepType === "veg") {
          document.getElementById("adventure-view-veg")
            .classList.remove("hidden");

          renderRegionVegetationInfo(regionKey); // ✅ ADD THIS
          drawAdventureVegView(regionKey);   // ⭐ ADD THIS LINE

        }

        if (stepType === "case") {
          document.getElementById("adventure-view-case").classList.remove("hidden");
          drawAdventureCaseStudy(regionKey);
        }

      });

    window.addEventListener("resize", scroller.resize);
  }
});

function renderRegionVegetationInfo(regionKey) {
  const box = document.getElementById("adventure-veg-info");
  if (!box) return;

  box.innerHTML = "";

  const data = window.regionData?.[regionKey];
  if (!data || !data.vegDetails) return;

  data.vegDetails.forEach(item => {
    // ✅ Title Line (e.g. "Oaks: Fire-Resistant")
    const title = document.createElement("h4");
    title.textContent = `${item.name}: ${item.label}`;
    box.appendChild(title);

    // ✅ Bullet List (ANY number of bullets works)
    const ul = document.createElement("ul");

    item.bullets.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
    });

    box.appendChild(ul);
  });
}

window.drawAdventureVegView = function (regionKey) {

  const view = document.getElementById("adventure-view-veg");
  if (!view) return;

  const imageBox = document.getElementById("adventure-veg-images");
  const textBox = document.getElementById("adventure-veg-chart");

  if (!imageBox || !textBox) {
    console.warn("⚠️ Veg view containers missing in HTML");
    return;
  }

  // ✅ Clear previous content
  imageBox.innerHTML = "";
  textBox.innerHTML = "";

  const data = window.regionData?.[regionKey];
  if (!data) {
    console.warn("⚠️ No region veg data found for:", regionKey);
    return;
  }

  // ================================
  // ✅ LEFT COLUMN — IMAGES + CAPTIONS VEG
  // ================================
  const vegImages = data.vegImages || [];

  vegImages.forEach(obj => {
    const figure = document.createElement("figure");
    figure.className = "veg-figure";

    const img = document.createElement("img");
    img.src = obj.src;
    img.alt = obj.caption || "Vegetation image";

    const caption = document.createElement("figcaption");
    caption.textContent = obj.caption || "";

    figure.appendChild(img);
    if (obj.caption) figure.appendChild(caption);

    imageBox.appendChild(figure);
  });

  // ================================
  // ✅ RIGHT COLUMN — TEXT VEG
  // ================================
  if (data.vegDetails) {
    const { resistantTitle, resistant, flammableTitle, flammable } = data.vegDetails;

    // ✅ Resistant Section
    if (resistantTitle) {
      const h3 = document.createElement("h3");
      h3.textContent = resistantTitle;
      textBox.appendChild(h3);
    }

    if (Array.isArray(resistant)) {
      const ul = document.createElement("ul");
      resistant.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      textBox.appendChild(ul);
    }

    // ✅ Flammable Section
    if (flammableTitle) {
      const h3 = document.createElement("h3");
      h3.style.marginTop = "14px";
      h3.textContent = flammableTitle;
      textBox.appendChild(h3);
    }

    if (Array.isArray(flammable)) {
      const ul = document.createElement("ul");
      flammable.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      textBox.appendChild(ul);
    }
  }
};


// ================================
// // ✅ CASE STUDY FIRES
// ================================
window.caseStudyFires = {
  "north-coast-redwood": "August Complex (2020)",
  "central-coast": "Dolan Fire (2020)",
  "north-coast-interior": "Carr Fire (2018)",
  "west-slope-sierra": "Dixie Fire (2021)",
  "east-slope-sierra": "North Complex Fire (2020)",
  "great-basin": "No Notable Fires",
  "central-valley": "Grant Line Fire (2020)",
  "socal-desert": "El Dorado Fire (2020)",
  "socal-mountains": "Sand Fire (2016)"
};

window.drawAdventureCaseStudy = function (regionKey) {

  const region = window.regionData?.[regionKey];
  const cs = region?.caseStudy;

  if (!cs) {
    console.warn("⚠️ No case study object for:", regionKey);
    return;
  }

  // ======================================================
  // 1️⃣  LEFT PANEL TITLE + SUMMARY
  // ======================================================
  const fireName = window.caseStudyFires[regionKey] || "Case Study Fire";

  document.getElementById("adventure-case-title").textContent =
    `Case Study: ${fireName}`;

  const summaryBox = document.getElementById("adventure-case-summary");
  summaryBox.innerHTML = "";


  // Optional description text
  if (cs.description) {
    summaryBox.innerHTML += `<p>${cs.description}</p>`;
  }

  // ======================================================
  // 2️⃣  LEFT PANEL — KEY POINTS + STATS
  // ======================================================
  const infoBox = document.getElementById("adventure-case-info");
  infoBox.innerHTML = "";

  // ---- Key Points ----
  if (cs.keyPoints?.length > 0) {
    infoBox.innerHTML += `<h4>Key Points</h4>`;
    const ul = document.createElement("ul");
    cs.keyPoints.forEach(pt => {
      const li = document.createElement("li");
      li.textContent = pt;
      ul.appendChild(li);
    });
    infoBox.appendChild(ul);
  }

  // ---- Stats ----
  if (cs.statsTitle) {
    infoBox.innerHTML += `<h4>${cs.statsTitle}</h4>`;
  }

  if (cs.stats?.length > 0) {
    const ul = document.createElement("ul");
    cs.stats.forEach(st => {
      const li = document.createElement("li");
      li.textContent = st;
      ul.appendChild(li);
    });
    infoBox.appendChild(ul);
  }

  // ======================================================
  // 3️⃣  RIGHT PANEL — IMAGES ONLY
  // ======================================================
  const imgBox = document.getElementById("adventure-case-images");
  imgBox.innerHTML = "";

  cs.images?.forEach(img => {
    const fig = document.createElement("figure");
    fig.className = "veg-figure";

    fig.innerHTML = `
      <img src="${img.src}" alt="${img.caption}">
      <figcaption>${img.caption}</figcaption>
    `;

    imgBox.appendChild(fig);
  });
};
