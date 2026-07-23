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
