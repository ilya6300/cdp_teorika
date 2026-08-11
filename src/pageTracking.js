const STORAGE_KEY = "teorika_page_tracking";

let pageStartTime = 0;
let hasSaved = false;

function buildVisitPayload() {
  const durationSec = Math.max(
    0,
    Math.floor((Date.now() - pageStartTime) / 1000)
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
    const raw = localStorage.getItem(STORAGE_KEY);
    let visits = [];

    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          visits = parsed;
        }
      } catch {
        visits = [];
      }
    }

    visits.push(buildVisitPayload());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch (error) {
    console.error("Ошибка сохранения page tracking:", error);
  }
}

export function initPageTracking() {
  pageStartTime = Date.now();
  hasSaved = false;

  window.addEventListener("pagehide", saveVisit);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      saveVisit();
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      pageStartTime = Date.now();
      hasSaved = false;
    }
  });
}
