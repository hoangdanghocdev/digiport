/* =========================================
   1. GLOBAL CONFIG
   ========================================= */
const ADMIN_USER = "hoangfnee";
const ADMIN_PASS = "Ho@ng2310";
let cysTypeNew = "inday";
let currentFolder = "Pending";

/* =========================================
   DATABASE MANAGER (LOCAL STORAGE WRAPPER)
   ========================================= */

const DB = {
  // --- CORE FUNCTIONS ---
  get: (table) => {
    const data = localStorage.getItem(table);
    return data ? JSON.parse(data) : [];
  },

  set: (table, data) => {
    localStorage.setItem(table, JSON.stringify(data));
  },

  add: (table, item) => {
    const data = DB.get(table);
    data.push(item);
    DB.set(table, data);
    return data;
  },

  remove: (table, id) => {
    let data = DB.get(table);
    data = data.filter((item) => item.id !== id);
    DB.set(table, data);
    return data;
  },

  update: (table, id, updates) => {
    let data = DB.get(table);
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      DB.set(table, data);
    }
    return data;
  },

  // --- SPECIFIC TABLES HELPERS ---

  // 1. REQUESTS (Booking)
  Requests: {
    getAll: () => DB.get("requests"),
    add: (req) =>
      DB.add("requests", { ...req, id: Date.now(), status: "Pending" }),
    setStatus: (id, status) => DB.update("requests", id, { status: status }),
    countByStatus: (status) =>
      DB.get("requests").filter((r) => r.status === status).length,
  },

  // 2. BUSY SLOTS (Schedule)
  BusySlots: {
    getAll: () => DB.get("busySlots"),
    add: (slot) => DB.add("busySlots", { ...slot, id: Date.now() }),
    remove: (id) => DB.remove("busySlots", id),
    // Hàm kiểm tra trùng lịch (Overlap Check)
    checkConflict: (reqStart, reqEnd) => {
      const slots = DB.get("busySlots");
      return slots.find((s) => {
        let bStart, bEnd;
        if (s.mode === "time" || (!s.mode && s.date)) {
          bStart = new Date(`${s.date}T${s.start}`);
          bEnd = new Date(`${s.date}T${s.end}`);
        } else {
          bStart = new Date(`${s.startDate}T00:00`);
          bEnd = new Date(`${s.endDate}T23:59`);
        }
        return reqStart < bEnd && bStart < reqEnd;
      });
    },
  },

  // 3. GEMS (Favorite Places)
  Gems: {
    getAll: () => DB.get("myGems"),
    add: (gem) => DB.add("myGems", { ...gem, id: Date.now() }),
    remove: (id) => DB.remove("myGems", id),
  },

  // 4. POSTS (Feed)
  Posts: {
    getAll: () => DB.get("dumpPosts"),
    add: (post) =>
      DB.add("dumpPosts", {
        ...post,
        id: Date.now(),
        likes: 0,
        timestamp: new Date(),
      }),
    remove: (id) => DB.remove("dumpPosts", id),
    like: (id) => {
      const posts = DB.get("dumpPosts");
      const p = posts.find((x) => x.id === id);
      if (p) {
        p.likes++;
        DB.set("dumpPosts", posts);
      }
    },
  },
};

/* =========================================
   2. INITIALIZATION (KHI WEB LOAD)
   ========================================= */
window.addEventListener("load", () => {
  if (typeof lucide !== "undefined") lucide.createIcons();

  // Setup ngày giờ
  setupRealTimeDatesNew();

  // QUAN TRỌNG: Check login để quyết định hiện Admin Panel hay không
  checkLoginState();

  // Load dữ liệu khác
  renderGems();
  loadPosts();
  loadPortfolioContent();
});

/* =========================================
   3. AUTHENTICATION (XỬ LÝ ĐĂNG NHẬP)
   ========================================= */
