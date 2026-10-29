/* Tarif PelWil wilayah Lampung. Nilai dalam rupiah. */
/* Sesuaikan biaya PelWil (outside + bbn) dengan tabel resmi dealer Anda */
(function (global) {
  "use strict";
  const NON_BANDARLAMPUNG_SHIPPING = 0;
  const rows = [
    ["bandar-lampung",   "Bandar Lampung",       0, 0, 0],
    ["lampung-selatan",  "Lampung Selatan",      0, 0, 0],
    ["lampung-tengah",   "Lampung Tengah",       0, 0, 0],
    ["lampung-utara",    "Lampung Utara",        0, 0, 0],
    ["lampung-timur",    "Lampung Timur",        0, 0, 0],
    ["lampung-barat",    "Lampung Barat",        0, 0, 0],
    ["pesawaran",        "Pesawaran",            0, 0, 0],
    ["pringsewu",        "Pringsewu",            0, 0, 0],
    ["tanggamus",        "Tanggamus",            0, 0, 0],
    ["metro",            "Kota Metro",           0, 0, 0],
    ["way-kanan",        "Way Kanan",            0, 0, 0],
    ["tulang-bawang",    "Tulang Bawang",        0, 0, 0],
    ["tulang-bawang-b",  "Tulang Bawang Barat",  0, 0, 0],
    ["mesuji",           "Mesuji",               0, 0, 0],
    ["pesisir-barat",    "Pesisir Barat",        0, 0, 0],
  ];
  const regions = Object.freeze(rows.map(([id, name, outside, bbn, shipping]) => Object.freeze({ id, name, outside, bbn, fee: outside + bbn, shipping })));
  function quote(baseDP, modeOrRegionId = "bandar-lampung", maybeRegionId = "") {
    const dp = Number(baseDP);
    if (!Number.isSafeInteger(dp) || dp < 0) return null;
    const targetId = maybeRegionId || (modeOrRegionId === "bandarlampung" ? "bandar-lampung" : modeOrRegionId);
    const region = regions.find(item => item.id === targetId) || null;
    if (!region) return { mode: "non-bandarlampung", regionId: "", region: "Wilayah KTP belum dipilih", outside: null, bbn: null, fee: null, shipping: NON_BANDARLAMPUNG_SHIPPING, additionalTotal: null, baseDP: dp, totalDP: null, valid: false };
    const isBandarLampung = region.id === "bandar-lampung";
    const additionalTotal = region.fee + region.shipping;
    return {
      mode: isBandarLampung ? "bandarlampung" : "non-bandarlampung",
      regionId: region.id,
      region: region.name,
      outside: region.outside,
      bbn: region.bbn,
      fee: region.fee,
      shipping: region.shipping,
      additionalTotal,
      baseDP: dp,
      totalDP: dp + additionalTotal,
      valid: true
    };
  }
  global.PelWil = Object.freeze({ regions, quote, NON_BANDUNG_SHIPPING: NON_BANDARLAMPUNG_SHIPPING });
  if (typeof module !== "undefined" && module.exports) module.exports = global.PelWil;
})(globalThis);
