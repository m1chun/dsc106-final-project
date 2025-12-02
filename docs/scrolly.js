const scroller = scrollama();

const visuals = document.querySelectorAll(".scrolly-vis");
const steps = document.querySelectorAll(".step");

function activateVis(index) {
  visuals.forEach(v => v.classList.remove("active"));
  if (visuals[index]) visuals[index].classList.add("active");
}

scroller
  .setup({
    step: ".step",
    offset: 0.6,
  })
  .onStepEnter(({ index, element }) => {

    // ✅ Activate correct visualization
    activateVis(index);

    // ✅ Handle single OR multi-region physio highlights
    const regionList = element.dataset.physio;

    if (regionList) {
      const regions = regionList.split(",").map(d => d.trim());

      document.dispatchEvent(
        new CustomEvent("physioStepEnter", {
          detail: { regions }
        })
      );
    }

  }); // ✅ ← THIS WAS MISSING

// ✅ Resize handler MUST be outside
window.addEventListener("resize", scroller.resize);
