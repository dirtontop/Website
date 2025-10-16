// Button animation + placeholder action
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.style.transform = "scale(0.9)";
    setTimeout(() => (btn.style.transform = "scale(1)"), 150);
    alert("This would open the script or file page.");
  });
});
