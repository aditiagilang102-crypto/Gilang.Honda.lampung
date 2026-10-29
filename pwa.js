(function () {
  "use strict";
  const root = document.getElementById("honda-app");
  if (!root) return;
  const find = name => root.querySelector(`[data-pwa="${name}"]`);
  const installBanner = find("install-banner");
  const installButton = find("install");
  const dialog = find("dialog");
  const updateButton = find("update");
  const displayMode = window.matchMedia("(display-mode: standalone)");
  const base = new URL("./", document.currentScript.src);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  let installPrompt = null;
  let registration = null;
  let installed = false;
  let reloading = false;

  function syncInstalled() {
    installBanner.hidden = installed || displayMode.matches || navigator.standalone === true;
  }
  function syncConnection() {
    find("offline").hidden = navigator.onLine !== false;
  }
  function selectPlatform(platform) {
    root.querySelectorAll("[data-pwa-platform]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.pwaPlatform === platform));
    });
    find("android-guide").hidden = platform !== "android";
    find("ios-guide").hidden = platform !== "ios";
  }
  function openGuide() {
    selectPlatform(isIOS ? "ios" : "android");
    find("secure-note").hidden = window.isSecureContext && location.protocol !== "file:";
    if (!dialog.open) dialog.showModal();
    find("close").focus();
  }
  function showUpdate() {
    if (!registration?.waiting) return;
    find("update-banner").hidden = false;
    updateButton.disabled = false;
  }
  function saveSelection() {
    root.dispatchEvent(new Event("simulasi-motor:before-update"));
  }
  function reloadForUpdate() {
    if (reloading) return;
    reloading = true;
    saveSelection();
    location.reload();
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    syncInstalled();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    installPrompt = null;
    if (dialog.open) dialog.close();
    syncInstalled();
  });
  installButton.addEventListener("click", async () => {
    if (!installPrompt) { openGuide(); return; }
    const prompt = installPrompt;
    installPrompt = null;
    installButton.disabled = true;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") {
        installed = true;
        syncInstalled();
      }
    } catch (_) { openGuide(); }
    finally { installButton.disabled = false; }
  });
  find("close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { if (!installBanner.hidden) installButton.focus(); });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  root.querySelectorAll("[data-pwa-platform]").forEach(button => {
    button.addEventListener("click", () => selectPlatform(button.dataset.pwaPlatform));
  });
  if (displayMode.addEventListener) displayMode.addEventListener("change", syncInstalled);
  else if (displayMode.addListener) displayMode.addListener(syncInstalled);
  window.addEventListener("offline", syncConnection);
  window.addEventListener("online", () => {
    syncConnection();
    registration?.update().catch(() => {});
  });
  syncInstalled();
  syncConnection();

  if (!("serviceWorker" in navigator) || !window.isSecureContext || location.protocol === "file:") return;
  let hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Instalasi pertama tidak mengganggu simulasi yang sedang dibuka.
    if (hadController) reloadForUpdate();
    hadController = true;
  });
  updateButton.addEventListener("click", () => {
    const waiting = registration?.waiting;
    if (!waiting) { registration?.update().catch(() => {}); return; }
    updateButton.disabled = true;
    find("update-message").textContent = "Memuat versi terbaru. Pilihan simulasi kamu akan dipulihkan.";
    waiting.postMessage({ type: "SIMULASI_MOTOR_SKIP_WAITING" });
    setTimeout(() => {
      if (reloading) return;
      updateButton.disabled = false;
      find("update-message").textContent = "Pembaruan belum selesai. Coba lagi setelah koneksi stabil.";
    }, 15000);
  });
  navigator.serviceWorker.register(new URL("sw.js", base).href, {
    scope: base.pathname,
    updateViaCache: "none"
  }).then(value => {
    registration = value;
    showUpdate();
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) showUpdate();
      });
    });
    registration.update().catch(() => {});
  }).catch(() => {
    // Jika penyimpanan browser dibatasi, simulator online tetap berjalan.
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      syncConnection();
      registration?.update().catch(() => {});
      showUpdate();
    }
  });
})();

