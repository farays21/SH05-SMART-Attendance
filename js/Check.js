// Sidebar mobile
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");

function showSidebar() {
  sidebar?.classList.remove("-translate-x-full");
  sidebarOverlay?.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function hideSidebar() {
  sidebar?.classList.add("-translate-x-full");
  sidebarOverlay?.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

function handleResize() {
  if (window.innerWidth >= 768) {
    sidebarOverlay?.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    sidebar?.classList.remove("-translate-x-full");
  } else {
    sidebar?.classList.add("-translate-x-full");
  }
}

openSidebar?.addEventListener("click", showSidebar);
closeSidebar?.addEventListener("click", hideSidebar);
sidebarOverlay?.addEventListener("click", hideSidebar);
window.addEventListener("resize", handleResize);
handleResize();

// Attendance UI elements
const locationText = document.getElementById("locationText");
const locationAddress = document.getElementById("locationAddress");
const coordinates = document.getElementById("coordinates");
const refreshLocation = document.getElementById("refreshLocation");
const checkInBtn = document.getElementById("checkInBtn");
const checkOutBtn = document.getElementById("checkOutBtn");
const checkInTime = document.getElementById("checkInTime");
const checkOutTime = document.getElementById("checkOutTime");
const attendanceStatus = document.getElementById("attendanceStatus");
const cameraPreview = document.getElementById("cameraPreview");
const attendanceMap = document.getElementById("attendanceMap");
const headerTime = document.getElementById("headerTime");
const headerDate = document.getElementById("headerDate");
const heroTime = document.getElementById("heroTime");
const heroDay = document.getElementById("heroDay");
const heroDate = document.getElementById("heroDate");

let checkInTimestamp = null;
let checkOutTimestamp = null;

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function updateClock() {
  const now = new Date();
  const timeText = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const dayText = now.toLocaleDateString("en-US", { weekday: "long" });
  const dateText = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (headerTime) headerTime.textContent = timeText;
  if (headerDate) headerDate.textContent = dateText;
  if (heroTime) heroTime.textContent = timeText;
  if (heroDay) heroDay.textContent = dayText;
  if (heroDate) heroDate.textContent = dateText;
}

function updateAttendanceUI() {
  if (!checkInTimestamp && !checkOutTimestamp) {
    attendanceStatus.textContent = "Not Checked In";
    checkInTime.textContent = "--:--";
    checkOutTime.textContent = "--:--";
    checkInBtn.disabled = false;
    checkOutBtn.disabled = true;
  } else if (checkInTimestamp && !checkOutTimestamp) {
    attendanceStatus.textContent = "Checked In";
    checkInTime.textContent = formatTime(checkInTimestamp);
    checkOutTime.textContent = "--:--";
    checkInBtn.disabled = true;
    checkOutBtn.disabled = false;
  } else {
    attendanceStatus.textContent = "Checked Out";
    checkInTime.textContent = formatTime(checkInTimestamp);
    checkOutTime.textContent = formatTime(checkOutTimestamp);
    checkInBtn.disabled = true;
    checkOutBtn.disabled = true;
  }
}

async function getAddress(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }

    const data = await response.json();

    if (locationAddress) {
      locationAddress.textContent = data.display_name || "Address not found";
    }
  } catch (error) {
    console.error(error);

    if (locationAddress) {
      locationAddress.textContent = "Unable to retrieve address.";
    }
  }
}

async function setLocation(position) {
  const { latitude, longitude } = position.coords;

  locationText.textContent = "Current location detected";

  coordinates.innerHTML = `
    Latitude: ${latitude.toFixed(6)}<br>
    Longitude: ${longitude.toFixed(6)}
  `;

  if (attendanceMap) {
    attendanceMap.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
  }

  await getAddress(latitude, longitude);
}

function showLocationError() {
  locationText.textContent = "Location unavailable";

  if (locationAddress) {
    locationAddress.textContent = "Please allow location permission.";
  }

  coordinates.textContent = "Latitude: - | Longitude: -";
}

function requestLocation() {
  if (!navigator.geolocation) {
    showLocationError();
    return;
  }

  navigator.geolocation.getCurrentPosition(setLocation, showLocationError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  });
}

async function startCamera() {
  if (!cameraPreview || !navigator.mediaDevices?.getUserMedia) {
    locationText.textContent = "Camera unavailable";
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    cameraPreview.srcObject = stream;
  } catch (error) {
    console.error(error);
    locationText.textContent = "Unable to access the camera";
  }
}

checkInBtn?.addEventListener("click", () => {
  checkInTimestamp = new Date();
  checkOutTimestamp = null;
  updateAttendanceUI();
});

checkOutBtn?.addEventListener("click", () => {
  if (!checkInTimestamp) return;
  checkOutTimestamp = new Date();
  updateAttendanceUI();
});

refreshLocation?.addEventListener("click", requestLocation);

updateClock();
setInterval(updateClock, 1000);
updateAttendanceUI();
requestLocation();
startCamera();
