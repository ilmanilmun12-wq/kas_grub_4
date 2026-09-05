// ============================================
// DASHBOARD.JS - Logika Dashboard Kas Grup 4
// ============================================

const SESSION_KEY = "kasGrup4_session";
const DATA_KEY = "kasGrup4_transaksi";

// -------- 1. PENJAGA SESI (GUARD) --------
// Jika belum login, tendang balik ke halaman login.
// Jika sudah login, sesi tetap ada di localStorage sehingga
// refresh halaman dashboard TIDAK akan kembali ke halaman login.
const sesiRaw = localStorage.getItem(SESSION_KEY);
if (!sesiRaw) {
  window.location.href = "index.html";
}
const sesi = sesiRaw ? JSON.parse(sesiRaw) : null;
if (sesi && sesi.username) {
  document.getElementById("sidebarUser").textContent = "Halo, " + sesi.username;
}

// -------- 2. LOGOUT --------
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
});

// -------- 3. NAVIGASI SIDEBAR --------
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".content-section");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((i) => i.classList.remove("active"));
    sections.forEach((s) => s.classList.remove("active"));

    item.classList.add("active");
    const target = item.getAttribute("data-section");
    document.getElementById("section-" + target).classList.add("active");

    // Di layar HP, tutup sidebar otomatis setelah memilih menu
    if (window.innerWidth <= 768) {
      tutupSidebar();
    }
  });
});

// -------- 3b. HAMBURGER MENU (khusus tampilan HP) --------
const sidebar = document.getElementById("sidebar");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");

function bukaSidebar() {
  sidebar.classList.add("sidebar-open");
  sidebarOverlay.classList.add("active");
}

function tutupSidebar() {
  sidebar.classList.remove("sidebar-open");
  sidebarOverlay.classList.remove("active");
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains("sidebar-open")) {
      tutupSidebar();
    } else {
      bukaSidebar();
    }
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", tutupSidebar);
}

// Jika layar diperbesar melewati mode HP, pastikan sidebar & overlay ter-reset
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    tutupSidebar();
  }
});

// Jika layar diperbesar melewati mode HP, pastikan sidebar & overlay ter-reset
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    tutupSidebar();
  }
});

// -------- 4. DATA TRANSAKSI (localStorage) --------
function ambilData() {
  const raw = localStorage.getItem(DATA_KEY);
  return raw ? JSON.parse(raw) : [];
}

function simpanData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

