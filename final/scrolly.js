document.addEventListener("DOMContentLoaded", () => {

  const scroller = scrollama();
  const visuals = document.querySelectorAll(".scrolly-vis");
  const steps = document.querySelectorAll(".step");

  // Safety check
  if (visuals.length !== steps.length) {
    console.warn(
      `⚠️ Mismatch: ${steps.length} steps but ${visuals.length} visuals`
    );
  }

  function activateVis(index) {
    visuals.forEach(v => v.classList.remove("active"));
    if (visuals[index]) {
      visuals[index].classList.add("active");
    }
  }

  scroller
    .setup({
      step: ".step",
      offset: 0.6
    })
    .onStepEnter(({ index }) => {
      activateVis(index);
    });

  window.addEventListener("resize", scroller.resize);

});
