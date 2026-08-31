import { getCollectorHeaders } from "../../utils/domain.js";

const debugMode = true;
const $https = true;

const dubugURL = $https
  ? "https://test.teorika.ru/"
  : "http://10.76.10.145:5059/";

export const teorikaConfig = {
  // urlApiV1: "https://teorika.ru/api/v1/v1/",
  url: !debugMode ? "https://teorika.ru/" : dubugURL,
  // urlDC: !debugMode ?"https://teorika.ru/api/v1/dc/dc/" : "http://10.76.10.145:5059/api/v1/dc/dc/",
};

// Регистрация в cdp
export const teorikaFetchJSONApiV1 = async (method, url, data) => {
  try {
    const res = await fetch(`${teorikaConfig.url}${url}`, {
      method: method,
      // credentials: "include",
      headers: getCollectorHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error("Не удалось зарегестрировать пользователя:", res, url);
      return null;
    }
    console.log("Регистрация пользователя успешна:", res);
    return await res.json();
  } catch (e) {
    console.error("Не удалось зарегестрировать пользователя:", e);
    return null;
  }
};

// Авторизация в cdp
export const teorikaFetchJsonDC = async (method, url, data) => {
  try {
    const res = await fetch(`${teorikaConfig.url}${url}`, {
      method: method,
      // credentials: "include",
      headers: getCollectorHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error("teorikaFetchJsonDC error:", res.status, url);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("teorikaFetchJsonDC error", e);
    return null;
  }
};
