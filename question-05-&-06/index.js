(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Get the paragraph container and add button.
    const container = document.getElementById("paragraph-container");
    const addButton = document.getElementById("add-paragraphs");

    if (!container || !addButton) return;

    // Save the original paragraphs as templates for new copies.
    const originalParagraphs = [...container.querySelectorAll(":scope > p")];
    let imagesHidden = false;

    // Create a button to hide or show image paragraphs.
    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = "Hide image paragraphs";
    addButton.after(toggleButton);

    function updateSeparators() {
      // Remove existing separators to prevent duplicates.
      container.querySelectorAll(":scope > hr").forEach((hr) => hr.remove());

      const paragraphs = [...container.querySelectorAll(":scope > p")];

      // Add a separator after every second paragraph, except the last.
      paragraphs.forEach((p, index) => {
        if ((index + 1) % 2 === 0 && index < paragraphs.length - 1) {
          p.after(document.createElement("hr"));
        }
      });
    }

    function logTestResults(action) {
      // Count paragraphs, separators, and hidden image paragraphs.
      const paragraphs = [...container.querySelectorAll(":scope > p")];
      const separators = container.querySelectorAll(":scope > hr").length;
      const hiddenImages = paragraphs.filter(
        (p) => p.querySelector("img") && p.hidden,
      ).length;

      // Display the latest test results in the browser console.
      console.clear();
      console.log("Action:", action);
      console.log("Total paragraphs:", paragraphs.length);
      console.log("Total separators:", separators);
      console.log("Hidden image paragraphs:", hiddenImages);
    }

    addButton.addEventListener("click", function () {
      // Clone the original paragraphs for each click.
      const copies = originalParagraphs.map((p) => p.cloneNode(true));

      // Randomize the order of the copied paragraphs.
      for (let i = copies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copies[i], copies[j]] = [copies[j], copies[i]];
      }

      // Preserve the current image visibility when adding copies.
      copies.forEach((p) => {
        if (p.querySelector("img")) {
          p.hidden = imagesHidden;
        }
        container.appendChild(p);
      });

      // Rebuild separators and log the updated results.
      updateSeparators();
      logTestResults("Clicked Hit me");
    });

    toggleButton.addEventListener("click", function () {
      // Toggle the visibility of all image paragraphs.
      imagesHidden = !imagesHidden;

      container.querySelectorAll(":scope > p").forEach((p) => {
        if (p.querySelector("img")) {
          p.hidden = imagesHidden;
        }
      });

      // Update the button label to match the current state.
      toggleButton.textContent = imagesHidden
        ? "Show image paragraphs"
        : "Hide image paragraphs";

      // Refresh separators and log the updated results.
      updateSeparators();
      logTestResults(
        imagesHidden ? "Hid image paragraphs" : "Showed image paragraphs",
      );
    });

    // Set up separators and log the initial page state.
    updateSeparators();
    logTestResults("Initial page load");
  });
})();
