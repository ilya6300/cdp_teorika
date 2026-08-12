# Техническая спецификация (текущая задача)

> Спецификация **активной** задачи из `TASKS.md`.
> Architect готовит текст → Orchestrator записывает в этот файл.
> При переключении на другую задачу файл перезаписывается.

**Задача:** _не назначена_

**Статус:** _ожидает новую задачу_

---

## Обзор решения

Задача делится на три блока с минимальным diff (без рефакторинга архитектуры):

1. **Публичный API на `window`** — добавить `window.teorikaAuth` по тому же паттерну, что уже используется для `window.teorikaReg` (после `DOMContentLoaded`, в bootstrap `teorikaModule.js`). Имена globals не менять.

2. **Исправление bootstrap `registration_form_data`** — `getDataLocal` должен возвращать распарсенный JSON-объект; bootstrap должен `await`-ить результат; добавить ветку `event === "auth"` → `teorikaAuth`.

3. **Минимальные исправления API-слоя** — устранить подтверждённые баги в `api.config.js` и `api.request.js` без изменения endpoints и без большого рефакторинга.

### Подтверждение известных проблем (анализ кода)

| # | Проблема | Статус | Где |
|---|---|---|---|
| 1 | `teorikaAuth` не экспортируется на `window` | **Подтверждено** | `teorikaModule.js:42–43` — экспортируется только `teorikaReg` |
| 2a | `getDataLocal`: нет `JSON.parse` | **Подтверждено** | `teorikaModule.js:17–19` — возвращается строка из `localStorage` |
| 2b | `getDataLocal` catch: `e` не объявлена | **Подтверждено** | `teorikaModule.js:21–22` — `catch {` + `console.error(e)` |
| 2c | Bootstrap: вызов `getDataLocal` без `await` | **Подтверждено** | `teorikaModule.js:50` |
| 3a | `teorikaFetchJSONApiV1` / `teorikaFetchJsonDC`: нет проверки `res.ok` | **Подтверждено** | `api.config.js:10–16`, `24–30` |
| 3b | Fetch-обёртки не возвращают результат | **Подтверждено** | обе функции завершаются без `return` |
| 4a | `normalizeUserData` объявлена внутри `teorikaReg` | **Подтверждено** | `api.request.js:6–43` |
| 4b | `teorikaAuth` мутирует входной `dateCookie` | **Подтверждено** | `api.request.js:60–61` — прямая запись в аргумент |
| 4c | Пустые/бессмысленные catch-сообщения | **Подтверждено** | `api.request.js:51–52`, `65–66` — `console.error(e)` без контекста |
| 5 | `teorikaReg`: `if (_data)` всегда `true` | **Подтверждено** | `api.request.js:46` — `normalizeUserData` всегда возвращает объект |

### Дополнительные находки (не блокируют задачу, follow-up)

- `getСookiesID` (`cookies.js:11–16`) не проверяет `res.ok` и не обрабатывает ошибки парсинга — **не менять в TASK-002** (вне scope минимальных правок).
- `teorikaAuth` не использует `normalizeUserData`, в отличие от `teorikaReg` — **исправить в scope**: нормализация нужна для единообразного payload с полями `first_name`, `last_name`, `email`, `phone`.
- `getDataLocal` при `local === null` неявно возвращает `undefined` — явно возвращать `null` для предсказуемости.

### Принятые допущения (из PLAN / Orchestrator)

- Кнопки на Timeweb: привязка через `data-action="reg"` / `data-action="auth"` или `onclick`, без переименования текста кнопок.
- Payload `teorikaAuth`: те же поля формы (`first_name`, `last_name`, `email`, `phone`); `mast_id` и `page_url` добавляются **внутри** метода.
- `registration_form_data`: ветка `event === "auth"` → `teorikaAuth`.
- Оптимизация: только минимальные исправления по анализу, без большого рефакторинга.
- Деплой: `npm run build` обязателен; push в `cdp_teorika` — после review, пользователем.

---

## Изменяемые файлы

| Файл | Изменения |
|---|---|
| `src/teorikaModule.js` | Экспорт `window.teorikaAuth`; исправление `getDataLocal` (`JSON.parse`, catch, return); `await getDataLocal(...)`; ветка `event === "auth"` |
| `src/service/api/api.request.js` | Вынести `normalizeUserData` на уровень модуля; использовать в `teorikaAuth`; убрать мутацию входного объекта; улучшить catch-сообщения; убрать бессмысленный `if (_data)` |
| `src/service/api/api.config.js` | Проверка `res.ok`; `return await res.json()` при успехе; логирование HTTP-ошибок |

