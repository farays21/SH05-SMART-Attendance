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

const ctx = document.getElementById("activityTrendChart");

function Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "1 Jul",
      "2 Jul",
      "3 Jul",
      "4 Jul",
      "5 Jul",
      "6 Jul",
      "7 Jul",
      "8 Jul",
      "9 Jul",
      "10 Jul",
      "11 Jul",
      "12 Jul",
      "13 Jul",
      "14 Jul",
    ],
    datasets: [
      {
        label: "Check In",
        backgroundColor: "#22c55e",
        data: [18, 20, 21, 19, 20, 22, 18, 21, 20, 19, 21, 18, 20, 22],
      },
      {
        label: "Check Out",
        backgroundColor: "#6366f1",
        data: [18, 19, 20, 18, 20, 21, 18, 20, 19, 18, 20, 17, 19, 21],
      },
      {
        label: "Break",
        backgroundColor: "#f59e0b",
        data: [8, 7, 9, 8, 7, 8, 7, 8, 9, 8, 8, 7, 8, 8],
      },
      {
        label: "Other",
        backgroundColor: "#a855f7",
        data: [2, 3, 2, 2, 4, 3, 2, 3, 2, 2, 3, 2, 3, 2],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  },
});

const searchPermission = document.getElementById("searchPermission");
const filterType = document.getElementById("filterType");
const filterStatus = document.getElementById("filterStatus");
const filterMonth = document.getElementById("filterMonth");
const resetFilter = document.getElementById("resetFilter");

resetFilter.addEventListener("click", () => {
  searchPermission.value = "";
  filterType.selectedIndex = 0;
  filterStatus.selectedIndex = 0;
  filterMonth.selectedIndex = 0;

  // Jalankan ulang filter jika ada fungsi filtering
  filterLeaves();
});

const rowsPerPage = 8;
const tbody = document.querySelector("tbody");
const rows = [...tbody.querySelectorAll("tr")];

const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageIndicator = document.getElementById("pageIndicator");

const startItem = document.getElementById("startItem");
const endItem = document.getElementById("endItem");
const totalItems = document.getElementById("totalItems");

let currentPage = 1;

function renderTable() {
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  rows.forEach((row, index) => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    row.classList.toggle("hidden", !(index >= start && index < end));
  });

  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, rows.length);

  startItem.textContent = rows.length ? start : 0;
  endItem.textContent = end;
  totalItems.textContent = rows.length;

  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

renderTable();
