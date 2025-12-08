// // --- GLOBAL STATE ---
// const ADMIN_USER = "hoangfnee";
// const ADMIN_PASS = "Ho@ng2310"; // Lưu ý: Password lộ ở Client-side (chỉ dùng demo)

// // --- NAVIGATION LOGIC ---
// function showPage(pageId) {
//   // Hide all sections
//   document
//     .querySelectorAll(".page-section")
//     .forEach((sec) => sec.classList.remove("active", "hidden"));
//   document
//     .querySelectorAll(".page-section")
//     .forEach((sec) => sec.classList.add("hidden"));

//   // Show selected
//   const selected = document.getElementById(pageId);
//   selected.classList.remove("hidden");
//   selected.classList.add("active");

//   // Update Tab Styles
//   document
//     .querySelectorAll(".nav-btn")
//     .forEach((btn) => btn.classList.remove("active"));
//   // Find button that calls this function (simple fix)
//   const btns = document.querySelectorAll(".nav-btn");
//   if (pageId === "portfolio") btns[0].classList.add("active");
//   if (pageId === "dump") btns[1].classList.add("active");
//   if (pageId === "gems") btns[2].classList.add("active");
//   if (pageId === "cys") btns[3].classList.add("active");
// }

// function handleAuthClick() {
//   if (localStorage.getItem("isAdmin") === "true") {
//     // Log out
//     localStorage.removeItem("isAdmin");
//     location.reload();
//   } else {
//     showPage("signin");
//   }
// }

// // --- AUTHENTICATION ---
// function checkLoginState() {
//   const isAuth = localStorage.getItem("isAdmin") === "true";
//   const authBtn = document.getElementById("authBtn");

//   if (isAuth) {
//     authBtn.textContent = "Sign Out";
//     document.getElementById("adminPostBox").classList.remove("hidden");
//     document.getElementById("adminBookings").classList.remove("hidden");
//   } else {
//     authBtn.textContent = "Sign In";
//     document.getElementById("adminPostBox").classList.add("hidden");
//     document.getElementById("adminBookings").classList.add("hidden");
//   }
// }

// function attemptLogin() {
//   const u = document.getElementById("username").value;
//   const p = document.getElementById("password").value;

//   if (u === ADMIN_USER && p === ADMIN_PASS) {
//     localStorage.setItem("isAdmin", "true");
//     alert("Welcome back, Hoang!");
//     location.reload(); // Refresh to apply UI changes
//   } else {
//     document.getElementById("loginMsg").textContent = "Wrong credentials!";
//   }
// }

// // --- DUMP (FEED) LOGIC ---
// const defaultPosts = [
//   {
//     id: 1,
//     text: "Just finished the TEDxFTU event! What a journey.",
//     img: "",
//     likes: 12,
//   },
//   {
//     id: 2,
//     text: "Learning C# and Auditing at the same time is tough but rewarding.",
//     img: "",
//     likes: 5,
//   },
// ];

// function loadPosts() {
//   let posts = JSON.parse(localStorage.getItem("dumpPosts"));
//   if (!posts) {
//     posts = defaultPosts;
//     localStorage.setItem("dumpPosts", JSON.stringify(posts));
//   }
//   const container = document.getElementById("feedOutput");
//   container.innerHTML = ""; // Clear

//   // Sort new to old
//   posts.reverse().forEach((post) => {
//     const div = document.createElement("div");
//     div.className = "post-card";
//     div.innerHTML = `
//             <div class="post-header">Hoang Nang Nguyen <span style="font-weight:normal; font-size:0.8em; color:#999">Just now</span></div>
//             <p>${post.text}</p>
//             ${post.img ? `<img src="${post.img}" class="post-img">` : ""}
//             <div class="post-actions">
//                 <span class="action-btn" onclick="likePost(${
//                   post.id
//                 })"><i data-lucide="heart"></i> ${post.likes}</span>
//                 <span class="action-btn" onclick="alert('Link copied!')"><i data-lucide="share-2"></i> Share</span>
//                 ${
//                   localStorage.getItem("isAdmin") === "true"
//                     ? `<span class="action-btn" style="color:red" onclick="deletePost(${post.id})">Delete</span>`
//                     : ""
//                 }
//             </div>
//         `;
//     container.appendChild(div);
//   });
//   lucide.createIcons();
// }

// function createPost() {
//   const text = document.getElementById("postContent").value;
//   const img = document.getElementById("postImage").value;
//   if (!text) return alert("Write something!");

//   let posts = JSON.parse(localStorage.getItem("dumpPosts")) || [];
//   posts.push({ id: Date.now(), text, img, likes: 0 });
//   localStorage.setItem("dumpPosts", JSON.stringify(posts));

//   document.getElementById("postContent").value = "";
//   loadPosts();
// }

// function likePost(id) {
//   let posts = JSON.parse(localStorage.getItem("dumpPosts"));
//   const p = posts.find((x) => x.id === id);
//   if (p) {
//     p.likes++;
//     localStorage.setItem("dumpPosts", JSON.stringify(posts));
//     loadPosts();
//   }
// }

// function deletePost(id) {
//   let posts = JSON.parse(localStorage.getItem("dumpPosts"));
//   posts = posts.filter((x) => x.id !== id);
//   localStorage.setItem("dumpPosts", JSON.stringify(posts));
//   loadPosts();
// }

// // --- GEMS (FILTER) LOGIC ---
// function filterGems(type) {
//   const allGems = document.querySelectorAll(".gem-card");
//   document
//     .querySelectorAll(".filter-btn")
//     .forEach((b) => b.classList.remove("active"));
//   event.target.classList.add("active");

//   allGems.forEach((gem) => {
//     if (type === "all" || gem.classList.contains(type)) {
//       gem.style.display = "block";
//     } else {
//       gem.style.display = "none";
//     }
//   });
// }

// // --- CYS (BOOKING) LOGIC ---
// // let cysType = "inday";

