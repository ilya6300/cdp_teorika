import { sendPageTracking } from "./service/api/api.request";

const STORAGE_KEY = "teorika_page_tracking";

let pageStartTime = 0;
let hasSaved = false;

export function checkPlatform() {
  const userAgent = navigator.userAgent;
  const isMobile =
    /mobile|iphone|ipad|android|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase(),
    );

  if (isMobile) {
    console.log("Пользователь зашел с телефона или планшета");
    const result = { device_type: "Mobile", description: userAgent };
    return result;
  } else {
    console.log("Пользователь зашел с ПК");
    const result = { device_type: "PC", description: userAgent };
    return result;
  }
}

function checkStorage() {
  if (localStorage.getItem(STORAGE_KEY)) {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

function buildVisitPayload() {
  const durationSec = Math.max(
    0,
    Math.floor((Date.now() - pageStartTime) / 1000),
  );
  const deviceInfo = checkPlatform();
  return {
    page_url: window.location.href,
    referrer: document.referrer || "",
    duration_sec: durationSec,
    entered_at: new Date(pageStartTime).toISOString(),
    left_at: new Date().toISOString(),
    device_type: deviceInfo.device_type,
    description: deviceInfo.description,
  };
}

function saveVisit() {
  if (hasSaved) {
    return;
  }
  hasSaved = true;
  try {
    const visit = buildVisitPayload();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visit));
    sendPageTracking(visit);
  } catch (error) {
    console.error("Ошибка сохранения page tracking:", error);
  }
}

export function initPageTracking() {
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