function checkLoginState() {
  const isAuth = localStorage.getItem("isAdmin") === "true";

  // A. Xử lý trang Sign In (Ẩn form -> Hiện Dashboard)
  const loginCard = document.getElementById("loginFormCard");
  const dashboard = document.getElementById("adminDashboard");
  if (loginCard) loginCard.className = isAuth ? "hidden" : "signin-wrapper";
  if (dashboard)
    dashboard.className = isAuth ? "dashboard-container" : "hidden";

  const authBtn = document.getElementById("authBtn");
  if (authBtn) authBtn.textContent = isAuth ? "Admin" : "Sign In";

  // B. XỬ LÝ ADMIN PANEL Ở TRANG CYS (QUAN TRỌNG NHẤT)
  const cysPanel = document.getElementById("cysAdminPanel");
  if (cysPanel) {
    if (isAuth) {
      cysPanel.classList.remove("hidden"); // Hiện bảng quản lý 2 cột
      renderBusyList(); // Load danh sách chặn
      renderAdminRequests("Pending"); // Load danh sách đơn
    } else {
      cysPanel.classList.add("hidden"); // Ẩn nếu là khách
    }
  }

  // C. Các công cụ Admin khác
  ["portfolioTools", "adminPostBox", "adminGemTool"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden", !isAuth);
  });

  // D. Cho phép sửa text Portfolio
  document
    .querySelectorAll(".editable")
    .forEach((el) => (el.contentEditable = isAuth));
}

function attemptLogin() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem("isAdmin", "true");
    alert("Login Successful! Welcome Admin.");
    location.reload();
  } else {
    alert("Wrong credentials!");
  }
}

function handleAuthClick() {
  const isAuth = localStorage.getItem("isAdmin") === "true";
  if (isAuth) {
    if (confirm("Logout?")) {
      localStorage.removeItem("isAdmin");
      location.reload();
    }
  } else {
    showPage("signin");
  }
}

/* =========================================
   4. ADMIN PANEL LOGIC (GRID 2 CỘT MỚI)
   ========================================= */

// --- CỘT TRÁI: BLOCK TIME MANAGER ---

// Chuyển đổi giữa Chặn Giờ (Time) và Chặn Ngày (Range)
function toggleBlockMode() {
  const modeEl = document.querySelector('input[name="blockMode"]:checked');
  if (!modeEl) return;
  const mode = modeEl.value;

  const dateInput = document.getElementById("dateInputGroup");
  const rangeInput = document.getElementById("rangeInputGroup");
  const timeInput = document.getElementById("timeInputGroup");

  if (mode === "time") {
    dateInput.classList.remove("hidden");
    timeInput.classList.remove("hidden");
    rangeInput.classList.add("hidden");
  } else {
    dateInput.classList.add("hidden");
    timeInput.classList.add("hidden");
    rangeInput.classList.remove("hidden");
  }
}

function adminAddBusySlot() {
  const mode = document.querySelector('input[name="blockMode"]:checked').value;
  const reason = document.getElementById("adminBlockReason").value || "Busy";
  let slot = { id: Date.now(), reason: reason, mode: mode };

  if (mode === "time") {
    // Logic chặn giờ
    const d = document.getElementById("adminBlockDate").value;
    const s = document.getElementById("adminBlockStart").value;
    const e = document.getElementById("adminBlockEnd").value;
    if (!d || !s || !e) return alert("Please fill Date, Start and End time.");
    slot.date = d;
    slot.start = s;
    slot.end = e;
  } else {
    // Logic chặn nhiều ngày
    const d1 = document.getElementById("adminBlockFrom").value;
    const d2 = document.getElementById("adminBlockTo").value;
    if (!d1 || !d2) return alert("Please select date range.");
    if (d2 < d1) return alert("End Date cannot be before Start Date.");
    slot.startDate = d1;
    slot.endDate = d2;
  }

  // Code MỚI (Dùng DB):
  DB.BusySlots.add(slot);

  alert("Blocked Successfully!");
  renderBusyList();
}

// function renderBusyList() {
//   const list = document.getElementById("busyList");
//   if (!list) return;
//   const slots = JSON.parse(localStorage.getItem("busySlots")) || [];

//   if (slots.length === 0) {
//     list.innerHTML = `<li style="text-align:center;color:#999;font-size:0.8rem">No blocked slots.</li>`;
//     return;
//   }