// // function setCysType(type) {
// //   cysType = type;
// //   document.getElementById("btnInday").className =
// //     type === "inday" ? "toggle-btn active" : "toggle-btn";
// //   document.getElementById("btnMulti").className =
// //     type === "multiday" ? "toggle-btn active" : "toggle-btn";

// //   document.getElementById("indayInput").className =
// //     type === "inday" ? "" : "hidden";
// //   document.getElementById("multiInput").className =
// //     type === "multiday" ? "" : "hidden";

// //   // Reset
// //   document.getElementById("availabilityResult").innerHTML = "";
// //   document.getElementById("bookingForm").classList.add("hidden");
// // }

// // function checkAvailability() {
// //   const msg = document.getElementById("availabilityResult");
// //   // Mock Logic: 70% chance free
// //   const isFree = Math.random() > 0.3;

// //   if (isFree) {
// //     msg.innerHTML = `<span class="status-free">✓ You're in luck! Hoang is free.</span>`;
// //     setupForm();
// //     document.getElementById("bookingForm").classList.remove("hidden");
// //   } else {
// //     msg.innerHTML = `<span class="status-busy">✕ Sorry, Hoang is busy at this time.</span>`;
// //     document.getElementById("bookingForm").classList.add("hidden");
// //   }
// // }

// // function setupForm() {
// //   const select = document.getElementById("reasonSelect");
// //   select.innerHTML = "";
// //   const opts =
// //     cysType === "inday"
// //       ? ["Work Interview", "Sports", "Cafe", "Hangout", "Other"]
// //       : ["Business Trip", "Vacation", "Other"];

// //   opts.forEach((o) => {
// //     const opt = document.createElement("option");
// //     opt.value = o;
// //     opt.innerText = o;
// //     select.appendChild(opt);
// //   });
// // }

// // function submitBooking(e) {
// //   e.preventDefault();
// //   alert("Booking Request Sent Successfully! (This is a demo)");
// //   document.getElementById("bookingForm").reset();
// //   document.getElementById("bookingForm").classList.add("hidden");
// //   document.getElementById("availabilityResult").innerHTML = "";
// // }
// // /* --- CYS LOGIC GIỐNG ẢNH --- */
// // let cysType = "inday";

// // function setCysType(type) {
// //   cysType = type;

// //   // Update Tab Styles
// //   document.getElementById("btnInday").className =
// //     type === "inday" ? "cys-tab active" : "cys-tab";
// //   document.getElementById("btnMulti").className =
// //     type === "multiday" ? "cys-tab active" : "cys-tab";

// //   // Show/Hide Inputs
// //   document.getElementById("indayInput").className =
// //     type === "inday" ? "" : "hidden";
// //   document.getElementById("multiInput").className =
// //     type === "multiday" ? "" : "hidden";

// //   // Reset Form
// //   document.getElementById("availabilityResult").classList.add("hidden");
// //   document.getElementById("bookingForm").classList.add("hidden");
// // }

// // function checkAvailability() {
// //   // Giả lập logic check: Nếu người dùng đã chọn ngày, tự động hiện Available
// //   const dateInput =
// //     cysType === "inday"
// //       ? document.getElementById("checkDate").value
// //       : document.getElementById("startDate").value;

// //   if (!dateInput) return; // Chưa chọn ngày thì chưa làm gì

// //   const resultBox = document.getElementById("availabilityResult");
// //   const form = document.getElementById("bookingForm");

// //   // MOCK LOGIC: Random rảnh hoặc bận (80% rảnh cho demo đẹp)
// //   /* --- CẬP NHẬT LOGIC CHECK AVAILABILITY --- */
// //   function checkAvailability() {
// //     const errorBox = document.getElementById("invalidTimeBox");
// //     const resultBox = document.getElementById("availabilityResult");
// //     const form = document.getElementById("bookingForm");

// //     // Ẩn tất cả trước khi check
// //     errorBox.classList.add("hidden");
// //     resultBox.classList.add("hidden");
// //     form.classList.add("hidden");

// //     let startDate, endDate;

// //     // 1. Lấy dữ liệu ngày
// //     if (cysType === "inday") {
// //       const d = document.getElementById("checkDate").value;
// //       const t1 = document.getElementById("startTime").value;
// //       const t2 = document.getElementById("endTime").value;
// //       if (!d || !t1 || !t2) return; // Chưa nhập đủ

// //       startDate = new Date(`${d}T${t1}`);
// //       endDate = new Date(`${d}T${t2}`);
// //     } else {
// //       const d1 = document.getElementById("startDate").value;
// //       const d2 = document.getElementById("endDate").value;
// //       if (!d1 || !d2) return; // Chưa nhập đủ

// //       startDate = new Date(d1);
// //       endDate = new Date(d2);
// //     }

// //     // 2. CHECK LOGIC: Ngày kết thúc phải sau ngày bắt đầu
// //     if (endDate <= startDate) {
// //       errorBox.classList.remove("hidden"); // Hiện hộp lỗi màu đỏ
// //       lucide.createIcons();
// //       return; // Dừng lại, không cho hiện Available
// //     }

// //     // 3. Nếu logic đúng -> Chạy Mock Availability (Random)
// //     // (Trong thực tế đoạn này sẽ gọi API check database)
// //     const isAvailable = Math.random() > 0.2; // 80% rảnh

// //     resultBox.classList.remove("hidden");

// //     if (isAvailable) {
// //       // AVAILABLE (Xanh)
// //       resultBox.className = "status-box status-available";
// //       resultBox.innerHTML = `
// //             <div style="color:#059669"><i data-lucide="check-circle" class="status-icon"></i></div>
// //             <div class="status-content" style="color:#047857">
// //                 <h4>AVAILABLE</h4>
// //                 <p>Schedule is clear. You can proceed.</p>
// //             </div>
// //         `;
// //       form.classList.remove("hidden");
// //       setupReasonOptions();
// //     } else {
// //       // BUSY (Đỏ) - Admin bận thật sự
// //       resultBox.className = "status-box status-busy";
// //       resultBox.innerHTML = `
// //             <div style="color:#DC2626"><i data-lucide="x-circle" class="status-icon"></i></div>
// //             <div class="status-content" style="color:#B91C1C">
// //                 <h4>UNAVAILABLE</h4>
// //                 <p>Sorry, Hoang is busy at this time.</p>
// //             </div>
// //         `;
// //     }
// //     lucide.createIcons();
// //   }
// //   const isAvailable = Math.random() > 0.2;