**Не изменять:**

- `vite.config.js`, `package.json` — сборка не затрагивается.
- `src/utils/cookies.js` — вне scope (follow-up).
- `src/popup.js`, `src/leadbotTeorika.js`, `src/pageTracking.js` — не затрагиваются.
- HTML на Timeweb и в репозитории — вне scope.

---

## Последовательность реализации

### Шаг 1. `src/service/api/api.config.js` — fetch-обёртки

**Цель:** вызывающий код и отладка в Network/Console получают предсказуемое поведение.

Для **`teorikaFetchJSONApiV1`** и **`teorikaFetchJsonDC`** (одинаковый паттерн):

1. После `fetch` проверить `res.ok`.
2. Если `!res.ok` — `console.error` с контекстом: имя функции, HTTP-статус, `url` (относительный путь аргумента). Вернуть `null`.
3. Если OK — `return await res.json()`.
4. В `catch` — сохранить существующие сообщения (`"teorikaFetchJSONApiV1 error"`, `"teorikaFetchJsonDC error"`), вернуть `null`.

**Не менять:** URL, метод, headers, отсутствие `credentials: "include"` (текущее поведение для этих endpoints).

---

### Шаг 2. `src/service/api/api.request.js` — `teorikaReg` и `teorikaAuth`

#### 2.1. Вынести `normalizeUserData`

- Перенести функцию `normalizeUserData` из тела `teorikaReg` на **уровень модуля** (перед экспортами).
- Логику нормализации **не менять** — только перемещение.
- Использовать в `teorikaReg` и `teorikaAuth`.

#### 2.2. `teorikaReg`

1. `_data = normalizeUserData(data)`.
2. `coockiID = await getСookiesID()`.
3. **Убрать** `if (_data)` — условие всегда истинно и не несёт смысла.
4. Сохранить текущее поведение: `_data.mast_id = coockiID` (даже если `coockiID` undefined — не менять guard без явного требования).
5. `await teorikaFetchJSONApiV1("POST", "auth/cdp_reg", _data)`.
6. Catch: `console.error("teorikaReg error:", error)` (не голый `console.error(e)`).

#### 2.3. `teorikaAuth`

1. `coockiID = await getСookiesID()`.
2. Сохранить guard `if (coockiID)` — без `mast_id` запрос не отправлять.
3. **Не мутировать** входной `dateCookie`. Сформировать новый payload:

```javascript
const payload = {
  ...normalizeUserData(dateCookie),
  mast_id: coockiID,
  page_url: window.location.href,
};
```

4. `await teorikaFetchJsonDC("POST", "user_info/auth", payload)`.
5. Catch: `console.error("teorikaAuth error:", error)`.

**Endpoint (не выдумывать):** `POST https://teorika.ru/api/v1/dc/dc/user_info/auth` — из `urlDC` + `"user_info/auth"`.

---

### Шаг 3. `src/teorikaModule.js` — `getDataLocal`, bootstrap, globals

#### 3.1. Исправить `getDataLocal`

```javascript
const getDataLocal = async (name) => {
  try {
    const local = localStorage.getItem(name);
    if (local !== null) {
      return JSON.parse(local);
    }
    return null;
  } catch (error) {
    console.error("getDataLocal error:", error);
    return null;
  }
};
```

#### 3.2. Экспорт globals (после `injectStyles`, до popup/leadbot)

```javascript
if (teorikaReg) window.teorikaReg = teorikaReg;
if (teorikaAuth) window.teorikaAuth = teorikaAuth;
```

Порядок bootstrap **не менять**: `injectStyles` → globals → `checkScenarios` → `startScheme` → `getDataLocal`.

#### 3.3. Bootstrap `registration_form_data`

```javascript
const dateCookie = await getDataLocal("registration_form_data");
if (dateCookie) {
  if (dateCookie.event === "registration") {
    await teorikaReg(dateCookie);
  } else if (dateCookie.event === "auth") {
    await teorikaAuth(dateCookie);
  }
}
```

**Не добавлять** автоматическую очистку `localStorage` после обработки — вне scope.

---

### Шаг 4. Сборка и самопроверка

