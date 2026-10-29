/* Semua nilai berasal dari tabel kredit. Tidak menggunakan rumus bunga perkiraan. */
(function (global) {
  "use strict";
  const normalize = value => String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
  const money = value => "Rp " + new Intl.NumberFormat("id-ID").format(value);
  const clampIndex = (value, length) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.min(length - 1, Math.round(number))) : 0;
  };
  const TENOR_ALIAS = { 12: 11, 18: 17, 24: 23, 28: 29, 30: 29, 31: 35, 33: 35, 36: 35 };
  const TENOR_LABEL = { 11: 12, 17: 18, 23: 23, 29: 28, 35: 33 };
  function resolveTenorKey(value) {
    const num = Number(value);
    return TENOR_ALIAS[num] ?? num;
  }
  function create(modelsInput, options = {}) {
    const models = (Array.isArray(modelsInput) ? modelsInput : []).filter(model =>
      model && model.id && Number.isFinite(model.otr) && model.otr > 0 && Array.isArray(model.paket)
      && model.paket.some(p => Number.isFinite(p.dp) && p.dp >= 0 && Object.values(p.angsuran || {}).some(n => Number.isFinite(n) && n > 0)));
    let model = null, tenor = 35, dpIndex = 0, packages = [], rates = [], tenors = [];
    function nearestDP(value) {
      return packages.reduce((best, item, index) => Math.abs(item.dp - value) < Math.abs(packages[best].dp - value) ? index : best, 0);
    }
    function rebuild(desiredDP) {
      packages = model.paket.filter(p => Number.isFinite(p.dp) && p.dp >= 0 && Number.isFinite(p.angsuran?.[tenor]) && p.angsuran[tenor] > 0).slice().sort((a, b) => a.dp - b.dp);
      dpIndex = nearestDP(desiredDP);
      const groups = new Map();
      packages.forEach((p, index) => {
        const rate = p.angsuran[tenor];
        if (!groups.has(rate)) groups.set(rate, []);
        groups.get(rate).push(index);
      });
      rates = Array.from(groups, ([value, indices]) => ({ value, indices })).sort((a, b) => a.value - b.value);
    }
    function selectModel(id) {
      const next = models.find(item => item.id === id);
      if (!next) return false;
      const desiredDP = packages[dpIndex]?.dp ?? options.dp ?? 3000000;
      model = next;
      tenors = [...new Set(model.paket.flatMap(p => Object.keys(p.angsuran || {}).filter(key => Number.isFinite(p.angsuran[key]) && p.angsuran[key] > 0).map(Number)))].filter(n => Number.isInteger(n) && n > 0).sort((a, b) => a - b);
      if (!tenors.includes(tenor)) tenor = tenors[tenors.length - 1];
      rebuild(desiredDP);
      return true;
    }
    function snapshot() {
      if (!model || !packages.length || !rates.length) return null;
      const p = packages[dpIndex];
      const monthly = p.angsuran[tenor];
      return {
        id: model.id, nama: model.nama, otr: model.otr, dp: p.dp, tenor, angsuran: monthly,
        dpIndex, dpCount: packages.length, dpMin: packages[0].dp, dpMax: packages[packages.length - 1].dp,
        rateIndex: rates.findIndex(r => r.value === monthly), rateCount: rates.length,
        rateMin: rates[0].value, rateMax: rates[rates.length - 1].value,
        tenors: tenors.slice()
      };
    }
    function setTenor(value) {
      const next = resolveTenorKey(value);
      if (!model || !tenors.includes(next)) return snapshot();
      const wantedDP = packages[dpIndex]?.dp ?? 3000000;
      tenor = next;
      rebuild(wantedDP);
      return snapshot();
    }
    function setDPIndex(value) {
      if (!packages.length) return null;
      dpIndex = clampIndex(value, packages.length);
      return snapshot();
    }
    function setDPValue(value) {
      if (!packages.length || !Number.isFinite(Number(value))) return snapshot();
      dpIndex = nearestDP(Number(value));
      return snapshot();
    }
    function setRateIndex(value) {
      if (!rates.length) return null;
      const group = rates[clampIndex(value, rates.length)];
      const previous = packages[dpIndex].dp;
      dpIndex = group.indices.reduce((best, index) => Math.abs(packages[index].dp - previous) < Math.abs(packages[best].dp - previous) ? index : best, group.indices[0]);
      return snapshot();
    }
    function choices() {
      return {
        dp: packages.map((item, index) => ({ index, value: item.dp })),
        monthly: rates.map((item, index) => ({ index, value: item.value }))
      };
    }
    function search(query) {
      const words = String(query ?? "").trim().split(/\s+/).map(normalize).filter(Boolean);
      return models.filter(item => words.every(word => normalize(item.nama).includes(word)));
    }
    function whatsapp(name, phone = "6285603020999") {
      const current = snapshot();
      if (!current) return "";
      let number = String(phone).replace(/\D/g, "");
      if (number.startsWith("0")) number = "62" + number.slice(1);
      if (!/^[1-9]\d{6,14}$/.test(number)) return "";
      const visitor = String(name ?? "").replace(/\*/g, "").replace(/\s+/g, " ").trim();
      const intro = visitor ? `Kak, saya *${visitor}*` : "Kak, saya";
      const compactMoney = value => money(value).replace(/\s/g, "");
      const text = [
        `${intro} tertarik banget sama ${current.nama} nih ð`,
        `Kalau OTR-nya ${compactMoney(current.otr)}, saya rencana ambil DP ${compactMoney(current.dp)} dengan tenor ${TENOR_LABEL[current.tenor] || current.tenor} bulan dan angsuran ${compactMoney(current.angsuran)}/bulan.`,
        "Nah, kebetulan saya mau coba ajukan diskon atau promo yang sedang berjalan.",
        "Kira-kira setelah dapat promo, DP dan angsurannya bisa jadi berapa ya, Kak? ðð»ð¥"
      ].join(" ");
      return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    }
    const initial = models.find(item => item.id === options.modelId) || models.find(item => item.id === "vario-evo-160-cbs") || models[0];
    if (initial) selectModel(initial.id);
    if (options.tenor) setTenor(options.tenor);
    return { snapshot, selectModel, setTenor, setDPIndex, setDPValue, setRateIndex, choices, search, whatsapp, models: models.slice() };
  }
  global.HondaCredit = { create, money };
  if (typeof module !== "undefined" && module.exports) module.exports = global.HondaCredit;
})(globalThis);

