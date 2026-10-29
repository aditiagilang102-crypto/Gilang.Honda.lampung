(function () {
  "use strict";
  const root = document.getElementById("honda-app");
  if (!root) return;
  const ui = name => root.querySelector(`[data-ui="${name}"]`);
  const source = typeof DATA_MOTOR === "undefined" ? [] : DATA_MOTOR;
  const photos = typeof FOTO_UNIT === "undefined" ? {} : FOTO_UNIT;
  const config = globalThis.SIM_CONFIG || {};
  if (typeof HondaCredit === "undefined") {
    ui("error").textContent = "Simulasi belum terbaca. Pastikan credit-engine.js ada di folder website.";
    ui("error").hidden = false;
    return;
  }
  if (typeof PelWil === "undefined") {
    ui("error").textContent = "Data wilayah belum terbaca. Pastikan pelwil.js ada di folder website.";
    ui("error").hidden = false;
    return;
  }
  const engine = HondaCredit.create(source, { modelId: config.initialModel, dp: config.initialDP, tenor: config.initialTenor });
  const comparison = HondaCredit.create(source);
  let pelwilRegion = "bandar-lampung";
  let specCategory = "engine";
  let specKey = "";
  const specTabs = Array.from(root.querySelectorAll("[data-spec-tab]"));
  // Simpan pilihan hanya saat aplikasi memuat pembaruan, lalu pulihkan sekali.
  const updateStateKey = "simulasi-motor-update-selection";
  const legacyUpdateStateKey = "dm-kircon-update-selection";
  try {
    const saved = JSON.parse(sessionStorage.getItem(updateStateKey) || sessionStorage.getItem(legacyUpdateStateKey) || "null");
    sessionStorage.removeItem(updateStateKey);
    sessionStorage.removeItem(legacyUpdateStateKey);
    if (saved && typeof saved.id === "string" && engine.selectModel(saved.id)) {
      engine.setTenor(saved.tenor);
      engine.setDPValue(saved.dp);
      if (typeof saved.name === "string") ui("visitor-name").value = saved.name.slice(0, 100);
      if (PelWil.regions.some(region => region.id === saved.pelwilRegion)) pelwilRegion = saved.pelwilRegion;
      if (specTabs.some(tab => tab.dataset.specTab === saved.specCategory)) specCategory = saved.specCategory;
      if (typeof saved.specOpen === "boolean") ui("specifications").open = saved.specOpen;
    }
  } catch (_) { /* Penyimpanan mungkin dibatasi oleh browser. */ }
  root.addEventListener("simulasi-motor:before-update", () => {
    const current = engine.snapshot();
    if (!current) return;
    try {
      sessionStorage.setItem(updateStateKey, JSON.stringify({
        id: current.id, tenor: current.tenor, dp: current.dp, name: ui("visitor-name").value,
        pelwilRegion, specCategory, specOpen: ui("specifications").open
      }));
    } catch (_) { /* Pembaruan tetap bisa berjalan tanpa penyimpanan. */ }
  });
  const money = HondaCredit.money;
  const catalog = ui("catalog");
  const search = ui("catalog-search");
  let imageVersion = 0;
  let visibleModel = "";
  let announcementTimer;
  let previousOpener;
  let rateTenorKey = "";

  const TENOR_INFO = {
    11: {
      months: 12,
      label: "12 bulan",
      cutBadge: "",
      cutNote: "Tenor reguler 12 bulan. (Potongan angsuran khusus tenor 24, 30, & 36 bulan).",
      summaryDetail: "Tenor reguler 12 bulan",
      waText: "12 bulan"
    },
    17: {
      months: 18,
      label: "18 bulan",
      cutBadge: "",
      cutNote: "Tenor reguler 18 bulan. (Potongan angsuran khusus tenor 24, 30, & 36 bulan).",
      summaryDetail: "Tenor reguler 18 bulan",
      waText: "18 bulan"
    },
    23: {
      months: 23,
      label: "23 bulan",
      cutBadge: "Pot. 1x (24 bln)",
      cutNote: "Tenor 24 bulan sudah potongan 1 bulan jadi 23 bulan.",
      summaryDetail: "Tenor 24 bulan · potongan 1 bulan",
      waText: "23 bulan (tenor 24 bln potong 1 bln)"
    },
    29: {
      months: 28,
      label: "28 bulan",
      cutBadge: "Pot. 2x (30 bln)",
      cutNote: "Tenor 30 bulan sudah potongan 2 bulan jadi 28 bulan.",
      summaryDetail: "Tenor 30 bulan · potongan 2 bulan",
      waText: "28 bulan (tenor 30 bln potong 2 bln)"
    },
    35: {
      months: 33,
      label: "33 bulan",
      cutBadge: "Pot. 3–5x (36 bln)",
      cutNote: "Tenor 36 bulan sudah potongan 3 bulan jadi 33 bulan (bisa potongan 5 bulan jadi 31 bulan tergantung data).",
      summaryDetail: "Tenor 36 bulan · potongan 3 bulan\n(bisa potong 5 bulan jadi 31 bulan tergantung data)",
      waText: "33 bulan (tenor 36 bln potong 3 bln, bisa potong 5 bln jadi 31 bln tergantung data)"
    }
  };

  function getTenorInfo(month) {
    return TENOR_INFO[month] || {
      months: month,
      label: `${month} bulan`,
      cutBadge: "",
      cutNote: "",
      summaryDetail: "",
      waText: `${month} bulan`
    };
  }

  function displayName(value) {
    const capitals = new Set(["CBS", "ISS", "ABS", "EVO", "CW", "SW", "STD", "SE", "RD", "BK", "MH", "R", "X", "RS", "EM1", "CUV", "CB", "CBR", "PCX", "ADV", "GTR"]);
    return String(value).split(/\s+/).map(word => capitals.has(word) || /^\d/.test(word) ? word : word.charAt(0) + word.slice(1).toLowerCase()).join(" ");
  }

  function range(input, index, count, text) {
    input.min = "0";
    input.max = String(Math.max(0, count - 1));
    input.step = "1";
    input.value = String(index);
    input.disabled = count < 2;
    input.setAttribute("aria-valuetext", text);
    input.style.setProperty("--hm-fill", `${count > 1 ? index / (count - 1) * 100 : 0}%`);
  }

  function updatePhoto(state) {
    if (visibleModel === state.id) return;
    visibleModel = state.id;
    const version = ++imageVersion;
    const photo = document.createElement("img");
    photo.className = "hm-main-photo";
    photo.dataset.ui = "main-photo";
    photo.width = 780;
    photo.height = 410;
    photo.decoding = "async";
    photo.alt = `Honda ${state.nama}: seluruh pilihan warna pada foto unit`;
    photo.hidden = true;
    ui("main-photo").replaceWith(photo);
    const notice = ui("photo-message");
    notice.hidden = false;
    const path = photos[state.id];
    ui("photo-link").removeAttribute("href");
    if (typeof path !== "string" || !path.trim()) {
      notice.textContent = `Foto ${displayName(state.nama)} belum tersedia.`;
      return;
    }
    notice.textContent = "Memuat foto motor…";
    photo.addEventListener("load", () => {
      if (version !== imageVersion) return;
      photo.hidden = false;
      notice.hidden = true;
    });
    photo.addEventListener("error", () => {
      if (version !== imageVersion) return;
      photo.hidden = true;
      notice.hidden = false;
      notice.textContent = "Foto belum dapat dimuat. Pilihan cicilan tetap bisa digunakan.";
    });
    ui("photo-link").href = path;
    ui("photo-link").setAttribute("aria-label", `Perbesar foto semua warna Honda ${state.nama}`);
    photo.src = path;
  }

  function updateTenorRates(state) {
    const container = ui("tenor-rates");
    if (!container) return;
    const key = state.tenors.join(",");
    if (key !== rateTenorKey) {
      rateTenorKey = key;
      container.replaceChildren();
      state.tenors.forEach(month => {
        const info = getTenorInfo(month);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "hm-tenor-rate-button";
        button.dataset.tenor = String(month);
        const period = document.createElement("span");
        period.className = "hm-tenor-rate-period";
        period.textContent = info.label;
        button.appendChild(period);
        if (info.cutBadge) {
          const cut = document.createElement("small");
          cut.className = "hm-tenor-rate-cut";
          cut.textContent = info.cutBadge;
          button.appendChild(cut);
        }
        const quote = document.createElement("span");
        quote.className = "hm-tenor-rate-quote";
        const value = document.createElement("strong");
        value.className = "hm-tenor-rate-value";
        const suffix = document.createElement("small");
        suffix.textContent = "/bulan";
        const dpNote = document.createElement("small");
        dpNote.className = "hm-tenor-rate-dp-note";
        dpNote.hidden = true;
        quote.append(value, suffix, dpNote);
        button.appendChild(quote);
        button.addEventListener("click", () => { engine.setTenor(month); render(); });
        container.appendChild(button);
      });
    }
    ui("tenor-rates-dp").textContent = `DP dasar ${money(state.dp)}`;
    const activeInfo = getTenorInfo(state.tenor);
    const cutNoteEl = ui("tenor-cut-note");
    if (cutNoteEl) {
      cutNoteEl.textContent = activeInfo.cutNote;
      cutNoteEl.hidden = !activeInfo.cutNote;
    }
    // Gunakan engine terpisah agar membandingkan tenor tidak mengubah simulasi.
    comparison.selectModel(state.id);
    container.querySelectorAll("button").forEach(button => {
      const month = Number(button.dataset.tenor);
      const info = getTenorInfo(month);
      comparison.setTenor(month);
      comparison.setDPValue(state.dp);
      const quote = comparison.snapshot();
      const dpNote = button.querySelector(".hm-tenor-rate-dp-note");
      button.querySelector(".hm-tenor-rate-value").textContent = money(quote.angsuran);
      dpNote.hidden = quote.dp === state.dp;
      dpNote.textContent = quote.dp === state.dp ? "" : `DP ${money(quote.dp)}`;
      button.setAttribute("aria-pressed", String(month === state.tenor));
      button.setAttribute("aria-label", `Pilih ${info.label}${info.cutBadge ? ` (${info.cutBadge})` : ""}, angsuran ${money(quote.angsuran)} per bulan, DP ${money(quote.dp)}`);
    });
  }

  function updatePelwil(state) {
    const quote = PelWil.quote(state.dp, pelwilRegion);
    ui("pelwil-region-field").hidden = false;
    ui("pelwil-region").value = pelwilRegion;
    if (ui("pelwil-fee")) ui("pelwil-fee").textContent = "Rp -";
    if (ui("pelwil-outside")) ui("pelwil-outside").textContent = "Rp -";
    if (ui("pelwil-bbn")) ui("pelwil-bbn").textContent = "Rp -";
    if (ui("pelwil-shipping")) ui("pelwil-shipping").textContent = "Rp -";
    ui("pelwil-note").textContent = quote.valid
      ? `Wilayah KTP: ${quote.region} — Siap proses & gratis ongkir.`
      : "Pilih wilayah sesuai KTP.";
    ui("summary-dp").textContent = money(state.dp);
    ui("summary-detail").textContent = quote.valid
      ? `DP dasar ${money(state.dp)} (belum potong diskon promo)\nWilayah KTP: ${quote.region}`
      : `DP dasar ${money(state.dp)}`;
  }

  function updateSpecs(state) {
    const key = `${state.id}:${specCategory}`;
    if (key === specKey) return;
    specKey = key;
    const spec = globalThis.HondaSpecs?.get(state.id);
    const categoryTab = specTabs.find(tab => tab.dataset.specTab === specCategory);
    specTabs.forEach(tab => {
      const selected = tab.dataset.specTab === specCategory;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    ui("spec-panel").setAttribute("aria-labelledby", categoryTab.id);
    ui("spec-panel").scrollTop = 0;
    ui("spec-caption").textContent = `${categoryTab.textContent} — ${displayName(state.nama)}`;
    const rows = ui("spec-rows");
    rows.replaceChildren();
    const values = spec?.categories[specCategory] || [];
    values.forEach(([label, value]) => {
      const row = document.createElement("tr");
      const heading = document.createElement("th");
      heading.scope = "row";
      heading.textContent = label;
      const detail = document.createElement("td");
      detail.textContent = value;
      row.append(heading, detail);
      rows.appendChild(row);
    });
    ui("spec-message").hidden = values.length > 0;
    ui("spec-message").textContent = spec
      ? "Kategori ini belum dirinci pada sumber resmi. Lihat spesifikasi lengkap di bawah."
      : "Spesifikasi unit ini belum tersedia. Buka situs resmi Honda melalui tautan di bawah.";
    ui("spec-link").href = spec?.url || "https://www.astra-honda.com/product";
    ui("spec-link").setAttribute("aria-label", `Lihat spesifikasi lengkap ${spec?.title || displayName(state.nama)} di situs Astra Honda Motor`);
    ui("spec-family-note").textContent = spec
      ? `Data keluarga ${spec.title}. Keterangan varian mengikuti sumber resmi.` : "Sumber: Astra Honda Motor.";
  }

  function updateWhatsapp() {
    const name = ui("visitor-name").value;
    const baseLink = engine.whatsapp(name, config.whatsappPhone || "6281234567890");
    const state = engine.snapshot();
    const help = ui("help-whatsapp");
    let promoLink = "";
    let availabilityLink = "";
    if (state && baseLink) {
      const quote = PelWil.quote(state.dp, pelwilRegion);
      const link = new URL(baseLink);
      const visitor = String(name).replace(/\*/g, "").replace(/\s+/g, " ").trim();
      const promoIntro = visitor ? `Kak, saya *${visitor}*` : "Kak, saya";
      const details = quote.valid ? [
        `Wilayah KTP: ${quote.region}.`,
        `Total DP: ${money(state.dp)}.`
      ] : [
        `Total DP: ${money(state.dp)}.`
      ];
      const tenorInfo = getTenorInfo(state.tenor);
      const message = [
        `${promoIntro} tertarik banget sama *${state.nama}* nih`,
        `OTR: ${money(state.otr)}. DP dasar: ${money(state.dp)}.`,
        ...details,
        `Tenor: ${tenorInfo.waText}. Angsuran: ${money(state.angsuran)}/bulan.`,
        "Saya mau ajukan diskon atau promo yang sedang berjalan."
      ].join("\n");
      link.searchParams.set("text", message);
      promoLink = link.href;
      const intro = visitor ? `Halo Kak, saya ${visitor}.` : "Halo Kak.";
      link.searchParams.set("text", `${intro} Apakah unit *${state.nama}* tersedia? Mohon info stok dan pilihan warnanya. Terima kasih.`);
      availabilityLink = link.href;
    }
    help?.setAttribute("aria-label", state
      ? `Tanyakan ketersediaan ${displayName(state.nama)} lewat WhatsApp`
      : "Tanyakan ketersediaan unit lewat WhatsApp");
    [[ui("whatsapp"), promoLink], [ui("floating-whatsapp"), promoLink], [help, availabilityLink]].forEach(([button, link]) => {
      if (!button) return;
      if (link) {
        button.href = link;
        button.setAttribute("aria-disabled", "false");
      } else {
        button.removeAttribute("href");
        button.setAttribute("aria-disabled", "true");
      }
    });
  }

  function render(announce = true) {
    const state = engine.snapshot();
    if (!state) {
      ui("error").textContent = "Data kredit belum terbaca. Pastikan data-motor.js ada di folder website.";
      ui("error").hidden = false;
      root.querySelectorAll("button").forEach(button => { button.disabled = true; });
      ui("photo-message").textContent = "Foto akan tampil setelah data motor tersedia.";
      updateWhatsapp();
      return;
    }
    ui("model-name").textContent = displayName(state.nama);
    const modelOptions = Array.from(ui("model-select").querySelectorAll("option"));
    ui("model-select").value = modelOptions.some(option => option.value === state.id) ? state.id : "";
    ui("otr").textContent = money(state.otr);
    ui("dp-value").textContent = money(state.dp);
    ui("dp-percent").textContent = `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(state.dp / state.otr * 100)}% dari OTR`;
    const tenorInfo = getTenorInfo(state.tenor);
    ui("monthly-value").textContent = money(state.angsuran);
    ui("tenor-note").textContent = tenorInfo.label;
    ui("summary-tenor").textContent = tenorInfo.label;
    const summaryTenorDetail = ui("summary-tenor-detail");
    if (summaryTenorDetail) {
      summaryTenorDetail.textContent = tenorInfo.summaryDetail;
      summaryTenorDetail.hidden = !tenorInfo.summaryDetail;
    }
    ui("summary-monthly").textContent = money(state.angsuran);
    ui("dp-min").textContent = money(state.dpMin);
    ui("dp-max").textContent = money(state.dpMax);
    ui("monthly-min").textContent = money(state.rateMin);
    ui("monthly-max").textContent = money(state.rateMax);
    root.querySelectorAll('[data-ui="model-count"]').forEach(item => { item.textContent = String(engine.models.length); });
    range(ui("dp-slider"), state.dpIndex, state.dpCount, money(state.dp));
    range(ui("monthly-slider"), state.rateIndex, state.rateCount, `${money(state.angsuran)} per bulan`);
    ui("dp-minus").disabled = state.dpIndex === 0;
    ui("dp-plus").disabled = state.dpIndex === state.dpCount - 1;
    ui("monthly-minus").disabled = state.rateIndex === 0;
    ui("monthly-plus").disabled = state.rateIndex === state.rateCount - 1;
    updateTenorRates(state);
    updatePelwil(state);
    updateSpecs(state);
    updatePhoto(state);
    updateWhatsapp();
    if (announce) {
      clearTimeout(announcementTimer);
      announcementTimer = setTimeout(() => {
        const live = engine.snapshot();
        const liveTenor = getTenorInfo(live.tenor);
        const quote = PelWil.quote(live.dp, pelwilRegion);
        const regionText = quote.valid ? `Wilayah KTP ${quote.region}.` : "";
        ui("live-summary").textContent = `${displayName(live.nama)}. DP ${money(live.dp)}. ${regionText} Angsuran ${money(live.angsuran)} per bulan. Tenor ${liveTenor.label}.`;
      }, 220);
    }
  }

  function renderCatalog() {
    const matches = engine.search(search.value);
    const selected = engine.snapshot()?.id;
    const grid = ui("catalog-grid");
    grid.replaceChildren();
    ui("catalog-status").textContent = matches.length ? `${matches.length} pilihan motor tersedia.` : "Motor belum ditemukan. Coba kata kunci lain.";
    matches.forEach(model => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "hm-unit-choice";
      button.dataset.modelId = model.id;
      button.setAttribute("aria-pressed", String(model.id === selected));
      if (photos[model.id]) {
        const image = document.createElement("img");
        image.alt = "";
        image.loading = "lazy";
        image.decoding = "async";
        image.width = 240;
        image.height = 108;
        image.src = photos[model.id];
        image.addEventListener("error", () => { image.hidden = true; });
        button.appendChild(image);
      }
      const heading = document.createElement("strong");
      heading.textContent = displayName(model.nama);
      const price = document.createElement("span");
      price.textContent = `OTR ${money(model.otr)}`;
      button.append(heading, price);
      button.addEventListener("click", () => {
        engine.selectModel(model.id);
        ui("model-search").value = "";
        renderModelOptions();
        render();
        catalog.close();
        if (previousOpener) previousOpener.focus();
      });
      grid.appendChild(button);
    });
  }

  function renderModelOptions() {
    const matches = engine.search(ui("model-search").value);
    const select = ui("model-select");
    const selected = engine.snapshot()?.id;
    select.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.textContent = matches.length ? "Pilih tipe motor" : "Motor tidak ditemukan";
    select.appendChild(placeholder);
    matches.forEach(model => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.nama.toUpperCase();
      select.appendChild(option);
    });
    select.value = matches.some(model => model.id === selected) ? selected : "";
    select.disabled = matches.length === 0;
    ui("model-search-status").textContent = ui("model-search").value.trim()
      ? (matches.length ? `${matches.length} pilihan ditemukan. Pilih motor dari daftar.` : "Motor belum ditemukan. Coba kata kunci lain.") : "";
  }
  ui("model-search").addEventListener("input", renderModelOptions);
  ui("model-select").addEventListener("change", event => {
    if (!engine.selectModel(event.target.value)) return;
    ui("model-search").value = "";
    renderModelOptions();
    render();
  });
  renderModelOptions();

  root.querySelectorAll('[data-ui="open-catalog"]').forEach(button => button.addEventListener("click", () => {
    previousOpener = button;
    search.value = "";
    renderCatalog();
    catalog.showModal();
    search.focus();
  }));
  ui("close-catalog").addEventListener("click", () => catalog.close());
  search.addEventListener("input", renderCatalog);
  catalog.addEventListener("click", event => {
    if (event.target !== catalog) return;
    const bounds = catalog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) catalog.close();
  });
  ui("dp-slider").addEventListener("input", event => { engine.setDPIndex(event.target.value); render(); });
  ui("monthly-slider").addEventListener("input", event => { engine.setRateIndex(event.target.value); render(); });
  ui("dp-minus").addEventListener("click", () => { engine.setDPIndex(engine.snapshot().dpIndex - 1); render(); });
  ui("dp-plus").addEventListener("click", () => { engine.setDPIndex(engine.snapshot().dpIndex + 1); render(); });
  ui("monthly-minus").addEventListener("click", () => { engine.setRateIndex(engine.snapshot().rateIndex - 1); render(); });
  ui("monthly-plus").addEventListener("click", () => { engine.setRateIndex(engine.snapshot().rateIndex + 1); render(); });
  ui("visitor-name").addEventListener("input", updateWhatsapp);
  PelWil.regions.forEach(region => {
    const option = document.createElement("option");
    option.value = region.id;
    option.textContent = region.name;
    ui("pelwil-region").appendChild(option);
  });
  ui("pelwil-region").addEventListener("change", event => {
    pelwilRegion = event.target.value;
    render();
  });
  function selectSpec(tab, focus = false) {
    specCategory = tab.dataset.specTab;
    const state = engine.snapshot();
    if (state) updateSpecs(state);
    if (focus) tab.focus();
  }
  specTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectSpec(tab));
    tab.addEventListener("keydown", event => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % specTabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + specTabs.length) % specTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = specTabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectSpec(specTabs[next], true);
    });
  });
  render(false);
})();
