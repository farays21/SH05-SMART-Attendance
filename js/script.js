// =========================
// Sidebar Mobile
// =========================
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");

function showSidebar() {
  sidebar.classList.remove("-translate-x-full");
  sidebarOverlay.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function hideSidebar() {
  sidebar.classList.add("-translate-x-full");
  sidebarOverlay.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

openSidebar?.addEventListener("click", showSidebar);
closeSidebar?.addEventListener("click", hideSidebar);
sidebarOverlay?.addEventListener("click", hideSidebar);

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    sidebarOverlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    sidebar.classList.remove("-translate-x-full");
  } else {
    sidebar.classList.add("-translate-x-full");
  }
});

// =========================
// Attendance logic
// =========================
const locationText = document.getElementById("locationText");
const coordinates = document.getElementById("coordinates");
const refreshLocation = document.getElementById("refreshLocation");

const checkInBtn = document.getElementById("checkInBtn");
const checkOutBtn = document.getElementById("checkOutBtn");
const checkInTime = document.getElementById("checkInTime");
const checkOutTime = document.getElementById("checkOutTime");

// FIXED: matches the HTML id="workTimeToday"
const workTimeToday = document.getElementById("workTimeToday");

const workStatus = document.getElementById("workStatus");
const todayStatus = document.getElementById("todayStatus");
const attendanceBadge = document.getElementById("attendanceBadge");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");
const absenCount = document.getElementById("absenCount");
const attendancePercent = document.getElementById("attendancePercent");
const attendanceProgressText = document.getElementById(
  "attendanceProgressText",
);
const attendanceBar = document.getElementById("attendanceBar");

let checkInTimestamp = null;
let checkOutTimestamp = null;
let totalAbsent = 2;
let totalWorkingDays = 22;

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function updateAttendanceSummary() {
  const presentDays = totalWorkingDays - totalAbsent;
  const percent = ((presentDays / totalWorkingDays) * 100).toFixed(1);

  absenCount.textContent = totalAbsent;
  attendancePercent.textContent = `${percent}%`;
  attendanceProgressText.textContent = `${percent}%`;
  attendanceBar.style.width = `${percent}%`;
}

function updateWorkDuration() {
  if (!checkInTimestamp) {
    workTimeToday.textContent = "0h 0m";
    workStatus.textContent = "Not checked in yet";
    workStatus.className = "mt-2 text-sm text-slate-500";
    return;
  }

  const end = checkOutTimestamp || new Date();
  const diffMs = end - checkInTimestamp;
  const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  workTimeToday.textContent = `${hours}h ${minutes}m`;

  if (checkOutTimestamp) {
    workStatus.textContent = "Workday completed";
    workStatus.className = "mt-2 text-sm text-emerald-600";
  } else {
    workStatus.textContent = "Currently working";
    workStatus.className = "mt-2 text-sm text-amber-600";
  }
}

function updateAttendanceStatus() {
  if (!checkInTimestamp && !checkOutTimestamp) {
    todayStatus.textContent = "Not Checked In";
    attendanceBadge.textContent = "Waiting";
    attendanceBadge.className =
      "rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700";

    checkInBtn.disabled = false;
    checkOutBtn.disabled = true;
  } else if (checkInTimestamp && !checkOutTimestamp) {
    todayStatus.textContent = "Working";
    attendanceBadge.textContent = "On Site";
    attendanceBadge.className =
      "rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700";

    checkInBtn.disabled = true;
    checkOutBtn.disabled = false;
  } else {
    todayStatus.textContent = "Completed";
    attendanceBadge.textContent = "Completed";
    attendanceBadge.className =
      "rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700";

    checkInBtn.disabled = true;
    checkOutBtn.disabled = true;
  }
}

function setLocation(position) {
  const { latitude, longitude } = position.coords;
  locationText.textContent = "Attendance location detected";
  coordinates.textContent = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

function showLocationError() {
  locationText.textContent = "Location unavailable";
  coordinates.textContent =
    "Allow location access to see your current position";
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

checkInBtn.addEventListener("click", () => {
  const now = new Date();
  checkInTimestamp = now;
  checkInTime.textContent = formatTime(now);

  updateWorkDuration();
  updateAttendanceStatus();
});

checkOutBtn.addEventListener("click", () => {
  const now = new Date();
  checkOutTimestamp = now;
  checkOutTime.textContent = formatTime(now);

  updateWorkDuration();
  updateAttendanceStatus();
});

refreshLocation.addEventListener("click", requestLocation);

setInterval(() => {
  if (checkInTimestamp && !checkOutTimestamp) {
    updateWorkDuration();
  }
}, 60000);

function updateClock() {
  if (currentTime) {
    currentTime.textContent = formatTime(new Date());
  }
}

updateClock();
setInterval(updateClock, 1000);

currentDate.textContent = formatDate(new Date());
updateAttendanceSummary();
updateWorkDuration();
updateAttendanceStatus();
requestLocation();

// Weekly Attendance Chart =======================================

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("attendanceChart");
  if (!canvas) return;

  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const present = [1, 1, 1, 0, 1, 1, 0];
  const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const gridColor = isDark ? "#2c2c2a" : "#e1e0d9";
  const tickColor = "#898781";

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          data: present.map((v) => 1),
          backgroundColor: present.map((v) =>
            v === 1 ? "#0ca30c" : "#d03b3b",
          ),
          borderRadius: 6,
          maxBarThickness: 28,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => (present[ctx.dataIndex] === 1 ? "Hadir" : "Absen"),
          },
        },
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          max: 1.15,
        },
        x: {
          grid: { display: false },
          ticks: { color: tickColor, font: { size: 12 } },
        },
      },
    },
  });
});
