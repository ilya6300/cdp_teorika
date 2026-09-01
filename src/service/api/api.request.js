import {
  teorikaConfig,
  teorikaFetchJSONApiV1,
  teorikaFetchJsonDC,
} from "./api.config.js";
import { getCollectorHeaders, normalizeDomainHost } from "../../utils/domain.js";

function normalizeUserData(data) {
  const result = {
    name: "",
    last_name: "",
    second_name: "",
    phones: "",
    email: "",
    domain_url: normalizeDomainHost(window.location.hostname),
    login: "",
  };

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;
    const cleanKey = key.toLowerCase().replace(/[\[\]_]/g, "");

    if (cleanKey.includes("name")) {
      if (cleanKey.includes("last")) {
        result.last_name = String(value);
      } else if (cleanKey.includes("second") || cleanKey.includes("father")) {
        result.second_name = String(value);
      } else if (
        cleanKey.includes("first") ||
        cleanKey.endsWith("name") ||
        cleanKey === "name"
      ) {
        result.name = String(value);
      }
    } else if (cleanKey.includes("email")) {
      result.email = String(value);
    } else if (cleanKey.includes("phone")) {
      result.phones = String(value).replace(/\D/g, "");
    } else if (cleanKey.includes("login")) {
      result.login = String(value);
    }
  }

  if (!result.login) {
    result.login = data.login || data.LOGIN || "";
  }

  return result;
}
// Инициализация пользователя в теорике
export const teorikaInit = async () => {
  try {
    const res = await fetch(`${teorikaConfig.url}datacollector/api/v1/user_info/init`, {
      method: "POST",
      credentials: "include",
      headers: getCollectorHeaders(),
      body: JSON.stringify({ domain_url: "string" }),
    });
    if (!res.ok) {
      console.error("Не удалось инициализировать пользователя в теорике", res);
      return null;
    }
    // return await res.json()
  } catch (e) { console.error("Ошибка инициализации пользователя в теорике:", e); }
}

// Регистрация пользователя в теорике
export const teorikaReg = async (data) => {
  try {
    const _data = normalizeUserData(data);
    await teorikaFetchJSONApiV1("POST", "datacollector/api/v1/user_info/reg_handler", _data);
  } catch (error) {
    console.error("Ошибка регистрации в теорики:", error);
  }
};

// Авторизация пользователя в теорике
export const teorikaAuth = async (_data) => {
  try {
    console.log("!teorikaAuth", _data);
    if (_data) {
      const result = {
        domain_url: normalizeDomainHost(window.location.hostname),
        login: _data.login || _data.LOGIN || "",
      };
      await teorikaFetchJsonDC("POST", "datacollector/api/v1/user_info/auth_handler", result);
    }
  } catch (error) {
    console.error("Ошибка авторизации в теорике:", error);
  }
};

// Отправка данных о посещении страницы на сервер теорики
export const sendPageTracking = async (data) => {
  try {
    const res = await fetch(`${teorikaConfig.url}datacollector/api/v1/user_info/page_visit`, {
      method: "POST",
      credentials: "include",
      headers: getCollectorHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error("Не удалось отправить данные на сервер", res);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("Не удалось отправить данные на сервер", e);
  }
};
