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
const headerTime = document.getElementById("headerTime");
const headerDate = document.getElementById("headerDate");

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
}

updateClock();
setInterval(updateClock, 1000);

const START_HOUR = 7; // 07:00
const END_HOUR = 19; // 19:00
const HOUR_HEIGHT = 60; // px per jam
const totalHours = END_HOUR - START_HOUR;

const colors = {
  "Work Shift": "bg-blue-500",
  Meeting: "bg-purple-500",
  Training: "bg-amber-500",
  Break: "bg-emerald-500",
};

const schedule = [
  { type: "Work Shift", start: "07:00", end: "09:00", label: "Morning Shift" },
  { type: "Meeting", start: "09:00", end: "10:00", label: "Team Standup" },
  {
    type: "Work Shift",
    start: "10:00",
    end: "12:00",
    label: "Production Line",
  },
  { type: "Break", start: "12:00", end: "13:00", label: "Lunch Break" },
  { type: "Training", start: "13:00", end: "15:00", label: "Safety Training" },
  {
    type: "Work Shift",
    start: "15:00",
    end: "17:00",
    label: "Afternoon Shift",
  },
  { type: "Meeting", start: "17:00", end: "17:30", label: "Shift Handover" },
  { type: "Work Shift", start: "17:30", end: "19:00", label: "Closing Shift" },
];

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const startMinutes = START_HOUR * 60;
const pxPerMinute = HOUR_HEIGHT / 60;

const timeline = document.getElementById("timeline");
timeline.style.height = `${totalHours * HOUR_HEIGHT}px`;

// Kolom garis jam + label
for (let h = START_HOUR; h <= END_HOUR; h++) {
  const top = (h - START_HOUR) * HOUR_HEIGHT;

  const label = document.createElement("div");
  label.className =
    "absolute left-0 -translate-y-1/2 text-xs text-slate-400 w-12";
  label.style.top = `${top}px`;
  label.textContent = `${String(h).padStart(2, "0")}:00`;
  timeline.appendChild(label);

  const line = document.createElement("div");
  line.className = "absolute left-14 right-0 border-t border-slate-100";
  line.style.top = `${top}px`;
  timeline.appendChild(line);
}

// Blok jadwal
schedule.forEach((item) => {
  const startPx = (timeToMinutes(item.start) - startMinutes) * pxPerMinute;
  const endPx = (timeToMinutes(item.end) - startMinutes) * pxPerMinute;
  const height = Math.max(endPx - startPx, 22);

  const block = document.createElement("div");
  block.className = `absolute left-14 right-0 rounded-lg px-3 py-1 text-white text-xs shadow-sm ${colors[item.type]}`;
  block.style.top = `${startPx}px`;
  block.style.height = `${height - 4}px`;

  block.innerHTML = `
      <p class="font-semibold leading-tight">${item.label}</p>
      <p class="opacity-80 leading-tight">${item.start} - ${item.end} · ${item.type}</p>
    `;

  timeline.appendChild(block);
});

// Schedule table
const scheduleRows = Array.from(document.querySelectorAll(".schedule-row"));

const scheduleType = document.getElementById("scheduleType");
const scheduleStatus = document.getElementById("scheduleStatus");

const schedulePrev = document.getElementById("schedulePrev");
const scheduleNext = document.getElementById("scheduleNext");

const schedulePage = document.getElementById("schedulePage");
const scheduleStart = document.getElementById("scheduleStart");
const scheduleEnd = document.getElementById("scheduleEnd");
const scheduleTotal = document.getElementById("scheduleTotal");

const scheduleEmpty = document.getElementById("scheduleEmpty");
const scheduleTableBody = document.getElementById("scheduleTableBody");

const SCHEDULES_PER_PAGE = 8;

let currentSchedulePage = 1;
let filteredSchedules = [...scheduleRows];

function filterSchedules() {
  const type = scheduleType.value;
  const status = scheduleStatus.value;

  filteredSchedules = scheduleRows.filter((row) => {
    const rowType = row.dataset.type;
    const rowStatus = row.dataset.status;

    const typeMatch = type === "all" || rowType === type;

    const statusMatch = status === "all" || rowStatus === status;

    return typeMatch && statusMatch;
  });

  currentSchedulePage = 1;

  renderSchedules();
}

function renderSchedules() {
  scheduleRows.forEach((row) => {
    row.classList.add("hidden");
  });

  const total = filteredSchedules.length;

  const totalPages = Math.max(1, Math.ceil(total / SCHEDULES_PER_PAGE));

  if (currentSchedulePage > totalPages) {
    currentSchedulePage = totalPages;
  }

  const startIndex = (currentSchedulePage - 1) * SCHEDULES_PER_PAGE;

  const endIndex = Math.min(startIndex + SCHEDULES_PER_PAGE, total);

  const visibleRows = filteredSchedules.slice(startIndex, endIndex);

  visibleRows.forEach((row) => {
    row.classList.remove("hidden");
  });

  // Empty state
  if (total === 0) {
    scheduleEmpty.classList.remove("hidden");
    scheduleTableBody.classList.add("hidden");
  } else {
    scheduleEmpty.classList.add("hidden");
    scheduleTableBody.classList.remove("hidden");
  }

  // Pagination information
  scheduleStart.textContent = total === 0 ? 0 : startIndex + 1;

  scheduleEnd.textContent = endIndex;

  scheduleTotal.textContent = total;

  schedulePage.textContent = currentSchedulePage;

  // Buttons
  schedulePrev.disabled = currentSchedulePage === 1;

  scheduleNext.disabled = currentSchedulePage >= totalPages;
}

scheduleType.addEventListener("change", filterSchedules);

scheduleStatus.addEventListener("change", filterSchedules);

schedulePrev.addEventListener("click", () => {
  if (currentSchedulePage > 1) {
    currentSchedulePage--;
    renderSchedules();
  }
});

scheduleNext.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredSchedules.length / SCHEDULES_PER_PAGE);

  if (currentSchedulePage < totalPages) {
    currentSchedulePage++;
    renderSchedules();
  }
});

// Initial render
renderSchedules();
