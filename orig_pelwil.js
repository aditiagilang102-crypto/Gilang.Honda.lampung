/* Tarif dari tabel wilayah yang diberikan, 19 Oktober 2026. Nilai dalam rupiah. */
(function (global) {
  "use strict";
  const NON_BANDUNG_SHIPPING = 300000;
  const rows = [
    ["karawang", "Karawang", 0, 150000],
    ["garut", "Garut", 125000, 275000],
    ["sumedang", "Sumedang", 150000, 50000],
    ["tasik-kota", "Tasik Kota", 0, 500000],
    ["tasik-kab", "Tasik Kab", 0, 500000],
    ["ciamis", "Ciamis", 0, 700000],
    ["sukabumi-kota", "Sukabumi Kota", 0, 200000],
    ["cianjur", "Cianjur", 200000, 100000],
    ["purwakarta", "Purwakarta", 0, 200000],
    ["subang", "Subang", 0, 300000],
    ["indramayu", "Indramayu", 0, 300000],
    ["cirebon-kota", "Cirebon Kota", 0, 300000],
    ["cirebon-kab", "Cirebon Kab", 0, 300000],
    ["kuningan", "Kuningan", 0, 300000],
    ["majalengka", "Majalengka", 0, 250000],
    ["banjar", "Banjar", 0, 800000],
    ["pangandaran", "Pangandaran", 0, 800000],
    ["bekasi", "Bekasi", 0, 300000],
    ["bogor-kab", "Bogor Kab", 100000, 400000],
    ["sukabumi-kab", "Sukabumi Kab", 0, 200000]
  ];
  const regions = Object.freeze(rows.map(([id, name, outside, bbn]) => Object.freeze({ id, name, outside, bbn, fee: outside + bbn })));
  function quote(baseDP, mode = "bandung", regionId = "") {
    const dp = Number(baseDP);
    if (!Number.isSafeInteger(dp) || dp < 0) return null;
    if (mode === "bandung") return { mode, regionId: "", region: "Bandung Raya", outside: 0, bbn: 0, fee: 0, shipping: 0, additionalTotal: 0, baseDP: dp, totalDP: dp, valid: true };
    const region = mode === "non-bandung" ? regions.find(item => item.id === regionId) : null;
    if (!region) return { mode: "non-bandung", regionId: "", region: "Non-Bandung Raya (wilayah belum dipilih)", outside: null, bbn: null, fee: null, shipping: NON_BANDUNG_SHIPPING, additionalTotal: null, baseDP: dp, totalDP: null, valid: false };
    const additionalTotal = region.fee + NON_BANDUNG_SHIPPING;
    return { mode, regionId: region.id, region: region.name, outside: region.outside, bbn: region.bbn, fee: region.fee, shipping: NON_BANDUNG_SHIPPING, additionalTotal, baseDP: dp, totalDP: dp + additionalTotal, valid: true };
  }
  global.PelWil = Object.freeze({ regions, quote, NON_BANDUNG_SHIPPING });
  if (typeof module !== "undefined" && module.exports) module.exports = global.PelWil;
})(globalThis);

