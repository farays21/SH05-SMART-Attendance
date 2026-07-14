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
const checkInStatus = document.getElementById("checkInStatus");
const checkOutStatus = document.getElementById("checkOutStatus");
const cameraPreview = document.getElementById("cameraPreview");
const cameraOverlay = document.getElementById("cameraOverlay");
const attendanceMap = document.getElementById("attendanceMap");
const toggleCameraBtn = document.getElementById("toggleCameraBtn");
const headerTime = document.getElementById("headerTime");
const headerDate = document.getElementById("headerDate");
const heroTime = document.getElementById("heroTime");
const heroDay = document.getElementById("heroDay");
const heroDate = document.getElementById("heroDate");

let stream = null;
let checkedIn = false;
let checkedOut = false;

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

function setLocation(position) {
  const { latitude, longitude } = position.coords;

  if (locationText) {
    locationText.textContent = "Current location detected";
  }

  if (coordinates) {
    coordinates.innerHTML = `Latitude: ${latitude.toFixed(6)}<br>Longitude: ${longitude.toFixed(6)}`;
  }

  if (attendanceMap) {
    attendanceMap.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
  }

  getAddress(latitude, longitude);
}

function showLocationError() {
  if (locationText) {
    locationText.textContent = "Location unavailable";
  }

  if (locationAddress) {
    locationAddress.textContent = "Please allow location permission.";
  }

  if (coordinates) {
    coordinates.textContent = "Latitude: - | Longitude: -";
  }
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
    if (locationText) {
      locationText.textContent = "Camera unavailable";
    }
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    if (cameraPreview) {
      cameraPreview.srcObject = stream;
      cameraPreview.classList.remove("hidden");
    }

    if (cameraOverlay) {
      cameraOverlay.classList.add("hidden");
    }

    if (toggleCameraBtn) {
      toggleCameraBtn.textContent = "Turn Camera Off";
    }
  } catch (error) {
    console.error(error);
    if (locationText) {
      locationText.textContent = "Unable to access the camera";
    }
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  if (cameraPreview) {
    cameraPreview.srcObject = null;
    cameraPreview.classList.add("hidden");
  }

  if (cameraOverlay) {
    cameraOverlay.classList.remove("hidden");
  }

  if (toggleCameraBtn) {
    toggleCameraBtn.textContent = "Turn Camera On";
  }
}

checkInBtn?.addEventListener("click", () => {
  if (checkedIn) return;

  checkedIn = true;
  checkedOut = false;

  checkInBtn.disabled = true;
  checkInBtn.classList.remove("bg-emerald-600", "hover:bg-emerald-700");
  checkInBtn.classList.add("bg-slate-300", "cursor-not-allowed");

  if (checkInStatus) {
    checkInStatus.textContent = "Status: Checked In";
    checkInStatus.className = "text-center text-xs text-emerald-600";
  }

  if (checkOutBtn) {
    checkOutBtn.disabled = false;
    checkOutBtn.classList.remove("bg-slate-300", "cursor-not-allowed");
    checkOutBtn.classList.add("bg-rose-600", "hover:bg-rose-700");
  }

  if (checkOutStatus) {
    checkOutStatus.textContent = "Status: Ready";
    checkOutStatus.className = "text-center text-xs text-slate-500";
  }
});

checkOutBtn?.addEventListener("click", () => {
  if (!checkedIn || checkedOut) return;

  checkedOut = true;

  checkOutBtn.disabled = true;
  checkOutBtn.classList.remove("bg-rose-600", "hover:bg-rose-700");
  checkOutBtn.classList.add("bg-slate-300", "cursor-not-allowed");

  if (checkOutStatus) {
    checkOutStatus.textContent = "Status: Completed";
    checkOutStatus.className = "text-center text-xs text-emerald-600";
  }
});

toggleCameraBtn?.addEventListener("click", () => {
  if (stream) {
    stopCamera();
  } else {
    startCamera();
  }
});

refreshLocation?.addEventListener("click", requestLocation);

updateClock();
setInterval(updateClock, 1000);
requestLocation();
