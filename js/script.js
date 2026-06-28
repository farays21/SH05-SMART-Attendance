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

currentDate.textContent = formatDate(new Date());
updateAttendanceSummary();
updateWorkDuration();
updateAttendanceStatus();
requestLocation();

const weeklyAttendanceCtx = document
  .getElementById("weeklyAttendanceChart")
  .getContext("2d");

// Weekly Attendance Chart =======================================

new Chart(weeklyAttendanceCtx, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Present",
        data: [1, 1, 1, 0, 1, 0, 0],
        backgroundColor: "#10b981",
        borderRadius: 10,
        barThickness: 19,
      },
      {
        label: "Absent",
        data: [0, 0, 0, 1, 0, 1, 1],
        backgroundColor: "#ef4444",
        borderRadius: 10,
        barThickness: 19,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: "#e2e8f0",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  },
});
