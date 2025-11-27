document.addEventListener("DOMContentLoaded", () => {
  const parallax = document.getElementById("parallax");
  const scrollContainer = document.querySelector(".scroll-container");

  let isSnapping = false;
  let snapTimeout;
  let ticking = false;

  const getScrollPercent = () =>
    scrollContainer.scrollTop /
    (scrollContainer.scrollHeight - scrollContainer.clientHeight || 1);

  const updateParallax = () => {
    const percent = getScrollPercent();
    const y = -200 + percent * 200; // Translate from -200vh to 0vh
    parallax.style.transform = `translateY(${y}vh)`;
  };

  document.body.style.height = "100vh";
  document.documentElement.style.height = "100vh";
  parallax.style.animation = "none";
  parallax.style.transform = "translateY(-200vh)";
  parallax.style.transition = "none";

  setTimeout(() => {
    parallax.style.transition = "transform 0.2s ease-out";
    updateParallax();
  }, 50);

  scrollContainer.addEventListener("scroll", () => {
    // Debounce snap timeout
    if (snapTimeout) clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      isSnapping = false;
      updateParallax();
    }, 300);

    // Throttle animation frame
    if (!ticking && !isSnapping) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener("resize", updateParallax);

  /* ---------- Ensure scroll starts at top ---------- */
  scrollContainer.scrollTop = 0;
});
