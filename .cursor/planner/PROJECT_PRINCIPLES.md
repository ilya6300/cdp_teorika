# Принципы работы Teorika CDP Module

> Главный источник архитектурных ограничений. Все агенты читают перед началом работы.

---

## Назначение проекта

**Teorika CDP Module** — embed-скрипт (Customer Data Platform) для сторонних сайтов на Bitrix 1С:

- идентификация через cookie `mast_id`;
- попапы и маркетинговые сценарии;
- leadbot / чат-бот;
- регистрация и авторизация в CDP через API Teorika.

Скрипт выполняется в браузере на **домене клиента**, запросы к API — cross-origin на `teorika.ru`.

---

## Структура репозитория

| Путь | Назначение |
|---|---|
| `src/` | Исходный код (ES-модули) |
| `dist/` | Собранный бандл для продакшна |
| `vite.config.js` | Конфигурация сборки Vite |
| `package.json` | npm-скрипты и devDependencies |

### Исходные модули (`src/`)

| Модуль | Ответственность |
|---|---|
| `src/teorikaModule.js` | Entry-point, bootstrap, globals на `window`, оркестрация |
| `src/service/api/api.config.js` | URL API, `teorikaFetchJSONApiV1`, `teorikaFetchJsonDC` |
| `src/service/api/api.request.js` | `teorikaReg`, `teorikaAuth`, нормализация данных формы |
| `src/popup.js` | Поиск сценариев, рендер попапов, статистика |
| `src/leadbotTeorika.js` | Схема чат-бота, DOM-виджет, отправка лида |
| `src/utils/cookies.js` | `getСookiesID`, `getDateCookie`, `parseCookie` |
| `src/pageTracking.js` | Трекинг страниц: URL, referrer, время на странице → localStorage |
| `src/style.css` | Стили виджетов (инлайнится в бандл) |

Бизнес-логика API — в `api.request.js` / `api.config.js`.
DOM-манипуляции — в `popup.js` / `leadbotTeorika.js`.

---

## Сборка (Vite)

Проект собирается как **единый IIFE-бандл** через Vite.

### Конфигурация

- Entry: `src/teorikaModule.js`
- Формат: `iife` (имя `TeorikaCDP`)
- Выход: `dist/teorikaModule.js`
- Минификация: `esbuild`
- CSS: инлайнится через `import styleCss from "./style.css?inline"`

### Команды

```bash
npm run build        # production-сборка → dist/teorikaModule.js
npm run dev          # сборка в watch-режиме
```

### Импорты в исходниках

В `src/` используются **статические ES-модули** (`import` / `export`). Vite разрешает зависимости на этапе сборки и объединяет их в один файл.

**Разрешено:** `import` / `export` между файлами внутри `src/`.

**Запрещено без архитектурного решения (Architect + SPEC):**

- runtime `import()` для загрузки модулей проекта (всё уже в бандле);
- добавление фреймворков (React, Vue) без явного требования в SPEC;
- изменение формата выхода (не IIFE) без согласования.

При добавлении новых модулей учитывать циклические зависимости — Vite/esbuild их не разрешит.

---

## Деплой и тестирование

### Репозиторий

Продакшн-артефакт публикуется в:

**https://github.com/ilya6300/cdp_teorika.git**

`origin` локального репозитория указывает на этот URL.

### Workflow

1. Изменения в `src/`
2. `npm run build` → обновление `dist/teorikaModule.js`
3. Коммит и push в `cdp_teorika`
4. Тестирование на сайтах клиентов, подключающих скрипт из репозитория

**Локальных тестовых HTML-страниц и папки `testData/` в проекте нет.** Проверка — только через собранный бандл на реальном embed-окружении (сайт клиента + скрипт из GitHub).

---

## Порядок инициализации (bootstrap)

```
globals на window (settingsTeorika, cookie-утилиты)
  → DOMContentLoaded
    → injectStyles() (CSS из бандла)
    → window.teorikaReg, window.teorikaAuth
    → checkScenarios(teorikaConfig)  // popup
    → startScheme()                  // leadbot
    → обработка registration_form_data из localStorage
```

