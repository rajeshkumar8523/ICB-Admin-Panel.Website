const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');

function toggleSidebar() {
  sidebar.classList.toggle('expanded');
  toggleSidebarBtn.textContent = sidebar.classList.contains('expanded') ? '←' : '→';

  if (!sidebar.classList.contains('expanded')) {
    document.querySelectorAll('.submenu').forEach(submenu => submenu.classList.remove('active'));
  }
}

toggleSidebarBtn.addEventListener('click', toggleSidebar);

function toggleDropdown(submenuId, iconId) {
  if (!sidebar.classList.contains('expanded')) return;
  var submenu = document.getElementById(submenuId);
  var icon = document.getElementById(iconId);
  submenu.classList.toggle("active");
  icon.classList.toggle("rotated");
}



// Initialize the map
const map = L.map('map').setView([16.6989, 77.9405], 13); // Set initial coordinates and zoom level

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Array of bus locations with their coordinates and details
const busLocations = [
  { coords: [16.6989, 77.9405], busNumber: 1, location: 'JPNCE' },
  { coords: [16.7000, 77.9500], busNumber: 2, location: 'City Center' },
  { coords: [16.7100, 77.9600], busNumber: 3, location: 'Railway Station' },
  { coords: [16.7200, 77.9700], busNumber: 4, location: 'Bus Stand' },
  { coords: [16.7300, 77.9800], busNumber: 5, location: 'Airport' },
  { coords: [16.7400, 77.9900], busNumber: 6, location: 'Suburb Area' }
];

// Loop through the bus locations and add markers to the map
busLocations.forEach(bus => {
  L.marker(bus.coords).addTo(map)
    .bindPopup(`Bus No ${bus.busNumber} is in ${bus.location}`);
});