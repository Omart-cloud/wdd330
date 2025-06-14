// scripts/save.js

document.addEventListener("DOMContentLoaded", () => {
  const savedContainer = document.getElementById("savedListings");
  const saved = JSON.parse(localStorage.getItem("savedListings")) || [];

  if (saved.length === 0) {
    savedContainer.innerHTML = "<p>No saved listings yet.</p>";
    return;
  }

  saved.forEach((listing) => {
    const div = document.createElement("div");
    div.className = "listing";
    div.innerHTML = `
      <h3>${listing.title}</h3>
      <p><strong>Location:</strong> ${listing.location}</p>
      <p><strong>Price:</strong> ₦${listing.price}</p>
      <p>${listing.description}</p>
      ${listing.images?.map(img => `<img src="${img}" alt="property" width="200">`).join("") || ""}
    `;
    savedContainer.appendChild(div);
  });
});