//   list.innerHTML = slots
//     .map((s) => {
//       // Hiển thị khác nhau tùy loại chặn
//       let info =
//         s.mode === "date"
//           ? `<span class="tag tag-date">RANGE</span> ${s.startDate} ➝ ${s.endDate}`
//           : `<span class="tag tag-time">TIME</span> ${s.date} (${s.start}-${s.end})`;

//       return `
//             <li>
//                 <div style="flex:1">
//                     <div style="font-weight:600;">${info}</div>
//                     <div style="color:#666; font-size:0.75rem;">Reason: ${s.reason}</div>
//                 </div>
//                 <span onclick="removeBusy(${s.id})" style="color:var(--red); cursor:pointer; font-weight:bold; font-size:1.1rem;">&times;</span>
//             </li>
//         `;
//     })
//     .join("");
// }
function renderBusyList() {
  const list = document.getElementById("busyList");
  if (!list) return;
  const slots = DB.BusySlots.getAll();

  if (slots.length === 0) {
    list.innerHTML = `<li style="text-align:center;color:#999;font-size:0.8rem">No blocked slots.</li>`;
    return;
  }

  list.innerHTML = slots
    .map((s) => {
      // Hiển thị khác nhau tùy loại chặn
      let info =
        s.mode === "date"
          ? `<span class="tag tag-date">RANGE</span> ${s.startDate} ➝ ${s.endDate}`
          : `<span class="tag tag-time">TIME</span> ${s.date} (${formatTime24(s.start)}-${formatTime24(s.end)})`;

      return `
            <li>
                <div style="flex:1">
                    <div style="font-weight:600;">${info}</div>
                    <div style="color:#666; font-size:0.75rem;">Reason: ${s.reason}</div>
                </div>
                <span onclick="removeBusy(${s.id})" style="color:var(--red); cursor:pointer; font-weight:bold; font-size:1.1rem;">&times;</span>
            </li>
        `;
    })
    .join("");
}

function removeBusy(id) {
  if (!confirm("Unblock this slot?")) return;
  DB.BusySlots.remove(id);
  renderBusyList();
}

// --- CỘT PHẢI: REQUEST MANAGER ---

