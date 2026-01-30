// ===== Copy Server IP =====
function copyIP() {
  navigator.clipboard.writeText("apnapunjab.fun");
  alert("Server IP Copied!");
}

// ===== Live Server Status =====
const status = document.getElementById("server-status");
const players = document.getElementById("players");

fetch("https://api.mcsrvstat.us/2/apnapunjab.fun")
  .then(res => res.json())
  .then(data => {
    if (data.online) {
      status.innerHTML = "🟢 Server is ONLINE";
      players.innerHTML = `👥 Players: ${data.players.online} / ${data.players.max}`;
    } else {
      status.innerHTML = "🔴 Server is OFFLINE";
      players.innerHTML = "";
    }
  })
  .catch(() => {
    status.innerText = "⚠️ Status unavailable";
    players.innerText = "";
  });

// ===== Animated Particles Background =====
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";

const ctx = canvas.getContext("2d");

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
  });
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#22c55e";
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD_TqdF0ORIco-u-i2lOjrXOYocqSXWGdo",
  authDomain: "team-login-30ab2.firebaseapp.com",
  projectId: "team-login-30ab2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let currentRole = "";

/* ===============================
   AUTH CHECK
================================ */

/* ===============================
   LOAD USER DATA
================================ */
function loadUserData() {
  db.collection("users").doc(currentUser.uid).get()
    .then(doc => {
      if (!doc.exists) {
        alert("User data not found!");
        return;
      }

      const data = doc.data();
      document.getElementById("username").innerText = data.name;
      document.getElementById("roleBadge").innerText = data.role.toUpperCase();
      currentRole = data.role;

      applyRoleAccess();
      fetchStaffList();
    })
    .catch(err => console.error(err));
}

/* ===============================
   ROLE BASED ACCESS
================================ */
function applyRoleAccess() {
  document.querySelectorAll(".owner, .coowner, .admin, .mod")
    .forEach(el => el.classList.add("hidden"));

  document.querySelectorAll("." + currentRole)
    .forEach(el => el.classList.remove("hidden"));
}

/* ===============================
   LOGOUT
================================ */
function logout() {
  auth.signOut().then(() => {
    window.location.href = "team-login.html";
  });
}

/* ===============================
   STAFF MANAGEMENT
================================ */
const staffListEl = document.getElementById("staffList");

// Fetch staff list
function fetchStaffList() {
  if (!staffListEl) return;

  db.collection("users").onSnapshot(snapshot => {
    staffListEl.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      staffListEl.innerHTML += `
        <li>
          ${data.name} (${data.role})
          <button onclick="editStaff('${doc.id}')">Edit</button>
          <button onclick="removeStaff('${doc.id}')">Remove</button>
        </li>
      `;
    });
  });
}

// Add staff
function addStaff() {
  const name = document.getElementById("staffName").value;
  const email = document.getElementById("staffEmail").value;
  const role = document.getElementById("staffRole").value;

  if (!name || !email || !role) {
    alert("Please fill all fields");
    return;
  }

  auth.createUserWithEmailAndPassword(email, "defaultPassword123")
    .then(cred => {
      return db.collection("users").doc(cred.user.uid).set({
        name: name,
        email: email,
        role: role
      });
    })
    .then(() => {
      alert("Staff added successfully!");
      document.getElementById("staffName").value = "";
      document.getElementById("staffEmail").value = "";
      fetchStaffList();
    })
    .catch(err => alert(err.message));
}

// Edit staff
function editStaff(uid) {
  const newName = prompt("Enter new name:");
  const newRole = prompt("Enter new role (owner/coowner/admin/mod):");

  if (!newName || !newRole) return;

  db.collection("users").doc(uid).update({
    name: newName,
    role: newRole
  });
}

// Remove staff
function removeStaff(uid) {
  if (!confirm("Are you sure you want to remove this staff?")) return;

  db.collection("users").doc(uid).delete();
}
