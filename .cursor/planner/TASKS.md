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

_Задач пока нет._
