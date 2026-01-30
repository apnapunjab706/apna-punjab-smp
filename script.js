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


// 🔥 DASHBOARD AUTH + ROLE FETCH

firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "team-login.html";
  } else {
    loadDashboardUser(user);
  }
});

function loadDashboardUser(user) {
  firebase.firestore().collection("users").doc(user.uid).get()
    .then(doc => {
      if (!doc.exists) {
        alert("User data not found in database");
        return;
      }

      const data = doc.data();

      // ✅ Name + Role show
      document.getElementById("username").innerText = data.name;
      document.getElementById("roleBadge").innerText = data.role.toUpperCase();

      // ✅ Role based UI
      document.querySelectorAll(".owner, .coowner, .admin, .mod")
        .forEach(el => el.classList.add("hidden"));

      document.querySelectorAll("." + data.role)
        .forEach(el => el.classList.remove("hidden"));
    })
    .catch(err => {
      console.error("Firestore error:", err);
    });
}

// Logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "team-login.html";
  });
}
