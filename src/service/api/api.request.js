import { teorikaFetchJSONApiV1, teorikaFetchJsonDC } from "./api.config.js";
import { getСookiesID } from "../../utils/cookies.js";

function normalizeUserData(input) {
  const result = {
    first_name: "",
    father_name: "",
    last_name: "",
    email: "",
    phone: "",
  };

  for (const [key, value] of Object.entries(input)) {
    if (value === null || value === undefined) continue;

    const cleanKey = key.toLowerCase().replace(/[\[\]_]/g, "");

    if (cleanKey.includes("name")) {
      if (cleanKey.includes("last")) {
        result.last_name = String(value);
      } else if (cleanKey.includes("second") || cleanKey.includes("father")) {
        result.father_name = String(value);
      } else if (
        cleanKey.includes("first") ||
        cleanKey.endsWith("name") ||
        cleanKey === "name"
      ) {
        result.first_name = String(value);
      }
    } else if (cleanKey.includes("email")) {
      result.email = String(value);
    } else if (cleanKey.includes("phone")) {
      result.phone = String(value).replace(/\D/g, "");
    }
  }

  return result;
}

export const teorikaReg = async (data) => {
  try {
    const _data = normalizeUserData(data);
    const coockiID = await getСookiesID();
    return console.log("!teorikaReg", data, _data, coockiID);
    _data.mast_id = coockiID;

    await teorikaFetchJSONApiV1("POST", "auth/cdp_reg", _data);
  } catch (error) {
    console.error("teorikaReg error:", error);
  }
};

export const teorikaAuth = async (dateCookie) => {
  try {
    const coockiID = await getСookiesID();
    return console.log("!teorikaAuth", dateCookie, coockiID);
    if (coockiID) {
      const payload = {
        ...dateCookie,
        mast_id: coockiID,
        page_url: window.location.href,
      };

      await teorikaFetchJsonDC("POST", "user_info/auth", payload);
    }
  } catch (error) {
    console.error("teorikaAuth error:", error);
  }
};
