// paper-stars/script.js
// ------------------------------------------------------------------
// Handles parallax scrolling, section animations, and responsive layout
// ------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- DOM references ---------- */
  const parallax = document.getElementById("parallax"); // Parallax container
  const scrollContainer = document.querySelector(".scroll-container"); // Scrollable container
  const sections = document.querySelectorAll("section"); // All sections

  /* ---------- State variables ---------- */
  let isSnapping = false;
  let snapTimeout;
  let ticking = false;

  /* ---------- Helper functions ---------- */
  const getScrollPercent = () =>
    scrollContainer.scrollTop /
    (scrollContainer.scrollHeight - scrollContainer.clientHeight || 1);

  const updateParallax = () => {
    const percent = getScrollPercent();
    const y = -200 + percent * 200; // Translate from -200vh to 0vh
    parallax.style.transform = `translateY(${y}vh)`;
  };

  /* ---------- Initial layout ---------- */
  document.body.style.height = "100vh";
  document.documentElement.style.height = "100vh";
  parallax.style.animation = "none";
  parallax.style.transform = "translateY(-200vh)";
  parallax.style.transition = "none";

  /* ---------- Smooth transition after initial position ---------- */
  setTimeout(() => {
    parallax.style.transition = "transform 0.2s ease-out";
    updateParallax();
  }, 50);

  /* ---------- Scroll handling ---------- */
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

  /* ---------- Resize handling ---------- */
  window.addEventListener("resize", updateParallax);

  /* ---------- Ensure scroll starts at top ---------- */
  scrollContainer.scrollTop = 0;

  /* ---------- Intersection Observer for section animations ---------- */
  const observerOptions = {
    root: scrollContainer,
    rootMargin: "0px",
    threshold: 0.5, // Trigger when 50% of section is visible
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      const notes = entry.target.querySelectorAll(".note");
      notes.forEach((note) => {
        if (entry.isIntersecting) {
          note.classList.add("animate");
          note.classList.remove("animate-backward");
        } else {
          note.classList.add("animate-backward");
          note.classList.remove("animate");
        }
      });
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach((section) => observer.observe(section));
});
