const STORAGE_KEY = "teorika_page_tracking";

let pageStartTime = 0;
let hasSaved = false;

function buildVisitPayload() {
  const durationSec = Math.max(
    0,
    Math.floor((Date.now() - pageStartTime) / 1000),
  );

  return {
    page_url: window.location.href,
    referrer: document.referrer || "",
    duration_sec: durationSec,
    entered_at: new Date(pageStartTime).toISOString(),
    left_at: new Date().toISOString(),
  };
}

function saveVisit() {
  if (hasSaved) {
    return;
  }

  hasSaved = true;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildVisitPayload()));
  } catch (error) {
    console.error("Ошибка сохранения page tracking:", error);
  }
}

export function initPageTracking() {
  console.log("initPageTracking");
  pageStartTime = Date.now();
  hasSaved = false;

  // pagehide — переход, закрытие вкладки, перезагрузка
  window.addEventListener("pagehide", saveVisit);
  // fallback для браузеров, где pagehide не срабатывает
  window.addEventListener("beforeunload", saveVisit);

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      pageStartTime = Date.now();
      hasSaved = false;
    }
  });
}