1. `npm run build` — без ошибок.
2. Убедиться, что `dist/teorikaModule.js` обновлён.
3. Проверить в Console embed-страницы (после деплоя):
   - `typeof window.teorikaReg === "function"`
   - `typeof window.teorikaAuth === "function"`
4. На Timeweb (HTML вне репозитория, по примеру ниже):
   - кнопка reg → Network: `POST .../auth/cdp_reg`
   - кнопка auth → Network: `POST .../dc/dc/user_info/auth`
   - оба запроса предваряются (или сопровождаются) `GET .../get-cookies` с `credentials: include`

---

## Vite-сборка и bootstrap

### Сборка

- Entry: `src/teorikaModule.js` → IIFE `dist/teorikaModule.js`.
- Новые модули не добавляются; циклических зависимостей не создавать.
- `import { teorikaReg, teorikaAuth }` уже есть в entry-point — дополнительных импортов не нужно.

### Bootstrap (сохранить порядок из PROJECT_PRINCIPLES.md)

```
globals на window (settingsTeorika, cookie-утилиты) — до DOMContentLoaded
  → DOMContentLoaded
    → injectStyles()
    → window.teorikaReg, window.teorikaAuth   ← добавление teorikaAuth
    → checkScenarios(teorikaConfig)
    → startScheme()
    → await getDataLocal("registration_form_data") → teorikaReg / teorikaAuth
```

`initPageTracking()` остаётся до `DOMContentLoaded` — не перемещать.

---

## CORS и backend

| Запрос | URL | credentials | CORS |
|---|---|---|---|
| `get-cookies` | `https://teorika.ru/api/v1/get-cookies` | `include` (обязательно) | Origin клиента должен быть в whitelist backend |
| Регистрация | `POST .../api/v1/auth/cdp_reg` | нет (как сейчас) | Preflight POST + JSON; origin в whitelist |
| Авторизация | `POST .../api/v1/dc/dc/user_info/auth` | нет (как сейчас) | Preflight POST + JSON; origin в whitelist |

**Требования к backend (без изменений API):**

- Whitelist origin для Timeweb-тестового домена и существующих клиентов.
- `get-cookies` — `Access-Control-Allow-Credentials: true` + конкретный `Allow-Origin` (не `*`).

**Новые endpoints не добавлять.** Форматы payload — как в текущем коде + нормализация полей формы.

---

## Деплой

1. После завершения разработки и review: `npm run build`.
2. Коммит изменений в `src/` и обновлённого `dist/teorikaModule.js`.
3. Push в https://github.com/ilya6300/cdp_teorika.git — **пользователем после review**, не Developer.
4. Timeweb-тест: подключить обновлённый бандл с GitHub Pages (`ilya6300.github.io/cdp_teorika/dist/teorikaModule.js`).

---

## Риски для сайтов клиентов

| Риск | Вероятность | Митигация |
|---|---|---|
| Изменение поведения `registration_form_data` (теперь JSON.parse) | Средняя | Раньше строка не проходила `dateCookie.event` — фактически flow был сломан; после fix flow заработает — ожидаемое улучшение |
| Новая ветка `event === "auth"` | Низкая | Срабатывает только при явном `event: "auth"` в localStorage |
| `teorikaAuth` перестанет мутировать переданный объект | Низкая | Исправление бага; inline-скрипты, полагающиеся на мутацию, маловероятны |
| Fetch начнёт логировать HTTP-ошибки | Низкая | Только диагностика в Console, поведение для UI не меняется |
| Отсутствие `mast_id` (get-cookies fail) | Существующий | `teorikaAuth` не отправит запрос; `teorikaReg` отправит с `mast_id: undefined` — **не менять в TASK-002** |
| Старый кэшированный бандл на сайте | Средняя | После push — hard refresh / cache bust на embed-странице |

**Не ломается:** popup, leadbot, pageTracking, существующие globals (`settingsTeorika`, `getСookiesID`, `getDateCookie`).

---

## Документация

**Обязательно для CDP Developer:**

- @docs `.cursor/planner/PROJECT_PRINCIPLES.md` — Vite-сборка, CORS, bootstrap, globals
- @docs `.cursor/planner/PLAN.md` — разделы 1–2 (анализ, Timeweb HTML)
- @docs `src/teorikaModule.js` — entry-point, bootstrap, getDataLocal
- @docs `src/service/api/api.request.js` — teorikaReg, teorikaAuth, normalizeUserData
- @docs `src/service/api/api.config.js` — teorikaFetchJSONApiV1, teorikaFetchJsonDC
- @docs `src/utils/cookies.js` — getСookiesID (mast_id)
- @web https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- @web https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- @web https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

