// --- GLOBAL STATE ---
const ADMIN_USER = "hoangfnee";
const ADMIN_PASS = "Ho@ng2310"; // Lưu ý: Password lộ ở Client-side (chỉ dùng demo)

// --- NAVIGATION LOGIC ---
function showPage(pageId) {
  // Hide all sections
  document
    .querySelectorAll(".page-section")
    .forEach((sec) => sec.classList.remove("active", "hidden"));
  document
    .querySelectorAll(".page-section")
    .forEach((sec) => sec.classList.add("hidden"));

  // Show selected
  const selected = document.getElementById(pageId);
  selected.classList.remove("hidden");
  selected.classList.add("active");

  // Update Tab Styles
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));
  // Find button that calls this function (simple fix)
  const btns = document.querySelectorAll(".nav-btn");
  if (pageId === "portfolio") btns[0].classList.add("active");
  if (pageId === "dump") btns[1].classList.add("active");
  if (pageId === "gems") btns[2].classList.add("active");
  if (pageId === "cys") btns[3].classList.add("active");
}

function handleAuthClick() {
  if (localStorage.getItem("isAdmin") === "true") {
    // Log out
    localStorage.removeItem("isAdmin");
    location.reload();
  } else {
    showPage("signin");
  }
}

// --- AUTHENTICATION ---
function checkLoginState() {
  const isAuth = localStorage.getItem("isAdmin") === "true";
  const authBtn = document.getElementById("authBtn");

  if (isAuth) {
    authBtn.textContent = "Sign Out";
    document.getElementById("adminPostBox").classList.remove("hidden");
    document.getElementById("adminBookings").classList.remove("hidden");
  } else {
    authBtn.textContent = "Sign In";
    document.getElementById("adminPostBox").classList.add("hidden");
    document.getElementById("adminBookings").classList.add("hidden");
  }
}

function attemptLogin() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem("isAdmin", "true");
    alert("Welcome back, Hoang!");
    location.reload(); // Refresh to apply UI changes
  } else {
    document.getElementById("loginMsg").textContent = "Wrong credentials!";
  }
}

// --- DUMP (FEED) LOGIC ---
const defaultPosts = [
  {
    id: 1,
    text: "Just finished the TEDxFTU event! What a journey.",
    img: "",
    likes: 12,
  },
  {
    id: 2,
    text: "Learning C# and Auditing at the same time is tough but rewarding.",
    img: "",
    likes: 5,
  },
];

function loadPosts() {
  let posts = JSON.parse(localStorage.getItem("dumpPosts"));
  if (!posts) {
    posts = defaultPosts;
    localStorage.setItem("dumpPosts", JSON.stringify(posts));
  }
  const container = document.getElementById("feedOutput");
  container.innerHTML = ""; // Clear

  // Sort new to old
  posts.reverse().forEach((post) => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
            <div class="post-header">Hoang Nang Nguyen <span style="font-weight:normal; font-size:0.8em; color:#999">Just now</span></div>
            <p>${post.text}</p>
            ${post.img ? `<img src="${post.img}" class="post-img">` : ""}
            <div class="post-actions">
                <span class="action-btn" onclick="likePost(${
                  post.id
                })"><i data-lucide="heart"></i> ${post.likes}</span>
                <span class="action-btn" onclick="alert('Link copied!')"><i data-lucide="share-2"></i> Share</span>
                ${
                  localStorage.getItem("isAdmin") === "true"
                    ? `<span class="action-btn" style="color:red" onclick="deletePost(${post.id})">Delete</span>`
                    : ""
                }
            </div>
        `;
    container.appendChild(div);
  });
  lucide.createIcons();
}

function createPost() {
  const text = document.getElementById("postContent").value;
  const img = document.getElementById("postImage").value;
  if (!text) return alert("Write something!");

  let posts = JSON.parse(localStorage.getItem("dumpPosts")) || [];
  posts.push({ id: Date.now(), text, img, likes: 0 });
  localStorage.setItem("dumpPosts", JSON.stringify(posts));

  document.getElementById("postContent").value = "";
  loadPosts();
}

function likePost(id) {
  let posts = JSON.parse(localStorage.getItem("dumpPosts"));
  const p = posts.find((x) => x.id === id);
  if (p) {
    p.likes++;
    localStorage.setItem("dumpPosts", JSON.stringify(posts));
    loadPosts();
  }
}

function deletePost(id) {
  let posts = JSON.parse(localStorage.getItem("dumpPosts"));
  posts = posts.filter((x) => x.id !== id);
  localStorage.setItem("dumpPosts", JSON.stringify(posts));
  loadPosts();
}

// --- GEMS (FILTER) LOGIC ---
function filterGems(type) {
  const allGems = document.querySelectorAll(".gem-card");
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  event.target.classList.add("active");

  allGems.forEach((gem) => {
    if (type === "all" || gem.classList.contains(type)) {
      gem.style.display = "block";
    } else {
      gem.style.display = "none";
    }
  });
}

// --- CYS (BOOKING) LOGIC ---
let cysType = "inday";

function setCysType(type) {
  cysType = type;
  document.getElementById("btnInday").className =
    type === "inday" ? "toggle-btn active" : "toggle-btn";
  document.getElementById("btnMulti").className =
    type === "multiday" ? "toggle-btn active" : "toggle-btn";

  document.getElementById("indayInput").className =
    type === "inday" ? "" : "hidden";
  document.getElementById("multiInput").className =
    type === "multiday" ? "" : "hidden";

  // Reset
  document.getElementById("availabilityResult").innerHTML = "";
  document.getElementById("bookingForm").classList.add("hidden");
}

function checkAvailability() {
  const msg = document.getElementById("availabilityResult");
  // Mock Logic: 70% chance free
  const isFree = Math.random() > 0.3;

  if (isFree) {
    msg.innerHTML = `<span class="status-free">✓ You're in luck! Hoang is free.</span>`;
    setupForm();
    document.getElementById("bookingForm").classList.remove("hidden");
  } else {
    msg.innerHTML = `<span class="status-busy">✕ Sorry, Hoang is busy at this time.</span>`;
    document.getElementById("bookingForm").classList.add("hidden");
  }
}

function setupForm() {
  const select = document.getElementById("reasonSelect");
  select.innerHTML = "";
  const opts =
    cysType === "inday"
      ? ["Work Interview", "Sports", "Cafe", "Hangout", "Other"]
      : ["Business Trip", "Vacation", "Other"];

  opts.forEach((o) => {
    const opt = document.createElement("option");
    opt.value = o;
    opt.innerText = o;
    select.appendChild(opt);
  });
}

function submitBooking(e) {
  e.preventDefault();
  alert("Booking Request Sent Successfully! (This is a demo)");
  document.getElementById("bookingForm").reset();
  document.getElementById("bookingForm").classList.add("hidden");
  document.getElementById("availabilityResult").innerHTML = "";
}

// --- INIT ---
window.onload = function () {
  checkLoginState();
  loadPosts();
  // Re-render icons after load
  lucide.createIcons();
};
