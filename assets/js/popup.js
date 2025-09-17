window.addEventListener("DOMContentLoaded", () => {
  handlePopup();
});

function handlePopup() {
  const popups = document.querySelectorAll(".popup");

  popups.forEach((popup) => {
    popup.addEventListener("click", (event) => {
      if (event.target === popup) {
        popup.classList.remove("active");
        document.documentElement.classList.remove("scroll-lock");
        
        if (popup.querySelector("form")) {
          popup.querySelector("form").reset();
        }
      }
    });

    const closeButton = popup.querySelector(".popup__close");
    closeButton.addEventListener("click", () => {
      popup.classList.remove("active");
      document.documentElement.classList.remove("scroll-lock");

      if (popup.querySelector("form")) {
          popup.querySelector("form").reset();
        }
    });

    const openButton = popup.dataset.toggle;

    document.querySelectorAll("[data-popup='" + openButton + "']").forEach((button) => {
      button.addEventListener("click", () => {
        popup.classList.add("active");
        document.documentElement.classList.add("scroll-lock");
      });
    });
  });
}
