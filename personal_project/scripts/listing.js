document.addEventListener("DOMContentLoaded", () => {
  const listingForm = document.getElementById("listingForm");
  const listingContainer = document.getElementById("listingContainer");
  const searchForm = document.getElementById("searchForm");

  let allListings = []; // store all listings for filtering

  // Load listings on page load
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

  // Fetch listings and store them for filtering
  async function fetchListings() {
    try {
      const res = await fetch("http://localhost:3000/api/listings");
      const listings = await res.json();
      allListings = listings;
      renderListings(allListings);
    } catch (err) {
      listingContainer.innerHTML = "<p>Error loading listings.</p>";
    }
  }

  // Render listings to the page
  function renderListings(listings) {
    listingContainer.innerHTML = "";

    if (listings.length === 0) {
      listingContainer.innerHTML = "<p>No listings found.</p>";
      return;
    }

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
  }

  // Search filter logic
  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("searchTitle").value.toLowerCase();
    const location = document.getElementById("searchLocation").value.toLowerCase();
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    const filtered = allListings.filter((listing) => {
      const matchesTitle = listing.title.toLowerCase().includes(title);
      const matchesLocation = listing.location.toLowerCase().includes(location);
      const matchesPrice = listing.price >= minPrice && listing.price <= maxPrice;
      return matchesTitle && matchesLocation && matchesPrice;
    });

    renderListings(filtered);
  });

  // Reset filters
  document.getElementById("resetFilter")?.addEventListener("click", () => {
    searchForm.reset();
    renderListings(allListings);
  });
});
