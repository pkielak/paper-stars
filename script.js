document.addEventListener("DOMContentLoaded", function () {
  const parallax = document.getElementById("parallax");
  const scrollContainer = document.querySelector(".scroll-container");
  const sections = document.querySelectorAll("section");
  let isSnapping = false;
  let snapTimeout;

  // Make sure body and html are proper height
  document.body.style.height = "100vh";
  document.documentElement.style.height = "100vh";

  // Disable CSS animation completely so JavaScript takes over
  parallax.style.animation = "none";

  // Initial position - start with parallax above viewport
  parallax.style.transform = "translateY(-200vh)";
  parallax.style.transition = "none"; // Disable transition initially

  // Function to update parallax position
  function updateStarsPosition() {
    // Calculate scroll percentage (0 to 1)
    const scrollPercent =
      scrollContainer.scrollTop /
      (scrollContainer.scrollHeight - scrollContainer.clientHeight || 1);

    // Map to position (-200vh to 0vh)
    const position = -200 + scrollPercent * 200;

    // Apply transform
    parallax.style.transform = `translateY(${position}vh)`;
  }

  // Function to handle scroll snap finishing
  function onSnapFinish() {
    isSnapping = false;
    updateStarsPosition(); // Ensure parallax is correctly positioned after snap
  }

  // Enable smooth transitions after initial position is set
  setTimeout(function () {
    parallax.style.transition = "transform 0.2s ease-out";
    updateStarsPosition(); // Set initial position based on scroll
  }, 50);

  // Throttle scroll events for better performance
  let ticking = false;
  scrollContainer.addEventListener("scroll", function () {
    // Clear previous snap timeout if exists
    if (snapTimeout) {
      clearTimeout(snapTimeout);
    }

    // Set a new timeout for snap finishing
    snapTimeout = setTimeout(onSnapFinish, 300);

    if (!ticking && !isSnapping) {
      window.requestAnimationFrame(function () {
        updateStarsPosition();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Update on resize too
  window.addEventListener("resize", updateStarsPosition);

  // Ensure initial scroll is at the top
  scrollContainer.scrollTop = 0;

  // Handle scroll snap events
  scrollContainer.addEventListener("scrollend", function () {
    isSnapping = false;
    updateStarsPosition();
  });

  // Intersection Observer to trigger animation when section is visible
  const observerOptions = {
    root: scrollContainer,
    rootMargin: "0px",
    threshold: 0.5, // Trigger when 50% of the section is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      const notes = entry.target.querySelectorAll(".note");
      if (entry.isIntersecting) {
        notes.forEach((note) => {
          note.classList.add("animate");
          note.classList.remove("animate-backward");
        });
      } else {
        notes.forEach((note) => {
          note.classList.add("animate-backward");
          note.classList.remove("animate");
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    observer.observe(section);
  });
});
