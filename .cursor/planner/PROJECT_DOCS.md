# Техническая документация Teorika CDP Module

> Постоянная документация для разработчиков. Дополняет `.cursor/planner/PROJECT_PRINCIPLES.md`.
> Обновляется **только после завершения задачи** агентом Technical Documentation Writer (этап после `REVIEW_APPROVED`).

---

## Назначение

Здесь фиксируются конкретные изменения по завершённым задачам: что сделано, почему, где в коде, какое влияние на сайты клиентов.

Базовая архитектура (Vite-сборка, CORS, bootstrap, API, деплой) — в `PROJECT_PRINCIPLES.md`, не дублировать.

---

## Проект

| Параметр | Значение |
|---|---|
| Исходники | `src/` |
| Сборка | Vite → `dist/teorikaModule.js` (IIFE) |
| Репозиторий | https://github.com/ilya6300/cdp_teorika.git |
| Тестирование | Embed на сайте клиента (скрипт из GitHub) |

---

## Формат записи

```markdown
## [TASK-XXX] Название задачи

**Дата:** YYYY-MM-DD

### Описание

Кратко: что изменилось.

### Причина

Зачем потребовалось изменение.

### Реализация

- `src/teorikaModule.js` — ...
- `src/popup.js` — ...
- `src/style.css` — ...

### Влияние

CORS, cookie, виджеты на сайтах клиентов Bitrix.

### Деплой

`npm run build`, push в GitHub.

### Ограничения

Vite-сборка, bootstrap-порядок, credentials.
```

---

## Записи

## [TASK-001] Трекинг посетителя (page view)

**Дата:** 2026-08-11

### Описание

Добавлен модуль page tracking: при загрузке embed-скрипта фиксируется URL страницы, referrer и время начала; при уходе с страницы данные сохраняются в `localStorage` в JSON.

### Причина

Требование CDP: отслеживать поведение посетителя на сайте клиента. API для отправки данных пока не готово — режим отладки через localStorage.

### Реализация

- `src/pageTracking.js` — новый модуль: `initPageTracking()`, сбор payload, сохранение по `pagehide` / `visibilitychange`, обработка bfcache через `pageshow`
- `src/teorikaModule.js` — `import` и вызов `initPageTracking()` на top-level (после window globals, до `DOMContentLoaded`)

**Ключ localStorage:** `teorika_page_tracking` (массив объектов)

**Поля записи:** `page_url`, `referrer`, `duration_sec`, `entered_at`, `left_at`

### Влияние

- CORS не затрагивается (нет сетевых запросов)
- Bootstrap-цепочка виджетов не изменена
- Отдельный ключ localStorage — нет коллизии с `reqid`, `req_time`, `registration_form_data`
- При ошибке localStorage скрипт продолжает работу (лог в Console)

### Деплой

`npm run build` → коммит `dist/teorikaModule.js` → push в https://github.com/ilya6300/cdp_teorika.git

### Ограничения

- SPA-навигация без перезагрузки страницы не покрывается
- Массив в localStorage без лимита (режим отладки)
- Будущая интеграция с API — отдельная задача (`sendBeacon` / fetch с `keepalive`)