// //   resultBox.classList.remove("hidden");

// //   if (isAvailable) {
// //     // Giao diện AVAILABLE (Xanh lá)
// //     resultBox.className = "status-box status-available";
// //     resultBox.innerHTML = `
// //             <div style="color:#059669"><i data-lucide="check-circle" class="status-icon"></i></div>
// //             <div class="status-content" style="color:#047857">
// //                 <h4>AVAILABLE</h4>
// //                 <p>Schedule is clear. You can proceed.</p>
// //             </div>
// //         `;
// //     // Hiện form điền
// //     form.classList.remove("hidden");
// //     setupReasonOptions();

// //     // Re-render icons
// //     lucide.createIcons();
// //   } else {
// //     // Giao diện BUSY (Đỏ)
// //     resultBox.className = "status-box status-busy";
// //     resultBox.innerHTML = `
// //             <div style="color:#DC2626"><i data-lucide="x-circle" class="status-icon"></i></div>
// //             <div class="status-content" style="color:#B91C1C">
// //                 <h4>UNAVAILABLE</h4>
// //                 <p>Sorry, this slot is busy. Please choose another time.</p>
// //             </div>
// //         `;
// //     form.classList.add("hidden");
// //     lucide.createIcons();
// //   }
// // }

// // function setupReasonOptions() {
// //   const select = document.getElementById("reasonSelect");
// //   select.innerHTML =
// //     '<option value="" disabled selected>Select Reason...</option>';

// //   const opts =
// //     cysType === "inday"
// //       ? ["Work Interview", "Sports", "Cafe", "Hangout", "Other"]
// //       : ["Business Trip", "Vacation", "Other"];

// //   opts.forEach((o) => {
// //     const opt = document.createElement("option");
// //     opt.value = o;
// //     opt.innerText = o;
// //     select.appendChild(opt);
// //   });
// // }

// // function submitBooking(e) {
// //   e.preventDefault();
// //   alert("✅ Booking Confirmed! We will contact you shortly.");
// //   // Reset
// //   document.getElementById("bookingForm").reset();
// //   setCysType(cysType); // Reset UI
// // }
// /* --- FILE: script.js (UPDATED REAL-TIME LOGIC) --- */

// // Biến lưu trữ loại sự kiện hiện tại
// let cysType = "inday";

// // 1. KHI TRANG LOAD: Tự động set ngày hôm nay (Real-time)
// window.addEventListener("load", () => {
//   lucide.createIcons(); // Khởi tạo icon

//   // Lấy ngày hôm nay theo định dạng YYYY-MM-DD
//   const today = new Date().toISOString().split("T")[0];

//   // Cài đặt cho các ô chọn ngày
//   const dateInputs = ["checkDate", "startDate", "endDate"];

//   dateInputs.forEach((id) => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.value = today; // Mặc định là hôm nay
//       el.min = today; // Không cho chọn ngày quá khứ (HTML5 validation)
//     }
//   });
// });

// // 2. CHUYỂN ĐỔI TAB (In-Day / Multi-Day)
// function setCysType(type) {
//   cysType = type;

//   // Đổi màu Tab
//   document.getElementById("btnInday").className =
//     type === "inday" ? "cys-tab active" : "cys-tab";
//   document.getElementById("btnMulti").className =
//     type === "multiday" ? "cys-tab active" : "cys-tab";

//   // Ẩn/Hiện Input tương ứng
//   document.getElementById("indayInput").className =
//     type === "inday" ? "" : "hidden";
//   document.getElementById("multiInput").className =
//     type === "multiday" ? "" : "hidden";

//   // Reset lại trạng thái form
//   resetForm();
// }

// // 3. HÀM RESET FORM
// function resetForm() {
//   document.getElementById("availabilityResult").classList.add("hidden");
//   document.getElementById("invalidTimeBox").classList.add("hidden");
//   document.getElementById("bookingForm").classList.add("hidden");
// }

// // 4. CHECK LOGIC THỜI GIAN (LOGIC CHÍNH)
// function checkAvailability() {
//   // Ẩn hết thông báo cũ
//   resetForm();

//   const todayStr = new Date().toISOString().split("T")[0]; // Ngày hôm nay (String)
//   const todayDate = new Date(todayStr); // Ngày hôm nay (Object Date để so sánh)

//   let start, end; // Biến lưu ngày bắt đầu, kết thúc để kiểm tra

//   // --- TRƯỜNG HỢP 1: IN-DAY (Trong ngày) ---
//   if (cysType === "inday") {
//     const dVal = document.getElementById("checkDate").value;
//     const tStart = document.getElementById("startTime").value;
//     const tEnd = document.getElementById("endTime").value;

//     if (!dVal || !tStart || !tEnd) return; // Chưa nhập đủ thì thôi

//     const checkDate = new Date(dVal);

//     // Lỗi 1: Chọn ngày trong quá khứ
//     if (checkDate < todayDate) {
//       showError("Cannot book a date in the past.");
//       return;
//     }

//     // Lỗi 2: Giờ kết thúc nhỏ hơn giờ bắt đầu (Ví dụ: Từ 10:00 đến 09:00)
//     if (tEnd <= tStart) {
//       showError("End Time must be after Start Time.");
//       return;
//     }

//     // --- TRƯỜNG HỢP 2: MULTI-DAY (Nhiều ngày) ---
//   } else {
//     const d1Val = document.getElementById("startDate").value;
//     const d2Val = document.getElementById("endDate").value;

