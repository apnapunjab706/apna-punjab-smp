const firebaseConfig = {
  apiKey: "AIzaSyD_TqdF0ORIco-u-i2lOjrXOYocqSXWGdo",
  authDomain: "team-login-30ab2.firebaseapp.com",
  projectId: "team-login-30ab2",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// AUTH CHECK
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "team-login.html";
    return;
  }

  loadUser(user.uid);
});

// LOAD USER DATA
function loadUser(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();

    document.getElementById("userName").innerText = data.name;
    document.getElementById("userRole").innerText = data.role.toUpperCase();

    // PERMISSIONS
    if (data.role === "owner" || data.role === "co-owner") {
      document.getElementById("addStaffBtn").style.display = "block";
    }

    loadStaff();
    loadAnnouncements();
  });
}

// SIDEBAR NAV
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// ADD STAFF
function addStaff() {
  const name = staffName.value;
  const email = staffEmail.value;
  const role = staffRole.value;

  if (!name || !email) return alert("Fill all fields");

  db.collection("pendingStaff").add({
    name, email, role
  });

  alert("Staff added (create auth manually)");
}

// LOAD STAFF LIST
function loadStaff() {
  db.collection("users").get().then(snapshot => {
    staffList.innerHTML = "";
    snapshot.forEach(doc => {
      const s = doc.data();
      staffList.innerHTML += `<li>${s.name} – ${s.role}</li>`;
    });
  });
}

// ANNOUNCEMENTS
function loadAnnouncements() {
  db.collection("announcements").get().then(snap => {
    announcementList.innerHTML = "";
    snap.forEach(d => {
      announcementList.innerHTML += `<li>${d.data().text}</li>`;
    });
  });
}

// LOGOUT
function logout() {
  auth.signOut().then(() => location.href = "team-login.html");
}
console.log("USER:", user.uid);
alert("JS LOADED");

auth.onAuthStateChanged(user => {
  alert(user ? "LOGGED IN" : "NOT LOGGED IN");
});
