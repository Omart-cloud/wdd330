function initMap() {
  const propertyLocation = { lat: 7.3775, lng: 3.9470 }; // Example: Ibadan

  const map = new google.maps.Map(document.getElementById("map"), {
    center: propertyLocation,
    zoom: 14,
  });

  new google.maps.Marker({
    position: propertyLocation,
    map,
    title: "Property Location",
  });
}
