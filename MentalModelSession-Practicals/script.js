class ClickCounter {
  constructor() {
    this.count = 0;
    this.isProcessing = false;
    this.button = document.getElementById("clickButton");
    this.init();
  }

  init() {
    this.button.addEventListener("click", () => this.handleClick());
  }

  async handleClick() {
    // Ignore clicks while processing
    if (this.isProcessing) {
      console.log("Click ignored - still processing previous click");
      return;
    }

    // Immediately update UI state
    this.isProcessing = true;
    this.disableButton();
    this.showProcessing();

    try {
      // Simulate async operation (2 second delay)
      await this.delay(2000);

      // Update count and UI
      this.count++;
      this.updateButtonText();
    } catch (error) {
      console.error("Error during processing:", error);
    } finally {
      // Always re-enable button
      this.enableButton();
      this.isProcessing = false;
    }
  }

  disableButton() {
    this.button.disabled = true;
    this.button.classList.add("processing");
  }

  enableButton() {
    this.button.disabled = false;
    this.button.classList.remove("processing");
  }

  showProcessing() {
    this.button.textContent = "Processing...";
  }

  updateButtonText() {
    this.button.textContent = `Click me! Count: ${this.count}`;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Initialize the click counter when page loads
document.addEventListener("DOMContentLoaded", () => {
  new ClickCounter();
});