//     if (!d1Val || !d2Val) return;

//     const date1 = new Date(d1Val);
//     const date2 = new Date(d2Val);

//     // Lỗi 1: Ngày bắt đầu là quá khứ
//     if (date1 < todayDate) {
//       showError("Start Date cannot be in the past.");
//       return;
//     }

//     // Lỗi 2: Ngày kết thúc nhỏ hơn ngày bắt đầu
//     if (date2 <= date1) {
//       showError("End Date must be after Start Date.");
//       return;
//     }
//   }

//   // --- NẾU KHÔNG CÓ LỖI -> CHẠY GIẢ LẬP CHECK ---
//   // (Logic: Random 80% rảnh)
//   const isAvailable = Math.random() > 0.2;

//   const resultBox = document.getElementById("availabilityResult");
//   const form = document.getElementById("bookingForm");

//   resultBox.classList.remove("hidden");

//   if (isAvailable) {
//     // HIỆN MÀU XANH (AVAILABLE)
//     resultBox.className = "status-box status-available";
//     resultBox.innerHTML = `
//             <div style="color:#059669"><i data-lucide="check-circle" class="status-icon"></i></div>
//             <div class="status-content" style="color:#047857">
//                 <h4>AVAILABLE</h4>
//                 <p>Schedule is clear. You can proceed.</p>
//             </div>
//         `;
//     form.classList.remove("hidden"); // Hiện form điền thông tin
//     setupReasonOptions(); // Nạp lý do vào dropdown
//   } else {
//     // HIỆN MÀU ĐỎ (BUSY)
//     resultBox.className = "status-box status-busy";
//     resultBox.innerHTML = `
//             <div style="color:#DC2626"><i data-lucide="x-circle" class="status-icon"></i></div>
//             <div class="status-content" style="color:#B91C1C">
//                 <h4>UNAVAILABLE</h4>
//                 <p>Sorry, Hoang is busy at this time.</p>
//             </div>
//         `;
//   }
//   lucide.createIcons(); // Render lại icon
// }

// // 5. HÀM HIỂN THỊ LỖI
// function showError(msg) {
//   const errBox = document.getElementById("invalidTimeBox");
//   errBox.classList.remove("hidden");
//   errBox.innerHTML = `
//         <div style="color:#DC2626"><i data-lucide="alert-circle" class="status-icon"></i></div>
//         <div class="status-content" style="color:#B91C1C">
//             <h4>INVALID TIME</h4>
//             <p>${msg}</p>
//         </div>
//     `;
//   lucide.createIcons();
// }

// // 6. NẠP OPTIONS LÝ DO (Dynamic)
// function setupReasonOptions() {
//   const select = document.getElementById("reasonSelect");
//   // Giữ nguyên option đầu tiên
//   select.innerHTML =
//     '<option value="" disabled selected>Select Reason...</option>';

//   const opts =
//     cysType === "inday"
//       ? ["Work Interview", "Sports", "Cafe", "Hangout", "Other"]
//       : ["Business Trip", "Vacation", "Other"];

//   opts.forEach((o) => {
//     const opt = document.createElement("option");
//     opt.value = o;
//     opt.innerText = o;
//     select.appendChild(opt);
//   });
// }

// // 7. GỬI FORM (Giả lập)
// function submitBooking(e) {
//   e.preventDefault();
//   alert("✅ Booking Confirmed! We will contact you shortly.");
//   document.getElementById("bookingForm").reset();
//   resetForm();

//   // Reset lại ngày về hôm nay sau khi gửi
//   const today = new Date().toISOString().split("T")[0];
//   document.getElementById("checkDate").value = today;
// }
// // Gọi setup icon khi load
// window.addEventListener("load", () => {
//   lucide.createIcons();
// });

// // --- INIT ---
// window.onload = function () {
//   checkLoginState();
//   loadPosts();
//   // Re-render icons after load
//   lucide.createIcons();
// };
// /* --- GLOBAL CONFIG --- */
// const ADMIN_USER = "hoangfnee";
// const ADMIN_PASS = "Ho@ng2310";
// let cysType = "inday";

// /* --- 1. REAL-TIME INIT (KHI LOAD TRANG) --- */
// window.addEventListener("load", () => {
//   lucide.createIcons();

//   // Lấy ngày hôm nay theo giờ địa phương (Local Time)
//   // Cần xử lý kỹ để tránh bị lệch múi giờ so với UTC
//   const d = new Date();
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   const today = `${year}-${month}-${day}`;

//   // Cài đặt cho các ô input Date
//   const dateInputs = ["checkDate", "startDate", "endDate"];
//   dateInputs.forEach((id) => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.value = today; // Mặc định hiển thị hôm nay (08/12/2025)
//       el.min = today; // Không cho chọn ngày trong quá khứ
//     }
//   });

//   // Mặc định giờ hiện tại cho Start Time, và +1 tiếng cho End Time
//   const now = new Date();
//   const currentHour = String(now.getHours()).padStart(2, "0");
//   const nextHour = String((now.getHours() + 1) % 24).padStart(2, "0");

//   const startEl = document.getElementById("startTime");
//   const endEl = document.getElementById("endTime");

//   if (startEl) startEl.value = `${currentHour}:00`;
//   if (endEl) endEl.value = `${nextHour}:00`;
// });

// /* --- 2. NAVIGATION --- */
// function showPage(pageId) {
//   document.querySelectorAll(".page-section").forEach((sec) => {
//     sec.classList.remove("active");
//     sec.classList.add("hidden");
//   });
//   document.getElementById(pageId).classList.remove("hidden");
//   document.getElementById(pageId).classList.add("active");

//   // Update Nav Button Style
//   document
//     .querySelectorAll(".nav-btn")
//     .forEach((b) => b.classList.remove("active"));
//   const map = { portfolio: 0, dump: 1, gems: 2, cys: 3 };
//   const btns = document.querySelectorAll(".nav-btn");
//   if (btns[map[pageId]]) btns[map[pageId]].classList.add("active");
// }

