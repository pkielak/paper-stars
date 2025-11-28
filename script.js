AOS.init();

window.onscroll = function (e) {
  const rocketElement = document.querySelector(".rocket");

  if (this.oldScroll > this.scrollY) {
    !rocketElement.classList.contains("rotate") &&
      rocketElement.classList.add("rotate");
  } else {
    rocketElement.classList.remove("rotate");
  }

  this.oldScroll = this.scrollY;
};
