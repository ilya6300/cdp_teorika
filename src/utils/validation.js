const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INN_PATTERN = /^\d{10}$|^\d{12}$/;

/** Оставляет только цифры; для 11 цифр с ведущей 8 заменяет на 7. */
export function normalizePhoneDigits(value) {
  let digits = String(value).replace(/\D/g, "");
  if (digits.length === 11 && digits[0] === "8") {
    digits = "7" + digits.slice(1);
  }
  return digits;
}

/** Email: непустой, формат local@domain.tld */
export function isValidEmail(value) {
  const trimmed = String(value).trim();
  return trimmed !== "" && EMAIL_PATTERN.test(trimmed);
}

/** Телефон: мобильный 10–11 цифр (+7/8) или стационарный — 6 цифр. */
export function isValidPhone(value) {
  const digits = normalizePhoneDigits(value);
  return (
    digits.length === 6 || digits.length === 10 || digits.length === 11
  );
}

/** ИНН: 10 или 12 цифр. */
export function isValidInn(value) {
  const digits = String(value).replace(/\D/g, "");
  return INN_PATTERN.test(digits);
}

/** Красная рамка при ошибке, validBorderColor — при успехе. */
export function markFieldInvalid(element, isValid, validBorderColor) {
  if (!element) return;
  element.style.border = isValid
    ? `1px solid ${validBorderColor || "#ccc"}`
    : "1px solid #df2727";
}
