// =============================================
// HONDA LAMPUNG - DATA MOTOR & KONFIGURASI
// data.js
// =============================================

// ---- KONFIGURASI SALES (UBAH BAGIAN INI) ----
const CONFIG = {
  salesName: "Sales Honda Lampung",   // Ganti nama Anda
  dealerName: "Honda Lampung Resmi",  // Ganti nama dealer
  whatsapp: "6281234567890",          // Ganti nomor WA (format: 628xxx)
  phone: "+6281234567890",            // Nomor telpon
  region: "Lampung",
  pricelist_date: "Oktober 2026",
  initials: "HL",                     // Inisial untuk avatar
};

// ---- DATA MOTOR HONDA OTR LAMPUNG ----
// Sesuaikan harga OTR sesuai pricelist terbaru Lampung
const MOTORS = [
  // ==================== MATIC ====================
  {
    id: "beat-cbs",
    name: "Honda BeAT CBS",
    type: "Matic",
    category: "matic",
    otr: 17900000,
    colors: [
      { name: "Matte Red", hex: "#CC0000" },
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Matte White", hex: "#E8E8E8" },
      { name: "Trendy Blue", hex: "#1E5799" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/January2025/nTCwdCNALhOTlFhFHNBp.webp",
    spec_url: "https://www.astra-honda.com/product/beat-series",
    specs: {
      "Mesin": "108.2 cc, 4-Tak",
      "Tenaga": "9 PS / 7.500 rpm",
      "Torsi": "9.3 Nm / 5.500 rpm",
      "Transmisi": "Otomatis CVT",
      "Bahan Bakar": "Bensin (Pertalite+)",
      "Kapasitas Tangki": "3.7 Liter",
    }
  },
  {
    id: "beat-esp",
    name: "Honda BeAT Deluxe",
    type: "Matic",
    category: "matic",
    otr: 18650000,
    colors: [
      { name: "Pearl Navi Blue", hex: "#1A3A5C" },
      { name: "Matte Gunpowder Black", hex: "#2A2A2A" },
      { name: "Victory Red", hex: "#CC0000" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/January2025/nTCwdCNALhOTlFhFHNBp.webp",
    spec_url: "https://www.astra-honda.com/product/beat-series",
    specs: {
      "Mesin": "108.2 cc, 4-Tak",
      "Tenaga": "9 PS / 7.500 rpm",
      "Transmisi": "Otomatis CVT",
      "Fitur": "ESP + ISS",
    }
  },
  {
    id: "scoopy",
    name: "Honda Scoopy",
    type: "Matic Retro",
    category: "matic",
    otr: 22500000,
    colors: [
      { name: "Cream White", hex: "#F5F0DC" },
      { name: "Pastel Green", hex: "#7CB89A" },
      { name: "Matte Red", hex: "#CC0000" },
      { name: "Pastel Blue", hex: "#7BA7C4" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/scoopy-cream.webp",
    spec_url: "https://www.astra-honda.com/product/scoopy",
    specs: {
      "Mesin": "109.5 cc, 4-Tak",
      "Tenaga": "9.1 PS / 7.500 rpm",
      "Torsi": "9.4 Nm / 5.500 rpm",
      "Transmisi": "Otomatis CVT",
      "Fitur": "ESP + ISS + USB Charger",
    }
  },
  {
    id: "vario-125",
    name: "Honda Vario 125",
    type: "Matic",
    category: "matic",
    otr: 24350000,
    colors: [
      { name: "Matte Titan Black", hex: "#1A1A1A" },
      { name: "Gorgeous Matte Blue", hex: "#1E4A6B" },
      { name: "Sport Red", hex: "#CC0000" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/vario125-black.webp",
    spec_url: "https://www.astra-honda.com/product/vario-125",
    specs: {
      "Mesin": "124.8 cc, 4-Tak",
      "Tenaga": "11.9 PS / 8.500 rpm",
      "Torsi": "10.9 Nm / 5.000 rpm",
      "Transmisi": "Otomatis CVT",
      "Fitur": "LED All + ISS",
    }
  },
  {
    id: "vario-160",
    name: "Honda Vario 160",
    type: "Matic Premium",
    category: "matic",
    otr: 30100000,
    colors: [
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Matte Red", hex: "#CC0000" },
      { name: "Matte Grey", hex: "#5A5A5A" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/vario160-red.webp",
    spec_url: "https://www.astra-honda.com/product/vario-160",
    specs: {
      "Mesin": "156.9 cc, 4-Tak",
      "Tenaga": "15.44 PS / 8.500 rpm",
      "Torsi": "13.8 Nm / 7.000 rpm",
      "Transmisi": "Otomatis CVT",
      "Fitur": "LED All + Honda Selectable Torque Control",
    }
  },
  {
    id: "pcx-160",
    name: "Honda PCX 160",
    type: "Matic Premium",
    category: "matic",
    otr: 37500000,
    colors: [
      { name: "Pearl Nightstar Black", hex: "#1A1A1A" },
      { name: "Precious White Pearl", hex: "#F5F5F5" },
      { name: "Shiny Red", hex: "#CC0000" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/pcx160-black.webp",
    spec_url: "https://www.astra-honda.com/product/pcx-160",
    specs: {
      "Mesin": "156.9 cc, 4-Tak",
      "Tenaga": "15.8 PS / 8.500 rpm",
      "Torsi": "14.7 Nm / 6.500 rpm",
      "Transmisi": "Otomatis CVT",
      "Fitur": "Smart Key, LED, USB Charger",
    }
  },
  {
    id: "adv-160",
    name: "Honda ADV 160",
    type: "Adventure Scooter",
    category: "matic",
    otr: 40800000,
    colors: [
      { name: "Pearl Nightstar Black", hex: "#1A1A1A" },
      { name: "Mat Gunpowder Black", hex: "#2A2A2A" },
      { name: "Mat Dusk Silver", hex: "#8A8A8A" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/adv160.webp",
    spec_url: "https://www.astra-honda.com/product/adv-160",
    specs: {
      "Mesin": "156.9 cc, 4-Tak",
      "Tenaga": "15.8 PS / 8.500 rpm",
      "Torsi": "14.7 Nm / 6.500 rpm",
      "Transmisi": "Otomatis CVT",
      "Fitur": "All-terrain, Smart Key, HSTC",
    }
  },

  // ==================== SPORT ====================
  {
    id: "cb150r",
    name: "Honda CB150R Streetfire",
    type: "Sport Naked",
    category: "sport",
    otr: 35900000,
    colors: [
      { name: "Sports Red", hex: "#CC0000" },
      { name: "Mat Gunpowder Black", hex: "#1A1A1A" },
      { name: "Mat Sword Silver", hex: "#8A8A8A" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/cb150r-red.webp",
    spec_url: "https://www.astra-honda.com/product/cb150r-streetfire",
    specs: {
      "Mesin": "149.16 cc, 4-Tak DOHC",
      "Tenaga": "16.8 PS / 10.000 rpm",
      "Torsi": "13.8 Nm / 8.500 rpm",
      "Transmisi": "Manual 6-Speed",
    }
  },
  {
    id: "cbr150r",
    name: "Honda CBR150R",
    type: "Sport Fairing",
    category: "sport",
    otr: 37900000,
    colors: [
      { name: "Grand Prix Red", hex: "#CC0000" },
      { name: "Mat Gunpowder Black", hex: "#1A1A1A" },
      { name: "Honda Racing Blue", hex: "#003087" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/cbr150r-red.webp",
    spec_url: "https://www.astra-honda.com/product/cbr150r",
    specs: {
      "Mesin": "149.16 cc, 4-Tak DOHC",
      "Tenaga": "16.8 PS / 10.000 rpm",
      "Torsi": "13.8 Nm / 8.500 rpm",
      "Transmisi": "Manual 6-Speed",
      "Fitur": "Quick Shifter (opsional)",
    }
  },
  {
    id: "sonic150r",
    name: "Honda Sonic 150R",
    type: "Sport Bebek",
    category: "sport",
    otr: 28700000,
    colors: [
      { name: "Speed Red", hex: "#CC0000" },
      { name: "Mat Gunpowder Black", hex: "#1A1A1A" },
      { name: "Titanium White", hex: "#E0E0E0" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/sonic150r.webp",
    spec_url: "https://www.astra-honda.com/product/sonic-150r",
    specs: {
      "Mesin": "149.16 cc, 4-Tak DOHC",
      "Tenaga": "16.2 PS / 9.000 rpm",
      "Torsi": "13.5 Nm / 6.500 rpm",
      "Transmisi": "Manual 6-Speed",
    }
  },

  // ==================== BEBEK ====================
  {
    id: "revo",
    name: "Honda Revo Fit",
    type: "Bebek",
    category: "bebek",
    otr: 16700000,
    colors: [
      { name: "Red", hex: "#CC0000" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Dark Silver", hex: "#6A6A6A" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/revo-red.webp",
    spec_url: "https://www.astra-honda.com/product/revo-fit",
    specs: {
      "Mesin": "109.1 cc, 4-Tak",
      "Tenaga": "8.41 PS / 7.000 rpm",
      "Torsi": "8.86 Nm / 5.500 rpm",
      "Transmisi": "Manual 4-Speed",
    }
  },
  {
    id: "supra-x",
    name: "Honda Supra X 125 FI",
    type: "Bebek",
    category: "bebek",
    otr: 19800000,
    colors: [
      { name: "Red", hex: "#CC0000" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#F0F0F0" },
    ],
    img: "https://www.astra-honda.com/storage/product_color_image/2024/supra-x125.webp",
    spec_url: "https://www.astra-honda.com/product/supra-x-125-fi",
    specs: {
      "Mesin": "124.8 cc, 4-Tak",
      "Tenaga": "9.7 PS / 7.500 rpm",
      "Torsi": "10.74 Nm / 6.000 rpm",
      "Transmisi": "Manual 4-Speed",
    }
  },
];

// ---- TABEL BUNGA KREDIT (%) per TENOR ----
// Sesuaikan dengan program leasing yang berlaku
const BUNGA_TABLE = {
  12: 2.95,   // % bunga flat per bulan x tenor
  24: 5.50,
  36: 8.25,
  48: 11.00,
};

// ---- FUNGSI HELPER ----
function formatRupiah(num) {
  if (!num && num !== 0) return "Rp —";
  return "Rp " + Math.round(num).toLocaleString("id-ID");
}

function hitungCicilan(otr, dpPct, tenor, pelwil) {
  const dpBase = Math.round(otr * dpPct / 100);
  const totalDp = dpBase + pelwil;
  const pokok = otr - dpBase;
  const bungaPct = BUNGA_TABLE[tenor] || 8.25;
  const totalBunga = pokok * bungaPct / 100;
  const totalBayar = pokok + totalBunga;
  const cicilan = Math.round(totalBayar / tenor);
  return { dpBase, totalDp, pokok, cicilan, bungaPct, totalBayar };
}
