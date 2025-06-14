// scripts/listing.js

document.addEventListener("DOMContentLoaded", () => {
  const listingForm = document.getElementById("listingForm");
  const listingContainer = document.getElementById("listingContainer");

  // Load existing listings on page load
  fetchListings();

  // Handle listing form submission
  listingForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const images = document.getElementById("images").files;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("description", description);
    for (let img of images) {
      formData.append("images", img);
    }

    try {
      const response = await fetch("http://localhost:3000/api/listings", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Upload failed");

      alert("Listing added successfully!");
      listingForm.reset();
      fetchListings();
    } catch (err) {
      alert("Error: " + err.message);
    }
  });

  async function fetchListings() {
    try {
      const res = await fetch("http://localhost:3000/api/listings");
      const listings = await res.json();

      listingContainer.innerHTML = "";
      listings.forEach((listing) => {
        const div = document.createElement("div");
        div.className = "listing";
        div.innerHTML = `
          <h3>${listing.title}</h3>
          <p><strong>Location:</strong> ${listing.location}</p>
          <p><strong>Price:</strong> ₦${listing.price}</p>
          <p>${listing.description}</p>
          ${listing.images?.map(img => `<img src="${img}" alt="property" width="200">`).join("") || ""}
        `;
        listingContainer.appendChild(div);
      });
    } catch (err) {
      listingContainer.innerHTML = "<p>Error loading listings.</p>";
    }
  }
});
