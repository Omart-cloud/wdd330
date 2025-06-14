// scripts/allmap.js

async function initMap() {
  const defaultCenter = { lat: 7.3775, lng: 3.9470 }; // Fallback center (Ibadan)
  const map = new google.maps.Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 7,
  });

  try {
    const res = await fetch("http://localhost:3000/api/listings");
    const listings = await res.json();

    listings.forEach((listing) => {
      if (!listing.latitude || !listing.longitude) return;

      const marker = new google.maps.Marker({
        position: { lat: listing.latitude, lng: listing.longitude },
        map,
        title: listing.title,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <strong>${listing.title}</strong><br>
          ₦${listing.price}<br>
          <a href="property.html?lat=${listing.latitude}&lng=${listing.longitude}" target="_blank">View</a>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  } catch (err) {
    console.error("Failed to load listings:", err);
  }
}
