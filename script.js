function copyScript() {
  const text = document.getElementById("scriptBox").innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Script copied!");
  });
}

function buy() {
  window.location.href = "https://discord.gg/YOURSERVER";
}
