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

## [TASK-002] Экспорт teorikaReg/teorikaAuth и исправление bootstrap регистрации

**Дата:** 2026-08-12

### Описание

Публичный API регистрации и авторизации CDP доступен со сторонних сайтов через `window.teorikaReg` и `window.teorikaAuth`. Исправлен bootstrap-обработчик `registration_form_data` из localStorage. Улучшены fetch-обёртки API.

### Причина

План пользователя (PLAN.md): анализ методов `teorikaReg`/`teorikaAuth`, экспорт для embed-сайтов (Timeweb, Bitrix), вызов методов с данными формы по клику на кнопки.

### Реализация

- `src/teorikaModule.js` — экспорт `window.teorikaAuth`; `getDataLocal` с `JSON.parse` и корректным catch; `await getDataLocal(...)`; ветка `event === "auth"` → `teorikaAuth`
- `src/service/api/api.request.js` — `normalizeUserData` вынесена на уровень модуля; `teorikaAuth` формирует payload без мутации входного объекта; улучшены сообщения в catch
- `src/service/api/api.config.js` — проверка `res.ok`, `return await res.json()` при успехе, логирование HTTP-ошибок

**Публичный API (после `DOMContentLoaded`):**

| Метод | Назначение | Endpoint |
|---|---|---|
| `window.teorikaReg(data)` | Регистрация в CDP | `POST auth/cdp_reg` |
| `window.teorikaAuth(data)` | Авторизация в CDP | `POST dc/dc/user_info/auth` |

Оба метода нормализуют поля формы (`first_name`, `last_name`, `email`, `phone`), получают `mast_id` через `get-cookies`.

**localStorage bootstrap:** ключ `registration_form_data`, поле `event`: `"registration"` или `"auth"`.

### Влияние

- CORS без изменений; `get-cookies` по-прежнему с `credentials: "include"`
- Bootstrap-порядок виджетов сохранён
- `registration_form_data` теперь корректно парсится (ранее flow был сломан)
- `teorikaAuth` больше не мутирует переданный объект
- Интеграция на Timeweb — HTML вне репозитория; пример inline-скрипта в SPEC.md

### Деплой

`npm run build` → коммит `dist/teorikaModule.js` → push в https://github.com/ilya6300/cdp_teorika.git

### Ограничения

- `teorikaReg` отправляет запрос даже при отсутствии `mast_id` (существующее поведение)
- `getСookiesID` без проверки `res.ok` — follow-up
- Методы не возвращают результат вызывающему коду — follow-up

