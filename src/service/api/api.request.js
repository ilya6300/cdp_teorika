import {
  teorikaConfig,
  teorikaFetchJSONApiV1,
  teorikaFetchJsonDC,
} from "./api.config.js";
import { getСookiesID } from "../../utils/cookies.js";

function normalizeUserData(data) {
  // const result = {
  //   first_name: "",
  //   father_name: "",
  //   last_name: "",
  //   email: "",
  //   phone: "",
  // };
  const result = {
    // cms_user_id: 0,
    name: "",
    last_name: "",
    second_name: "",
    phones: "",
    email: "",
    // description: "string",
    domain_url: window.location.hostname,
    login: "",
    // device_type: "string",
    // previous_page_url: "string",
    // flowing_page_url: "string",
    // duration: 0,
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
export const teorikaReg = async (data) => {
  console.log("!teorikaReg", data);
  try {
    const _data = normalizeUserData(data);
    await teorikaFetchJSONApiV1("POST", "user_info/reg_handler", _data);
  } catch (error) {
    console.error("Ошибка регистрации в теорики:", error);
  }
};

export const teorikaAuth = async (_data) => {
  try {
    console.log("!teorikaAuth", _data);
    if (_data) {
      const result = {
        // previous_page_url: "string",
        // flowing_page_url: "string",
        // duration: 0,
        domain_url: window.location.hostname,
        // device_type: "string",
        // description: "string",
        // entry_page_url: "string",
        // source_domain: "string",
        login: _data.login || _data.LOGIN || "",
      };
      await teorikaFetchJsonDC("POST", "user_info/auth_handler", result);
    }
  } catch (error) {
    console.error("Ошибка авторизации в теорике:", error);
  }
};

export const sendPageTracking = async (data) => {
  try {
    const res = await fetch(`${teorikaConfig.uplApi}user_info/page_visit`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
