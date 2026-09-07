# Техническая спецификация (текущая задача)

**Задача:** TASK-003 — Валидация email, телефона и ИНН в формах CDP

**Статус:** DEVELOPMENT_COMPLETE → IN_REVIEW

---

## Обзор решения

Единый модуль [`src/utils/validation.js`](src/utils/validation.js) с правилами:

| Поле | Правило |
|---|---|
| Email | Непустой, regex `local@domain.tld` |
| Телефон | 10 или 11 цифр после нормализации (+7/8 допустимы) |
| ИНН | 10 или 12 цифр |

Интеграция в [`src/popup.js`](src/popup.js) и [`src/leadbotTeorika.js`](src/leadbotTeorika.js). Вне scope: `api.request.js`, отправка ИНН из попапа.

## Изменяемые файлы

| Файл | Изменения |
|---|---|
| `src/utils/validation.js` | Новый модуль валидаторов |
| `src/popup.js` | `validateField` для phone, email, inn |
| `src/leadbotTeorika.js` | `validateActiveField`, исправление `errorCheck` |

## Критерии приёмки

- [x] Невалидные email/phone/inn блокируют submit
- [x] Валидные значения проходят (телефон +7, 10/11 цифр)
- [x] `npm run build` без ошибок
- [ ] Review одобрен
