# Задачи Teorika CDP Module

> Orchestrator ведёт этот файл. Planner готовит текст записей, Architect — SPEC.md.

---

## Шаблон задачи

```markdown
### TASK-XXX: Название

**Статус:** PLANNED | ARCHITECTURE | IN_DEVELOPMENT | DEVELOPMENT_COMPLETE | IN_REVIEW | REVIEW_APPROVED | IN_DOCUMENTATION | DONE | BLOCKED

**Приоритет:** Critical | High | Medium | Low

**Циклы:** 0

**Описание:**

Что нужно сделать.

**Критерии готовности:**

- [ ] ...

**Чекпоинты:**

- [ ] План согласован
- [ ] Архитектура готова
- [ ] Разработка завершена
- [ ] Review одобрен
- [ ] Документация обновлена

**Документация:**

- @docs .cursor/planner/PROJECT_PRINCIPLES.md — Vite-сборка, CORS, bootstrap
- @docs src/teorikaModule.js — entry-point (при необходимости)
- @docs src/service/api/api.config.js — endpoints CDP (при необходимости)
- @docs vite.config.js — конфигурация сборки (при изменении сборки)
- @web <URL> — внешний источник (при необходимости)

**Зависимости:** TASK-YYY (если есть)
```

---

## Активные задачи

### TASK-003: Валидация email, телефона и ИНН в формах CDP

**Статус:** DEVELOPMENT_COMPLETE

**Приоритет:** High

**Циклы:** 0

**Описание:**

Добавить единую валидацию полей email, телефон и ИНН (стандарт РФ) во всех формах виджетов: попапы и чат-бот.

**Критерии готовности:**

- [x] Модуль `src/utils/validation.js` с `isValidEmail`, `isValidPhone`, `isValidInn`
- [x] Валидация в `popup.js` перед отправкой Bitrix-формы
- [x] Валидация в `leadbotTeorika.js`, исправлен баг `errorCheck`
- [x] Защита от повторной отправки (попап + чат-бот)
- [ ] Review одобрен
- [ ] Документация обновлена

**Чекпоинты:**

- [x] План согласован
- [x] Архитектура готова
- [x] Разработка завершена
- [ ] Review одобрен
- [ ] Документация обновлена

**Документация:**

- @docs .cursor/planner/PROJECT_PRINCIPLES.md
- @docs src/popup.js
- @docs src/leadbotTeorika.js
- @docs src/utils/validation.js

**Зависимости:** нет