// /* --- 3. CYS LOGIC (TAB & CHECK) --- */
// function setCysType(type) {
//   cysType = type;
//   document.getElementById("btnInday").className =
//     type === "inday" ? "cys-tab active" : "cys-tab";
//   document.getElementById("btnMulti").className =
//     type === "multiday" ? "cys-tab active" : "cys-tab";
//   document.getElementById("indayInput").className =
//     type === "inday" ? "" : "hidden";
//   document.getElementById("multiInput").className =
//     type === "multiday" ? "" : "hidden";
//   resetForm();
// }

// function resetForm() {
//   document.getElementById("availabilityResult").classList.add("hidden");
//   document.getElementById("invalidTimeBox").classList.add("hidden");
//   document.getElementById("bookingForm").classList.add("hidden");
// }

// function checkAvailability() {
//   resetForm(); // Ẩn lỗi cũ

//   // Lấy ngày hôm nay (Set giờ về 00:00:00 để so sánh chính xác)
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   let isValid = true;
//   let errorMsg = "";

//   // --- LOGIC KIỂM TRA ---
//   if (cysType === "inday") {
//     const dVal = document.getElementById("checkDate").value;
//     const tStart = document.getElementById("startTime").value;
//     const tEnd = document.getElementById("endTime").value;

//     if (!dVal || !tStart || !tEnd) return; // Chưa nhập đủ

//     const selectedDate = new Date(dVal);
//     selectedDate.setHours(0, 0, 0, 0); // Reset giờ để so sánh ngày

//     // 1. Check Ngày Quá Khứ
//     if (selectedDate < today) {
//       isValid = false;
//       errorMsg = "Cannot choose a date in the past.";
//     }
//     // 2. Check Giờ (End phải > Start)
//     else if (tEnd <= tStart) {
//       isValid = false;
//       errorMsg = "End Time must be after Start Time.";
//     }
//   } else {
//     // Multi-day
//     const d1Val = document.getElementById("startDate").value;
//     const d2Val = document.getElementById("endDate").value;

//     if (!d1Val || !d2Val) return;

//     const date1 = new Date(d1Val);
//     date1.setHours(0, 0, 0, 0);
//     const date2 = new Date(d2Val);
//     date2.setHours(0, 0, 0, 0);

//     // 1. Check Ngày Quá Khứ
//     if (date1 < today) {
//       isValid = false;
//       errorMsg = "Start Date cannot be in the past.";
//     }
//     // 2. Check Logic (End > Start)
//     else if (date2 <= date1) {
//       isValid = false;
//       errorMsg = "End Date must be after Start Date.";
//     }
//   }

//   // --- XỬ LÝ KẾT QUẢ ---
//   if (!isValid) {
//     showError(errorMsg);
//     return;
//   }

//   // Nếu hợp lệ -> Random trạng thái (Mock Availability)
//   const isAvailable = Math.random() > 0.3; // 70% cơ hội Available
//   const resultBox = document.getElementById("availabilityResult");
//   const form = document.getElementById("bookingForm");

//   resultBox.classList.remove("hidden");

//   if (isAvailable) {
//     // MÀU XANH
//     resultBox.className = "status-box status-available";
//     resultBox.innerHTML = `
//             <div style="color:#059669"><i data-lucide="check-circle" class="status-icon"></i></div>
//             <div class="status-content" style="color:#047857">
//                 <h4>AVAILABLE</h4>
//                 <p>Schedule is clear. You can proceed.</p>
//             </div>
//         `;
//     form.classList.remove("hidden");
//     setupReasonOptions();
//   } else {
//     // MÀU ĐỎ (BẬN)
//     resultBox.className = "status-box status-busy";
//     resultBox.innerHTML = `
//             <div style="color:#DC2626"><i data-lucide="x-circle" class="status-icon"></i></div>
//             <div class="status-content" style="color:#B91C1C">
//                 <h4>UNAVAILABLE</h4>
//                 <p>Sorry, Hoang is busy at this time.</p>
//             </div>
//         `;
//   }
//   lucide.createIcons();
// }

// function showError(msg) {
//   const errBox = document.getElementById("invalidTimeBox");
//   errBox.classList.remove("hidden");
//   errBox.innerHTML = `
//         <div style="color:#DC2626"><i data-lucide="alert-circle" class="status-icon"></i></div>
//         <div class="status-content" style="color:#B91C1C">
//             <h4>INVALID TIME</h4>
//             <p>${msg}</p>
//         </div>
//     `;
//   lucide.createIcons();
// }

// function setupReasonOptions() {
//   const select = document.getElementById("reasonSelect");
//   select.innerHTML =
//     '<option value="" disabled selected>Select Reason...</option>';
//   const opts =
//     cysType === "inday"
//       ? ["Work Interview", "Sports", "Cafe", "Hangout", "Other"]
//       : ["Business Trip", "Vacation", "Other"];
//   opts.forEach((o) => {
//     const opt = document.createElement("option");
//     opt.value = o;
//     opt.innerText = o;
//     select.appendChild(opt);
//   });
// }

// function submitBooking(e) {
//   e.preventDefault();
//   alert("✅ Booking Request Sent Successfully!");
//   document.getElementById("bookingForm").reset();
//   resetForm();
//   // Reset về ngày hôm nay
//   const d = new Date();
//   const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
//     2,
//     "0"
//   )}-${String(d.getDate()).padStart(2, "0")}`;
//   document.getElementById("checkDate").value = today;
// }

// // --- AUTH & OTHER FUNCTIONS ---
// function handleAuthClick() {
//   /* (Giữ nguyên logic cũ) */
// }
// function attemptLogin() {
//   /* (Giữ nguyên logic cũ) */
// }
/* =========================================
   1. GLOBAL CONFIG & INIT
   ========================================= */
const ADMIN_USER = "hoangfnee";
const ADMIN_PASS = "Ho@ng2310";
let cysType = "inday"; // Mặc định là In-Day