function renderAdminRequests(folder) {
  currentFolder = folder;
  const list = DB.Requests.getAll();

  // Update Tabs UI
  ["Pending", "Approved", "Denied"].forEach((t) => {
    document.getElementById(`tab${t}`).className =
      t === folder ? "tab-sm active" : "tab-sm";
  });

  // Update Header Stats
  if (document.getElementById("statPending"))
    document.getElementById("statPending").innerText = list.filter(
      (r) => r.status === "Pending"
    ).length;
  if (document.getElementById("statApproved"))
    document.getElementById("statApproved").innerText = list.filter(
      (r) => r.status === "Approved"
    ).length;

  const filtered = list.filter((r) => r.status === folder);
  const container = document.getElementById("adminRequestList");
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#94A3B8; padding:30px; font-size:0.85rem;">No ${folder} requests found.</div>`;
    return;
  }

  container.innerHTML = filtered
    .map(
      (r) => `
        <div class="req-compact-item">
            <div class="req-main">
                <div class="req-name-row">${r.name}</div>
                <div class="req-meta-row">
                    <span class="badge-time">${r.date}</span>
                    let timeDisplay = r.time;
                    if (timeDisplay !== "All Day" && timeDisplay.includes(' - ')) {
                      const [start, end] = timeDisplay.split(" - ");
                      timeDisplay = `${formatTime24(start)} - ${formatTime24(end)}`;
                    }
                    <span>${timeDisplay}</span>
                </div>
                <span class="req-reason">"${r.reason}" • 📞 ${r.phone}</span>
                ${
                  r.location
                    ? `<a href="${r.location}" target="_blank" style="font-size:0.75rem; color:var(--accent); text-decoration:none;">📍 Map Link</a>`
                    : ""
                }
            </div>
            
            <div class="req-actions-col">
                ${
                  folder === "Pending"
                    ? `
                    <button onclick="processRequest(${r.id}, 'Approved')" class="btn-icon btn-ok" title="Approve"><i data-lucide="check" style="width:16px"></i></button>
                    <button onclick="processRequest(${r.id}, 'Denied')" class="btn-icon btn-no" title="Deny"><i data-lucide="x" style="width:16px"></i></button>
                `
                    : `<span style="font-size:0.7rem; font-weight:bold; color:${
                        folder === "Approved" ? "green" : "red"
                      }">${folder}</span>`
                }
            </div>
        </div>
    `
    )
    .join("");

  if (typeof lucide !== "undefined") lucide.createIcons();
}

// function processRequest(id, newStatus) {
//   const list = JSON.parse(localStorage.getItem("requests")) || [];
//   const item = list.find((r) => r.id === id);
//   if (item) {
//     item.status = newStatus;
//     localStorage.setItem("requests", JSON.stringify(list));
//     renderAdminRequests(currentFolder);
//   }
// }
function processRequest(id, newStatus) {
  // Cập nhật trạng thái
  DB.Requests.setStatus(id, newStatus);

  // Refresh giao diện
  renderAdminRequests(currentFolder);

  // Nếu Approve -> Tự động thêm vào lịch bận
  if (newStatus === "Approved") {
    const item = DB.Requests.getAll().find((r) => r.id === id);
    let start = "00:00",
      end = "23:59";
    if (item.time && item.time.includes("-")) {
      const p = item.time.split("-");
      start = p[0].trim();
      end = p[1].trim();
    }
    // Thêm vào bảng BusySlots
    DB.BusySlots.add({
      date: item.date,
      start: start,
      end: end,
      reason: `Booked: ${item.name}`,
      mode: "time",
    });
  }
}
/* =========================================
   5. GUEST VIEW LOGIC (CYS)
   ========================================= */
function checkAvailabilityNew() {
  // Reset UI
  document.getElementById("availabilityResultNew").classList.add("hidden");
  document.getElementById("bookingFormNew").classList.add("hidden");
  document.getElementById("invalidTimeBoxNew").classList.add("hidden");

  const nowVN = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const todayZero = new Date(nowVN);
  todayZero.setHours(0, 0, 0, 0);

  let reqStart,
    reqEnd,
    isValid = true,
    errorMsg = "";

  // A. Lấy dữ liệu Input Khách
  if (cysTypeNew === "inday") {
    const dVal = document.getElementById("checkDateNew").value;
    const tS = document.getElementById("startTimeNew").value;
    const tE = document.getElementById("endTimeNew").value;

    if (!dVal || !tS || !tE) return;

    reqStart = new Date(`${dVal}T${tS}`);
    reqEnd = new Date(`${dVal}T${tE}`);

    // Validation ngày quá khứ
    const dObj = new Date(dVal);
    dObj.setHours(0, 0, 0, 0);
    if (dObj < todayZero) {
      isValid = false;
      errorMsg = "Cannot choose a past date.";
    } else if (dObj.getTime() === todayZero.getTime() && reqStart < nowVN) {
      isValid = false;
      errorMsg = "Time has passed.";
    }
    if (reqEnd <= reqStart) {
      isValid = false;
      errorMsg = "End time must be after Start time.";
    }
  } else {
    // Multi-day
    const d1 = document.getElementById("startDateNew").value;
    const d2 = document.getElementById("endDateNew").value;
    if (!d1 || !d2) return;

    reqStart = new Date(`${d1}T00:00`);
    reqEnd = new Date(`${d2}T23:59`);

    if (new Date(d1) < todayZero) {
      isValid = false;
      errorMsg = "Start date is in the past.";
    }
    if (new Date(d2) <= new Date(d1)) {
      isValid = false;
      errorMsg = "End date must be after Start date.";
    }
  }

  if (!isValid) {
    document.getElementById("invalidTimeBoxNew").classList.remove("hidden");
    document.getElementById(
      "invalidTimeBoxNew"
    ).innerHTML = `<div style="color:#DC2626"><i data-lucide="alert-circle" style="width:20px"></i></div><div><h4>INVALID</h4><p>${errorMsg}</p></div>`;
    lucide.createIcons();
    return;
  }

  // B. Check Trùng Lịch (Overlap Algorithm)
  const busySlots = DB.BusySlots.getAll();
  let conflict = null;

  for (let s of busySlots) {
    let bStart, bEnd;
    if (s.mode === "time" || (!s.mode && s.date)) {
      // Admin chặn theo giờ
      bStart = new Date(`${s.date}T${s.start}`);
      bEnd = new Date(`${s.date}T${s.end}`);
    } else {
      // Admin chặn theo ngày
      bStart = new Date(`${s.startDate}T00:00`);
      bEnd = new Date(`${s.endDate}T23:59`);
    }

    // Nếu khoảng thời gian giao nhau
    if (reqStart < bEnd && bStart < reqEnd) {
      conflict = s;
      break;
    }
  }

  // C. Hiển thị kết quả
  const resBox = document.getElementById("availabilityResultNew");
  resBox.classList.remove("hidden");

  if (conflict) {
    resBox.className = "status-box-new status-busy-new";
    resBox.innerHTML = `
            <div style="color:#DC2626"><i data-lucide="lock" style="width:24px"></i></div>
            <div class="status-content-new" style="color:#B91C1C">
                <h4>UNAVAILABLE</h4>
                <p>Admin busy: <strong>${conflict.reason}</strong></p>
            </div>`;
  } else {
    resBox.className = "status-box-new status-available-new";
    resBox.innerHTML = `
            <div style="color:#059669"><i data-lucide="check-circle" style="width:24px"></i></div>
            <div class="status-content-new" style="color:#047857">
                <h4>AVAILABLE</h4>
                <p>Schedule is clear. Proceed below.</p>
            </div>`;
    document.getElementById("bookingFormNew").classList.remove("hidden");
    setupReasonOptionsNew();
  }
  lucide.createIcons();
}

// function submitBookingNew(e) {
//   e.preventDefault();
//   const req = {
//     id: Date.now(),
//     name: document.getElementById("bookNameNew").value,
//     phone: document.getElementById("bookPhoneNew").value,
//     platform: document.getElementById("contactPlatformNew").value,
//     reason: document.getElementById("reasonSelectNew").value,
//     location: document.getElementById("locationLinkNew").value,
//     date:
//       cysTypeNew === "inday"
//         ? document.getElementById("checkDateNew").value
//         : `${document.getElementById("startDateNew").value} to ${
//             document.getElementById("endDateNew").value
//           }`,
//     time:
//       cysTypeNew === "inday"
//         ? `${document.getElementById("startTimeNew").value} - ${
//             document.getElementById("endTimeNew").value
//           }`
//         : "All Day",
//     status: "Pending",
//   };

//   const list = JSON.parse(localStorage.getItem("requests")) || [];
//   list.push(req);
//   localStorage.setItem("requests", JSON.stringify(list));

//   alert("✅ Sent! Waiting for Admin approval.");
//   e.target.reset();
//   setCysTypeNew(cysTypeNew);

//   // Nếu đang là Admin thì cập nhật list ngay
//   if (localStorage.getItem("isAdmin") === "true")
//     renderAdminRequests("Pending");
// }
function submitBookingNew(e) {
  e.preventDefault();
  const req = {
    id: Date.now(),
    name: document.getElementById("bookNameNew").value,
    phone: document.getElementById("bookPhoneNew").value,
    platform: document.getElementById("contactPlatformNew").value,
    reason: document.getElementById("reasonSelectNew").value,
    location: document.getElementById("locationLinkNew").value,
    date:
      cysTypeNew === "inday"
        ? document.getElementById("checkDateNew").value
        : `${document.getElementById("startDateNew").value} to ${
            document.getElementById("endDateNew").value
          }`,
    time:
      cysTypeNew === "inday"
        ? `${document.getElementById("startTimeNew").value} - ${
            document.getElementById("endTimeNew").value
          }`
        : "All Day",
    status: "Pending",
  };

  DB.Requests.add(req);

  alert("✅ Sent! Waiting for Admin approval.");
  e.target.reset();
  setCysTypeNew(cysTypeNew);

  // Nếu đang là Admin thì cập nhật list ngay
  if (localStorage.getItem("isAdmin") === "true")
    renderAdminRequests("Pending");
}

/* =========================================
   6. HELPER FUNCTIONS
   ========================================= */
function formatTime24(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  const [hour, minute] = timeStr.split(':');
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

function setupRealTimeDatesNew() {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const today = d.toISOString().split("T")[0];

  [
    "checkDateNew",
    "startDateNew",
    "endDateNew",
    "adminBlockDate",
    "adminBlockFrom",
    "adminBlockTo",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = today;
      el.min = today;
    }
  });

  const h = String(d.getHours()).padStart(2, "0");
  const nh = String((d.getHours() + 1) % 24).padStart(2, "0");

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  setVal("startTimeNew", `${h}:00`);
  setVal("adminBlockStart", `${h}:00`);
  setVal("endTimeNew", `${nh}:00`);
  setVal("adminBlockEnd", `${nh}:00`);
}

