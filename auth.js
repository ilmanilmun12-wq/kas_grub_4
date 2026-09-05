// ============================================
// AUTH.JS - Logika Login & Sesi Kas Grup 4
// ============================================

// Akun demo. Silakan ganti sesuai kebutuhan.
const AKUN_VALID = {
  username: "admin",
  password: "admin123"
};

const SESSION_KEY = "kasGrup4_session";

// Jika saat membuka halaman login ternyata sesi sudah aktif,
// langsung arahkan ke dashboard (misal user membuka index.html lagi).
(function cekSesiAktif() {
  const sesi = localStorage.getItem(SESSION_KEY);
  if (sesi) {
    window.location.href = "dashboard.html";
  }
})();

// Toggle tampil/sembunyikan password
const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

toggleBtn.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  eyeIcon.textContent = isPassword ? "🙈" : "👁️";
});

// Proses login
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = passwordInput.value.trim();

  if (username === AKUN_VALID.username && password === AKUN_VALID.password) {
    // Simpan sesi ke localStorage supaya tetap login walau halaman di-refresh
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      username: username,
      loginAt: new Date().toISOString()
    }));
    window.location.href = "dashboard.html";
  } else {
    loginError.textContent = "Username atau password salah. Silakan coba lagi.";
    loginError.classList.remove("hidden");
  }
});
