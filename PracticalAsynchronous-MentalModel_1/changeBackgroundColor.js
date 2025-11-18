function changeBackgroundColor() {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
  ];
  let index = 0;

  setInterval(() => {
    document.body.style.backgroundColor = colors[index];
    index = (index + 1) % colors.length; // Cycle through colors
  }, 3000);
}

// Start the color changing
changeBackgroundColor();