// Hàm lấy giờ Việt Nam (GMT+7) chuẩn xác bất kể máy tính đang ở đâu
function getVNTime() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
}

// Chạy ngay khi web tải xong
window.addEventListener("load", () => {
  // 1. Khởi tạo Icon
  if (typeof lucide !== "undefined") lucide.createIcons();

  // 2. Load content cho portfolio
  loadPortfolioContent();

  // 3. Load bài viết (Trang Dump)
  loadPosts();
  
  // 3.1. Load gems
  loadGems();

  // 4. Kiểm tra trạng thái đăng nhập
  checkLoginState();

  // 5. REAL-TIME DATE SETUP (GMT+7)
  setupRealTimeDates();
});

function setupRealTimeDates() {
  // Lấy thời gian hiện tại ở VN
  const nowVN = getVNTime();

  // Format YYYY-MM-DD
  const year = nowVN.getFullYear();
  const month = String(nowVN.getMonth() + 1).padStart(2, "0");
  const day = String(nowVN.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  // Áp dụng cho các ô chọn ngày
  ["checkDate", "startDate", "endDate"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = today; // Điền ngày hôm nay
      el.min = today; // Chặn chọn ngày quá khứ
    }
  });

  // Format Giờ hiện tại (HH:MM)
  const curHour = String(nowVN.getHours()).padStart(2, "0");
  const curMin = String(nowVN.getMinutes()).padStart(2, "0");

  // Giờ kết thúc tự động +1 tiếng
  const nextHourVal = (nowVN.getHours() + 1) % 24;
  const nextHour = String(nextHourVal).padStart(2, "0");

  const tStart = document.getElementById("startTime");
  const tEnd = document.getElementById("endTime");

  // Set mặc định là giờ hiện tại (VD: 10:15)
  if (tStart) tStart.value = `${curHour}:${curMin}`;
  if (tEnd) tEnd.value = `${nextHour}:${curMin}`;
}

/* =========================================
   2. NAVIGATION (CHUYỂN TRANG)
   ========================================= */
function showPage(pageId) {
  document.querySelectorAll(".page-section").forEach((sec) => {
    sec.classList.remove("active");
    sec.classList.add("hidden");
  });
  const selected = document.getElementById(pageId);
  if (selected) {
    selected.classList.remove("hidden");
    selected.classList.add("active");
  }
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  const navMap = { portfolio: 0, dump: 1, gems: 2, cys: 3 };
  const btns = document.querySelectorAll(".nav-btn");
  if (btns[navMap[pageId]]) btns[navMap[pageId]].classList.add("active");
}

/* =========================================
   3. CYS (CHECK YOUR SCHEDULE) LOGIC
   ========================================= */
function setCysType(type) {
  cysType = type;
  document.getElementById("btnInday").className =
    type === "inday" ? "cys-tab active" : "cys-tab";
  document.getElementById("btnMulti").className =
    type === "multiday" ? "cys-tab active" : "cys-tab";
  document.getElementById("indayInput").className =
    type === "inday" ? "" : "hidden";
  document.getElementById("multiInput").className =
    type === "multiday" ? "" : "hidden";
  resetForm();
  setupRealTimeDates(); // Reset lại giờ khi chuyển tab
}

function resetForm() {
  document.getElementById("availabilityResult").classList.add("hidden");
  document.getElementById("invalidTimeBox").classList.add("hidden");
  document.getElementById("bookingForm").classList.add("hidden");
}

function checkAvailability() {
  resetForm();

  // Lấy thời gian thực tế tại VN để so sánh
  const nowVN = getVNTime();

  // Tạo mốc 0h00 hôm nay để so sánh ngày
  const todayZero = new Date(nowVN);
  todayZero.setHours(0, 0, 0, 0);

  let isValid = true;
  let errorMsg = "";

  if (cysType === "inday") {
    const dVal = document.getElementById("checkDate").value;
    const tStart = document.getElementById("startTime").value;
    const tEnd = document.getElementById("endTime").value;

    if (!dVal || !tStart || !tEnd) return;

    // Tạo đối tượng ngày user chọn
    const selDate = new Date(dVal);
    selDate.setHours(0, 0, 0, 0);

    // 1. Check ngày quá khứ
    if (selDate < todayZero) {
      isValid = false;
      errorMsg = "Cannot choose a date in the past.";
    }
    // 2. Check giờ quá khứ (NẾU CHỌN NGÀY HÔM NAY)
    else if (selDate.getTime() === todayZero.getTime()) {
      // Convert giờ nhập (HH:MM) thành phút để so sánh
      const [hUser, mUser] = tStart.split(":").map(Number);
      const userMins = hUser * 60 + mUser;

      const currentMins = nowVN.getHours() * 60 + nowVN.getMinutes();

      if (userMins < currentMins) {
        isValid = false;
        errorMsg = "Start time has already passed.";
      }
    }

    // 3. Check giờ kết thúc phải sau giờ bắt đầu
    if (isValid && tEnd <= tStart) {
      isValid = false;
      errorMsg = "End Time must be after Start Time.";
    }
  } else {
    // Multi-day
    const d1 = document.getElementById("startDate").value;
    const d2 = document.getElementById("endDate").value;

    if (!d1 || !d2) return;

    const date1 = new Date(d1);
    date1.setHours(0, 0, 0, 0);
    const date2 = new Date(d2);
    date2.setHours(0, 0, 0, 0);

    if (date1 < todayZero) {
      isValid = false;
      errorMsg = "Start Date cannot be in the past.";
    } else if (date2 <= date1) {
      isValid = false;
      errorMsg = "End Date must be after Start Date.";
    }
  }

  if (!isValid) {
    showError(errorMsg);
    return;
  }

  // Nếu hợp lệ -> Random trạng thái
  const isAvailable = Math.random() > 0.3;
  const resultBox = document.getElementById("availabilityResult");
  const form = document.getElementById("bookingForm");

  resultBox.classList.remove("hidden");

  if (isAvailable) {
    resultBox.className = "status-box status-available";
    resultBox.innerHTML = `
            <div style="color:#059669"><i data-lucide="check-circle" class="status-icon"></i></div>
            <div class="status-content" style="color:#047857">
                <h4>AVAILABLE</h4>
                <p>Schedule is clear. You can proceed.</p>
            </div>
        `;
    form.classList.remove("hidden");
    setupReasonOptions();
  } else {
    resultBox.className = "status-box status-busy";
    resultBox.innerHTML = `
            <div style="color:#DC2626"><i data-lucide="x-circle" class="status-icon"></i></div>
            <div class="status-content" style="color:#B91C1C">
                <h4>UNAVAILABLE</h4>
                <p>Sorry, Hoang is busy at this time.</p>
            </div>
        `;
  }
  lucide.createIcons();
}