**После завершения задачи (Technical Documentation Writer):**

- Обновить `.cursor/planner/PROJECT_DOCS.md`: добавить `window.teorikaAuth` в список globals; описать публичный API reg/auth.
- Предложить Orchestrator дополнение `PROJECT_PRINCIPLES.md` (секция Globals): добавить `window.teorikaAuth`.

**Follow-up (не TASK-002):**

- `getСookiesID`: проверка `res.ok`, обработка отсутствия `r.cookies.mast_id`.
- Возврат результата из `teorikaReg`/`teorikaAuth` для inline-скриптов клиента.

---

## Исполнитель

**CDP Developer** (`.cursor/agents/cdp-developer.md`)

После реализации — **CDP Reviewer** (`.cursor/agents/cdp-reviewer.md`).

---

## Пример inline-скрипта для Timeweb (внешний сайт)

HTML-файл **не создавать в репозитории**. Пользователь правит Timeweb-страницу по PLAN.md.

### 1. Подключение бандла (уже есть в PLAN.md)

```html
<script src="https://ilya6300.github.io/cdp_teorika/dist/teorikaModule.js"></script>
```

### 2. Кнопки формы — `data-action` (текст кнопок не менять)

Заменить/дополнить кнопки в форме из PLAN.md:

```html
<!-- Кнопка формы: регистрация (текст «Отправить» сохранён) -->
<button
  type="button"
  data-action="reg"
  style="/* ... существующие стили ... */"
>
  Отправить
</button>

<!-- Свободная кнопка: авторизация (текст «Просто кнопка» сохранён) -->
<button
  type="button"
  data-action="auth"
  style="/* ... существующие стили ... */"
>
  Просто кнопка
</button>
```

`type="button"` — чтобы не было нативного submit формы.

### 3. Inline-скрипт обработчиков (после подключения бандла)

```html
<script>
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("form");
    if (!form) return;

    function getFormData() {
      var fd = new FormData(form);
      return Object.fromEntries(fd.entries());
    }

    var regBtn = document.querySelector('[data-action="reg"]');
    var authBtn = document.querySelector('[data-action="auth"]');

    if (regBtn) {
      regBtn.addEventListener("click", function () {
        if (typeof window.teorikaReg !== "function") {
          console.error("teorikaReg не загружен");
          return;
        }
        window.teorikaReg(getFormData());
      });
    }

    if (authBtn) {
      authBtn.addEventListener("click", function () {
        if (typeof window.teorikaAuth !== "function") {
          console.error("teorikaAuth не загружен");
          return;
        }
        window.teorikaAuth(getFormData());
      });
    }
  });
</script>
```

### 4. Ожидаемое поведение при клике

| Действие | Метод | Network |
|---|---|---|
| «Отправить» (`data-action="reg"`) | `window.teorikaReg({ first_name, last_name, email, phone })` | `GET get-cookies` → `POST auth/cdp_reg` |
| «Просто кнопка» (`data-action="auth"`) | `window.teorikaAuth({ first_name, last_name, email, phone })` | `GET get-cookies` → `POST dc/dc/user_info/auth` |

Payload auth формируется внутри `teorikaAuth`: нормализованные поля формы + `mast_id` + `page_url`.

### 5. Bootstrap через localStorage (опционально, для Bitrix-flow)

Если данные сохранены до загрузки CDP:

```javascript
localStorage.setItem(
  "registration_form_data",
  JSON.stringify({
    event: "registration", // или "auth"
    first_name: "...",
    last_name: "...",
    email: "...",
    phone: "...",
  })
);
```

При следующей загрузке страницы CDP автоматически вызовет `teorikaReg` или `teorikaAuth` после popup/leadbot.

---

## Критерии приёмки (из TASKS.md — для Reviewer)

- [ ] `window.teorikaAuth` доступен после `DOMContentLoaded`
- [ ] `getDataLocal` парсит JSON; catch с валидной переменной
- [ ] Bootstrap использует `await getDataLocal(...)`
- [ ] `event: "registration"` → `teorikaReg`; `event: "auth"` → `teorikaAuth`
- [ ] Критичные находки в `api.request.js` / `api.config.js` исправлены
- [ ] `npm run build` без ошибок
- [ ] Timeweb: кнопки reg/auth → запросы к `teorika.ru` в Network (после деплоя бандла)