function formatTanggal(tgl) {
  const d = new Date(tgl);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

// -------- 5. TAMBAH TRANSAKSI --------
document.getElementById("formPemasukan").addEventListener("submit", (e) => {
  e.preventDefault();
  const tanggal = document.getElementById("tglMasuk").value;
  const jumlah = parseFloat(document.getElementById("jumlahMasuk").value);
  const keterangan = document.getElementById("ketMasuk").value.trim();

  const data = ambilData();
  data.push({
    id: Date.now(),
    jenis: "masuk",
    tanggal,
    jumlah,
    keterangan
  });
  simpanData(data);
  e.target.reset();
  renderSemua();
});

document.getElementById("formPengeluaran").addEventListener("submit", (e) => {
  e.preventDefault();
  const tanggal = document.getElementById("tglKeluar").value;
  const jumlah = parseFloat(document.getElementById("jumlahKeluar").value);
  const keterangan = document.getElementById("ketKeluar").value.trim();

  const data = ambilData();
  data.push({
    id: Date.now(),
    jenis: "keluar",
    tanggal,
    jumlah,
    keterangan
  });
  simpanData(data);
  e.target.reset();
  renderSemua();
});

// -------- 6. HAPUS TRANSAKSI --------
function hapusTransaksi(id) {
  if (!confirm("Hapus transaksi ini?")) return;
  let data = ambilData();
  data = data.filter((t) => t.id !== id);
  simpanData(data);
  renderSemua();
}

// -------- 7. RENDER TABEL --------
function renderTabelMasuk() {
  const data = ambilData()
    .filter((t) => t.jenis === "masuk")
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const tbody = document.getElementById("tabelMasuk");
  const empty = document.getElementById("emptyMasuk");
  tbody.innerHTML = "";

  if (data.length === 0) {
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
    data.forEach((t) => {
      tbody.innerHTML += `
        <tr>
          <td>${formatTanggal(t.tanggal)}</td>
          <td>${t.keterangan}</td>
          <td class="amount-masuk">+ ${formatRupiah(t.jumlah)}</td>
          <td><button class="btn-delete" onclick="hapusTransaksi(${t.id})">🗑️</button></td>
        </tr>`;
    });
  }
}

function renderTabelKeluar() {
  const data = ambilData()
    .filter((t) => t.jenis === "keluar")
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const tbody = document.getElementById("tabelKeluar");
  const empty = document.getElementById("emptyKeluar");
  tbody.innerHTML = "";

  if (data.length === 0) {
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
    data.forEach((t) => {
      tbody.innerHTML += `
        <tr>
          <td>${formatTanggal(t.tanggal)}</td>
          <td>${t.keterangan}</td>
          <td class="amount-keluar">- ${formatRupiah(t.jumlah)}</td>
          <td><button class="btn-delete" onclick="hapusTransaksi(${t.id})">🗑️</button></td>
        </tr>`;
    });
  }
}

function renderTabelRiwayat() {
  const data = ambilData().sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const tbody = document.getElementById("tabelRiwayat");
  const empty = document.getElementById("emptyRiwayat");
  tbody.innerHTML = "";

  if (data.length === 0) {
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
    data.forEach((t) => {
      const isMasuk = t.jenis === "masuk";
      tbody.innerHTML += `
        <tr>
          <td>${formatTanggal(t.tanggal)}</td>
          <td><span class="badge ${isMasuk ? "badge-masuk" : "badge-keluar"}">${isMasuk ? "Pemasukan" : "Pengeluaran"}</span></td>
          <td>${t.keterangan}</td>
          <td class="${isMasuk ? "amount-masuk" : "amount-keluar"}">${isMasuk ? "+" : "-"} ${formatRupiah(t.jumlah)}</td>
          <td><button class="btn-delete" onclick="hapusTransaksi(${t.id})">🗑️</button></td>
        </tr>`;
    });
  }
}

// -------- 8. RINGKASAN SALDO --------
function renderRingkasan() {
  const data = ambilData();
  const totalMasuk = data.filter((t) => t.jenis === "masuk").reduce((a, t) => a + t.jumlah, 0);
  const totalKeluar = data.filter((t) => t.jenis === "keluar").reduce((a, t) => a + t.jumlah, 0);
  const totalSaldo = totalMasuk - totalKeluar;

  document.getElementById("totalSaldo").textContent = formatRupiah(totalSaldo);
  document.getElementById("totalMasuk").textContent = formatRupiah(totalMasuk);
  document.getElementById("totalKeluar").textContent = formatRupiah(totalKeluar);
}

// -------- 9. GRAFIK SALDO (Chart.js) --------
let saldoChartInstance = null;

function renderGrafik() {
  const fallback = document.getElementById("chartFallback");
  const canvasEl = document.getElementById("saldoChart");

  // Jika library Chart.js gagal dimuat, tampilkan pesan cadangan
  if (typeof Chart === "undefined") {
    canvasEl.classList.add("hidden");
    fallback.classList.remove("hidden");
    return;
  }
  canvasEl.classList.remove("hidden");
  fallback.classList.add("hidden");

  const data = ambilData().sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  let saldoBerjalan = 0;
  const labels = [];
  const nilaiSaldo = [];

  data.forEach((t) => {
    saldoBerjalan += t.jenis === "masuk" ? t.jumlah : -t.jumlah;
    labels.push(formatTanggal(t.tanggal));
    nilaiSaldo.push(saldoBerjalan);
  });

  if (labels.length === 0) {
    labels.push("Belum ada data");
    nilaiSaldo.push(0);
  }

  const ctx = canvasEl.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(99, 102, 241, 0.35)");
  gradient.addColorStop(1, "rgba(99, 102, 241, 0)");

  if (saldoChartInstance) {
    saldoChartInstance.destroy();
  }

  saldoChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Total Saldo",
        data: nilaiSaldo,
        borderColor: "#6366f1",
        backgroundColor: gradient,
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#4338ca",
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => "Saldo: " + formatRupiah(ctx.parsed.y)
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (val) => "Rp " + Number(val).toLocaleString("id-ID")
          },
          grid: { color: "#eef0f5" }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

// -------- 10. RENDER SEMUA --------
function renderSemua() {
  renderRingkasan();
  renderTabelMasuk();
  renderTabelKeluar();
  renderTabelRiwayat();
  renderGrafik();
}

// Set tanggal default = hari ini pada form
const today = new Date().toISOString().split("T")[0];
document.getElementById("tglMasuk").value = today;
document.getElementById("tglKeluar").value = today;

// Jalankan render pertama kali
renderSemua();