function showError(msg) {
  const errBox = document.getElementById("invalidTimeBox");
  errBox.classList.remove("hidden");
  errBox.innerHTML = `
        <div style="color:#DC2626"><i data-lucide="alert-circle" class="status-icon"></i></div>
        <div class="status-content" style="color:#B91C1C">
            <h4>INVALID TIME</h4>
            <p>${msg}</p>
        </div>
    `;
  lucide.createIcons();
}

function setupReasonOptions() {
  const select = document.getElementById("reasonSelect");
  select.innerHTML =
    '<option value="" disabled selected>Select Reason...</option>';
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
  alert("✅ Booking Request Sent Successfully!");
  document.getElementById("bookingForm").reset();
  resetForm();
  setupRealTimeDates();
}

/* =========================================
   4. DUMP (FEED) & GEMS LOGIC
   ========================================= */
const defaultPosts = [{ id: 1, text: "Welcome to my portfolio!", likes: 5 }];

const defaultGems = [
    { id: 1, title: "The Coffee House", category: "cafe", desc: "Best place for deep work. Great cold brew.", img: "" },
    { id: 2, title: "Pizza 4P's", category: "restaurant", desc: "Amazing crab pasta. Good for dating.", img: "" }
];

function loadGems() {
    const gems = JSON.parse(localStorage.getItem("gems")) || defaultGems;
    const grid = document.getElementById("gemsGrid");
    if (!grid) return;

    grid.innerHTML = "";
    gems.forEach(gem => {
        const card = document.createElement("div");
        card.className = `gem-card ${gem.category}`;
        card.innerHTML = `
            <div class="gem-img" style="background-image: url(${gem.img || 'https://via.placeholder.com/300x200.png?text=Image'})"></div>
            <div class="gem-info">
                <h4>${gem.title}</h4>
                <span class="tag">${gem.category}</span>
                <p>${gem.desc}</p>
                ${localStorage.getItem("isAdmin") === "true" ? `<button class="delete-btn" onclick="deleteGem(${gem.id})">Delete</button>` : ""}
            </div>
        `;
        grid.appendChild(card);
    });
}

function addGem() {
    const title = document.getElementById("gemTitle").value;
    const category = document.getElementById("gemCategory").value;
    const desc = document.getElementById("gemDesc").value;
    const img = document.getElementById("gemImage").value;

    if (!title || !desc) return alert("Please fill in all fields.");

    let gems = JSON.parse(localStorage.getItem("gems")) || defaultGems;
    gems.push({ id: Date.now(), title, category, desc, img });
    localStorage.setItem("gems", JSON.stringify(gems));

    loadGems(); // Refresh grid
    // Clear form
    document.getElementById("gemTitle").value = "";
    document.getElementById("gemDesc").value = "";
    document.getElementById("gemImage").value = "";
}

function deleteGem(id) {
    if (!confirm("Are you sure you want to delete this gem?")) return;
    let gems = JSON.parse(localStorage.getItem("gems"));
    gems = gems.filter(g => g.id !== id);
    localStorage.setItem("gems", JSON.stringify(gems));
    loadGems();
}