function setCysTypeNew(t) {
  cysTypeNew = t;
  document.getElementById("btnIndayNew").className =
    t === "inday" ? "cys-tab active" : "cys-tab";
  document.getElementById("btnMultiNew").className =
    t === "multiday" ? "cys-tab active" : "cys-tab";
  document.getElementById("indayInputNew").className =
    t === "inday" ? "" : "hidden";
  document.getElementById("multiInputNew").className =
    t === "multiday" ? "" : "hidden";
  document.getElementById("bookingFormNew").classList.add("hidden");
  document.getElementById("availabilityResultNew").classList.add("hidden");
}

function setupReasonOptionsNew() {
  const s = document.getElementById("reasonSelectNew");
  s.innerHTML = '<option value="" disabled selected>Select Reason...</option>';
  const o =
    cysTypeNew === "inday"
      ? ["Work Interview", "Sports", "Cafe", "Hangout", "Other"]
      : ["Business Trip", "Vacation", "Other"];
  o.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.innerText = v;
    s.appendChild(opt);
  });
}

function showPage(pageId) {
  document.querySelectorAll(".page-section").forEach((sec) => {
    sec.classList.remove("active");
    sec.classList.add("hidden");
  });
  document.getElementById(pageId).classList.remove("hidden");
  document.getElementById(pageId).classList.add("active");

  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  const map = { portfolio: 0, dump: 1, gems: 2, cys: 3 };
  const btns = document.querySelectorAll(".nav-btn");
  if (btns[map[pageId]]) btns[map[pageId]].classList.add("active");
}

