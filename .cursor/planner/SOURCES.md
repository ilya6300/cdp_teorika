# Реестр документации и внешних источников

> Orchestrator ведёт этот файл. Planner и Architect дополняют через Orchestrator.

---

## Проектная документация

| Документ | Путь | Описание |
|---|---|---|
| Принципы CDP-модуля | `.cursor/planner/PROJECT_PRINCIPLES.md` | Архитектура, Vite-сборка, CORS, bootstrap, API |
| Техническая документация | `.cursor/planner/PROJECT_DOCS.md` | Записи по завершённым задачам |
| План | `.cursor/planner/PLAN.md` | План пользователя |
| Задачи | `.cursor/planner/TASKS.md` | Активные задачи с чекпоинтами |
| Спецификация | `.cursor/planner/SPEC.md` | Спецификация активной задачи |
| Архив | `.cursor/planner/DONE.md` | Завершённые задачи |

---

## Исходный код

| Модуль | Путь |
|---|---|
| Entry-point | `src/teorikaModule.js` |
| API config | `src/service/api/api.config.js` |
| API requests | `src/service/api/api.request.js` |
| Попапы | `src/popup.js` |
| Leadbot | `src/leadbotTeorika.js` |
| Cookie-утилиты | `src/utils/cookies.js` |
| Page tracking | `src/pageTracking.js` |
| Стили | `src/style.css` |
| Сборка | `vite.config.js`, `package.json` |
| Артефакт | `dist/teorikaModule.js` |

---

## Репозиторий и деплой

| Ресурс | URL |
|---|---|
| GitHub (продакшн) | https://github.com/ilya6300/cdp_teorika.git |
| Собранный бандл | `dist/teorikaModule.js` в репозитории |

---

## Внешние источники

| Тема | URL |
|---|---|
| Vite — Library Mode | https://vite.dev/guide/build.html#library-mode |
| Vite — Config Reference | https://vite.dev/config/ |
| MDN — fetch | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API |
| MDN — CORS | https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS |
| MDN — DOMContentLoaded | https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event |
| MDN — Document.referrer | https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer |
| MDN — pagehide event | https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event |
| MDN — visibilitychange event | https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event |
| MDN — Page Visibility API | https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API |
| MDN — pageshow event (bfcache) | https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event |
| MDN — Navigator.sendBeacon (future API) | https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon |
| MDN — Window.localStorage | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage |

---

## API Teorika

Endpoints определяются в коде:

- `src/service/api/api.config.js`
- `src/popup.js`
- `src/leadbotTeorika.js`
- `src/utils/cookies.js`

Не выдумывать URL — сверяться с кодом и `PROJECT_PRINCIPLES.md`.