function loadPosts() {
  let posts = JSON.parse(localStorage.getItem("dumpPosts")) || defaultPosts;
  const container = document.getElementById("feedOutput");
  if (!container) return;

  container.innerHTML = "";
  posts.reverse().forEach((post) => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
            <div class="post-header">Hoang Nang Nguyen <span style="font-size:0.8em;color:#999">Just now</span></div>
            <p>${post.text}</p>
            ${
              post.img
                ? `<img src="${post.img}" class="post-img" style="width:100%;border-radius:8px;margin-top:10px;">`
                : ""
            }
            <div class="post-actions" style="margin-top:10px;border-top:1px solid #eee;padding-top:10px;display:flex;gap:15px;color:#666;">
                <span style="cursor:pointer" onclick="likePost(${
                  post.id
                })"><i data-lucide="heart"></i> ${post.likes}</span>
                <span style="cursor:pointer"><i data-lucide="share-2"></i> Share</span>
                ${
                  localStorage.getItem("isAdmin") === "true"
                    ? `<span style="color:red;cursor:pointer;margin-left:auto" onclick="deletePost(${post.id})">Delete</span>`
                    : ""
                }
            </div>
        `;
    container.appendChild(div);
  });
  lucide.createIcons();
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

function createPost() {
  const txt = document.getElementById("postContent").value;
  const img = document.getElementById("postImage").value;
  if (!txt) return alert("Please write something!");

  let posts = JSON.parse(localStorage.getItem("dumpPosts")) || [];
  posts.push({ id: Date.now(), text: txt, img: img, likes: 0 });
  localStorage.setItem("dumpPosts", JSON.stringify(posts));

  document.getElementById("postContent").value = "";
  document.getElementById("postImage").value = "";
  loadPosts();
}

function deletePost(id) {
  if (!confirm("Delete this post?")) return;
  let posts = JSON.parse(localStorage.getItem("dumpPosts")) || [];
  posts = posts.filter((p) => p.id !== id);
  localStorage.setItem("dumpPosts", JSON.stringify(posts));
  loadPosts();
}

function filterGems(type) {
  document.querySelectorAll(".gem-card").forEach((c) => {
    c.style.display =
      type === "all" || c.classList.contains(type) ? "block" : "none";
  });
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  event.target.classList.add("active");
}

/* =========================================
   6. PORTFOLIO EDITING
   ========================================= */
function loadPortfolioContent() {
  const editableElements = document.querySelectorAll(".editable");
  editableElements.forEach((el) => {
    const key = el.getAttribute("data-key");
    const savedContent = localStorage.getItem(key);
    if (savedContent) {
      el.innerHTML = savedContent;
    }
  });
}

function savePortfolioContent() {
  const editableElements = document.querySelectorAll(".editable");
  editableElements.forEach((el) => {
    const key = el.getAttribute("data-key");
    localStorage.setItem(key, el.innerHTML);
  });
  alert("Portfolio content saved successfully!");
}

function makePortfolioEditable() {
  document.querySelectorAll(".editable").forEach((el) => {
    el.setAttribute("contenteditable", "true");
  });
  document.getElementById("portfolioTools").classList.remove("hidden");
}

/* =========================================
   5. AUTHENTICATION & ADMIN
   ========================================= */
function handleAuthClick() {
  if (localStorage.getItem("isAdmin") === "true") {
    localStorage.removeItem("isAdmin");
    location.reload();
  } else {
    showPage("signin");
  }
}

function checkLoginState() {
  const isAuth = localStorage.getItem("isAdmin") === "true";
  const authBtn = document.getElementById("authBtn");

  if (isAuth) {
    makePortfolioEditable(); // Enable editing
  }

  if (document.getElementById("adminAddGem"))
    document.getElementById("adminAddGem").className = isAuth
      ? "admin-card"
      : "hidden";

  if (document.getElementById("adminPostBox"))
    document.getElementById("adminPostBox").className = isAuth
      ? "create-post-card"
      : "hidden";
  if (document.getElementById("adminControls"))
    document.getElementById("adminControls").className = isAuth ? "" : "hidden";
  if (authBtn) authBtn.textContent = isAuth ? "Sign Out" : "Sign In";
}

function attemptLogin() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem("isAdmin", "true");
    alert("Login Successful!");
    location.reload();
  } else {
    document.getElementById("loginMsg").textContent =
      "Wrong username or password!";
  }
}

/* =========================================
   6. DATABASE TOOLS
   ========================================= */
function exportDatabase() {
  const data = JSON.stringify({
    posts: JSON.parse(localStorage.getItem("dumpPosts") || "[]"),
  });
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}

function importDatabase(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const d = JSON.parse(e.target.result);
      if (d.posts) localStorage.setItem("dumpPosts", JSON.stringify(d.posts));
      alert("Database restored!");
      location.reload();
    } catch (err) {
      alert("Invalid file format!");
    }
  };
  reader.readAsText(file);
}

// --- QUẢN LÝ LỊCH BẬN ---
function addBusySlot() {
  const d = document.getElementById("blockDate").value;
  const s = document.getElementById("blockStart").value;
  const e = document.getElementById("blockEnd").value;

  if (!d || !s || !e) return alert("Vui lòng nhập đủ ngày giờ!");

  const slots = JSON.parse(localStorage.getItem("busySlots")) || [];
  slots.push({ id: Date.now(), date: d, start: s, end: e });
  localStorage.setItem("busySlots", JSON.stringify(slots));

  renderBusyList();
  alert("Đã chặn khung giờ này!");
}

function renderBusyList() {
  const list = document.getElementById("busyList");
  if (!list) return;
  const slots = JSON.parse(localStorage.getItem("busySlots")) || [];

  list.innerHTML = slots
    .map(
      (slot) => `
        <li style="display:flex; justify-content:space-between;">
            <span>${slot.date} (${slot.start} - ${slot.end})</span>
            <span onclick="removeBusy(${slot.id})" style="color:red; cursor:pointer;">×</span>
        </li>
    `
    )
    .join("");
}

function removeBusy(id) {
  let slots = JSON.parse(localStorage.getItem("busySlots")) || [];
  slots = slots.filter((s) => s.id !== id);
  localStorage.setItem("busySlots", JSON.stringify(slots));
  renderBusyList();
}

// --- QUẢN LÝ REQUEST (APPOINTMENTS) ---
function renderRequests() {
  const list = document.getElementById("requestList");
  if (!list) return;
  const reqs = JSON.parse(localStorage.getItem("requests")) || [];

  list.innerHTML = reqs.length === 0 ? "<p>Không có yêu cầu nào.</p>" : "";

  reqs.forEach((r) => {
    list.innerHTML += `
            <div class="req-item">
                <div><strong>${r.name}</strong> muốn hẹn ngày <strong>${
      r.date
    }</strong></div>
                <div style="font-size:0.8rem; color:#666;">Lý do: ${
                  r.reason
                }</div>
                <div style="font-size:0.8rem; margin:5px 0;">Trạng thái: 
                    <span style="font-weight:bold; color:${
                      r.status === "Approved"
                        ? "green"
                        : r.status === "Rejected"
                        ? "red"
                        : "orange"
                    }">${r.status}</span>
                </div>
                ${
                  r.status === "Pending"
                    ? `
                <div class="req-actions">
                    <button class="btn-approve" onclick="updateReq(${r.id}, 'Approved')">Duyệt</button>
                    <button class="btn-reject" onclick="updateReq(${r.id}, 'Rejected')">Từ chối</button>
                </div>`
                    : ""
                }
            </div>
        `;
  });
}

function updateReq(id, status) {
  const reqs = JSON.parse(localStorage.getItem("requests")) || [];
  const r = reqs.find((x) => x.id === id);
  if (r) {
    r.status = status;
    localStorage.setItem("requests", JSON.stringify(reqs));
    renderRequests();
  }
}