// Giữ lại các hàm cũ cho Gems và Dump nếu cần
function renderGems(filter = "all") {
  const list = DB.Gems.getAll();
  const grid = document.getElementById("gemsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const isAuth = localStorage.getItem("isAdmin") === "true";
  list.forEach((g) => {
    if (filter === "all" || g.type === filter) {
      grid.innerHTML += `<div class="gem-card"><div style="height:120px;background:#eee;margin-bottom:10px;display:flex;align-items:center;justify-content:center;">IMG</div><h4>${
        g.name
      }</h4><p>${g.desc}</p>${
        isAuth
          ? `<button onclick="delGem(${g.id})" style="color:red;border:none;background:none;cursor:pointer;">Delete</button>`
          : ""
      }</div>`;
    }
  });
}
function addGem() {
  const n = document.getElementById("gemName").value;
  if (!n) return;
  DB.Gems.add({
    name: n,
    type: document.getElementById("gemType").value,
    desc: document.getElementById("gemDesc").value,
  });
  renderGems();
}
function delGem(id) {
  DB.Gems.remove(id);
  renderGems();
}
function filterGems(t) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  event.target.classList.add("active");
  renderGems(t);
}
function loadPosts() {} // Placeholder
function createPost() {} // Placeholder
function savePortfolioContent() {
  const d = {};
  document
    .querySelectorAll(".editable")
    .forEach((el) => (d[el.getAttribute("data-key")] = el.innerHTML));
  localStorage.setItem("portfolioData", JSON.stringify(d));
  alert("Saved!");
}
function loadPortfolioContent() {
  const d = JSON.parse(localStorage.getItem("portfolioData"));
  if (d)
    document.querySelectorAll(".editable").forEach((el) => {
      if (d[el.getAttribute("data-key")])
        el.innerHTML = d[el.getAttribute("data-key")];
    });
}
