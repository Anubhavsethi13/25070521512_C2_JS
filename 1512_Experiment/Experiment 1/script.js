console.log("External JS file has successfully loaded!");

const userData = {
  name: "Anubhav",
  email: "aanubhav@123gmail.com",
  age: 22,
};
// Toast Notification Function
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  let icon = "🔔";
  if (type === "success") icon = "✨";
  if (type === "error") icon = "❌";
  if (type === "warning") icon = "⚠️";
  if (type === "info") icon = "ℹ️";
  toast.innerHTML = `
    <div class="toast-content-wrapper">
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message.replace(/\n/g, "<br>")}</span>
    </div>
    <div class="toast-progress"></div>
  `;
  container.appendChild(toast);
  // Trigger CSS animations
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);
  // Automatically remove toast
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, 4000);
}
// When the page finishes loading, display the user info table in the console and trigger a toast
window.onload = function () {
  console.log("User Information Table:");
  // Display data as a table in the browser console (Console Method 2)
  console.table(userData);
  // Pop up toast welcome message
  showToast("Welcome back, Anubhav! 🌟", "success");
};
// Handle External Button Click
document.getElementById("btn-external").addEventListener("click", function () {
  console.log("External JS: Button clicked!");
  showToast("Hello from External JS!\nUser Name: " + userData.name, "success");
});
