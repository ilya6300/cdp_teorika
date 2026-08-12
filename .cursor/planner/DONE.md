# Завершённые задачи Teorika CDP Module

> Orchestrator переносит сюда задачи со статусом `DONE` из `TASKS.md`.

---

## [TASK-001] Трекинг посетителя (page view)

**Завершено:** 2026-08-11

**Статус:** DONE

**Приоритет:** High

**Циклы Developer→Reviewer:** 1

### Результат

- Создан `src/pageTracking.js` с `initPageTracking()`
- Подключён в `src/teorikaModule.js` на top-level (до DOMContentLoaded)
- Данные сохраняются в `localStorage` ключ `teorika_page_tracking`
- Review: APPROVED
- Сборка: `npm run build` — успешно

### Документация

См. `.cursor/planner/PROJECT_DOCS.md` — секция TASK-001.

---

## [TASK-002] Экспорт teorikaReg/teorikaAuth и исправление bootstrap регистрации

**Завершено:** 2026-08-12

**Статус:** DONE

**Приоритет:** High

**Циклы Developer→Reviewer:** 1

### Результат

- Экспорт `window.teorikaAuth` (аналогично `window.teorikaReg`)
- Исправлен `getDataLocal`: JSON.parse, await, ветка `event === "auth"`
- `normalizeUserData` вынесена на уровень модуля; `teorikaAuth` без мутации входа
- Fetch-обёртки: проверка `res.ok`, return json
- Review: APPROVED
- Сборка: `npm run build` — успешно

### Документация

См. `.cursor/planner/PROJECT_DOCS.md` — секция TASK-002.
