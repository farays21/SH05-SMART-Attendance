// ===============================
// Sidebar
// ===============================

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
    sidebar?.classList.remove("-translate-x-full");
    sidebarOverlay?.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    return;
  }

  sidebar?.classList.add("-translate-x-full");
}

openSidebar?.addEventListener("click", showSidebar);
closeSidebar?.addEventListener("click", hideSidebar);
sidebarOverlay?.addEventListener("click", hideSidebar);
window.addEventListener("resize", handleResize);

handleResize();

// ===============================
// Header Clock
// ===============================

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

  if (headerTime) {
    headerTime.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  if (headerDate) {
    headerDate.textContent = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}

updateClock();
setInterval(updateClock, 1000);

// ===============================
// Formatter
// ===============================

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// ===============================
// Upcoming Leave
// ===============================

const upcomingLeaves = [
  {
    title: "Annual Leave",
    start_date: "2026-08-12",
    end_date: "2026-08-16",
    duration: 5,
  },
  {
    title: "Family Leave",
    start_date: "2026-08-25",
    end_date: "2026-08-27",
    duration: 3,
  },
  {
    title: "Medical Leave",
    start_date: "2026-09-08",
    end_date: "2026-09-09",
    duration: 2,
  },
];

const list = document.getElementById("upcomingLeaveList");
const count = document.getElementById("upcomingLeaveCount");

count.textContent = `${upcomingLeaves.length} Leave${
  upcomingLeaves.length > 1 ? "s" : ""
}`;

list.innerHTML = upcomingLeaves
  .map(
    (leave) => `
      <div class="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h4 class="font-medium text-slate-800">${leave.title}</h4>
            <p class="mt-1 text-sm text-slate-500">
              ${formatter.format(new Date(leave.start_date))}
              –
              ${formatter.format(new Date(leave.end_date))}
            </p>
          </div>

          <span class="whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            ${leave.duration} Day${leave.duration > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    `,
  )
  .join("");

// ===============================
// Team Leave
// ===============================

const teamLeaves = [
  {
    name: "Khansa Putri",
    position: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/100?img=12",
    status: "Currently on Leave",
    startDate: "10 Aug 2026",
    endDate: "15 Aug 2026",
  },
  {
    name: "Ajib Pratama",
    position: "Frontend Developer",
    avatar: "https://i.pravatar.cc/100?img=33",
    status: "Upcoming Leave",
    startDate: "18 Aug 2026",
    endDate: "20 Aug 2026",
  },
  {
    name: "Zaki Ramadhan",
    position: "Backend Developer",
    avatar: "https://i.pravatar.cc/100?img=66",
    status: "Upcoming Leave",
    startDate: "25 Aug 2026",
    endDate: "29 Aug 2026",
  },
  {
    name: "Farrel Jhonathan",
    position: "QA Engineer",
    avatar: "https://i.pravatar.cc/100?img=3",
    status: "Currently on Leave",
    startDate: "12 Aug 2026",
    endDate: "14 Aug 2026",
  },
];

document.getElementById("teamLeaveCount").textContent =
  `${teamLeaves.length} Members`;

document.getElementById("teamLeaveList").innerHTML = teamLeaves
  .map(
    (member) => `
      <div class="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
        <div class="flex items-center gap-4">
          <img
            src="${member.avatar}"
            alt="${member.name}"
            class="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <h4 class="font-medium text-slate-800">${member.name}</h4>
            <p class="text-sm text-slate-500">${member.position}</p>
          </div>
        </div>

        <div class="text-right">
          <span
            class="inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              member.status === "Currently on Leave"
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
            }"
          >
            ${member.status}
          </span>

          <p class="mt-2 text-sm text-slate-500">
            ${member.startDate} – ${member.endDate}
          </p>
        </div>
      </div>
    `,
  )
  .join("");
