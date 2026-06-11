// Script to change the theme of the website
let colorMode = "dark"; // Default is now dark to match portfolio

function changeColorMode() {
    const body = document.getElementById("body");
    const btnColor = document.getElementById("btnColor");

    if (colorMode === "light") {
        body.setAttribute("data-bs-theme", "dark");
        btnColor.innerHTML = '<i class="bi bi-sun-fill me-2"></i>Light Mode';
        colorMode = "dark";
    } else {
        body.setAttribute("data-bs-theme", "light");
        btnColor.innerHTML = '<i class="bi bi-moon-fill me-2"></i>Dark Mode';
        colorMode = "light";
    }
}