Не менять этот порядок без архитектурного решения (Architect + SPEC).

Entry-point: `src/teorikaModule.js`.

---

## Globals на window

Экспорт на `window` — для совместимости с Bitrix и inline-скриптами клиента:

- `window.settingsTeorika`, `window.setPoliticsLink`
- `window.getСookiesID`, `window.getDateCookie`
- `window.teorikaReg`, `window.teorikaAuth` (после `DOMContentLoaded`)

Не удалять и не переименовывать без согласования — могут использоваться на сайтах клиентов.

---

## CORS и API

- Все API-запросы — cross-origin (`client-site.ru` → `teorika.ru`).
- Запросы к `get-cookies` — только с `credentials: "include"`.
- Не удалять `credentials: "include"` без согласования с backend.
- Endpoints — только из `src/service/api/api.config.js` и существующего кода; не выдумывать URL и форматы payload.

### Основные endpoints

| Endpoint | Назначение |
|---|---|
| `https://teorika.ru/api/v1/get-cookies` | Получение `mast_id` (credentials: include) |
| `https://teorika.ru/api/v1/auth/cdp_reg` | Регистрация в CDP |
| `https://teorika.ru/api/v1/dc/dc/user_info/add_bitrix_task` | Отправка лида в Bitrix |
| `https://teorika.ru/api/v1/search/` | Поиск сценариев |
| `https://teorika.ru/api/v1/chatbot_scheme/url` | Схема чат-бота |

При новых fetch-вызовах учитывать preflight и whitelist origin на сервере.

---

## Cookie и localStorage

- `mast_id` — идентификатор CDP (через API `get-cookies`).
- `roistat_visit`, `_ym_uid` — атрибуция (читаются с домена клиента).
- `registration_form_data` — данные формы регистрации из localStorage.
- `teorika_page_tracking` — отладочный трекинг визитов (массив JSON в localStorage).
- `parseCookie` / `getСookiesValue` — существующие утилиты, переиспользовать.

---

## Работа с DOM

- Виджеты инициализируются после `DOMContentLoaded` из entry-point.
- **Не добавлять** auto-run (`startScheme()` и т.п.) в конце новых модулей без учёта момента загрузки.
- Перед созданием виджета проверять/удалять существующие контейнеры (см. `renderLidBot`).
- Использовать существующие CSS-классы (`.lid-bot-*`, `.my_hidden`).

---

## Обработка ошибок

```javascript
try {
  // ...
} catch (error) {
  console.error("Описание контекста:", error);
}
```

Не оставлять пустые `catch`. Сообщения должны помогать диагностике в Console на сайте клиента.

---

## Стили

- CSS инлайнится в бандл через `style.css?inline` и вставляется в `<head>` из `teorikaModule.js`.
- Цвета виджета — из схемы сервера (`scheme.color`).
- Не хардкодить стили inline без необходимости; использовать классы из `style.css`.

---

## Безопасность

- Не логировать персональные данные (email, phone) без необходимости.
- Не вставлять `innerHTML` с недоверенным контентом без санитизации.
- `script_data` из сценариев — только через проверенные механизмы (`createContextualFragment`).

---

## Типичные ошибки при отладке

| Симптом | Где смотреть |
|---|---|
| Виджет не появляется | Console: `Ошибка виджета теорики` |
| CORS / network failure | Network: запросы к `teorika.ru` |
| Нет `mast_id` | Network: `get-cookies`, Application → Cookies |
| Старая версия скрипта | Убедиться, что `dist/teorikaModule.js` собран и запушен в GitHub |
| Сборка падает | Terminal: ошибки Vite/esbuild (циклические зависимости, синтаксис) |

---

## Запрещено

- Добавлять моки, фейковые данные и отладочные заглушки в production-модули (`src/`).
- Создавать локальные тестовые HTML-страницы в репозитории (тестирование — через GitHub + embed).
- Удалять `credentials: "include"` из get-cookies.
- Выдумывать API endpoints и форматы payload.
- Менять bootstrap-порядок без указания Architect.
- Удалять или переименовывать публичные globals на `window` без согласования.
