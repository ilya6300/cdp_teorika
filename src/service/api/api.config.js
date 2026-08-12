export const teorikaConfig = {
  // urlApiV1: "https://teorika.ru/api/v1/v1/",
  urlApiV1: "https://teorika.ru/api/v1/",
  urlDC: "https://teorika.ru/api/v1/dc/dc/",
};

// Регистрация в cdp
export const teorikaFetchJSONApiV1 = async (method, url, data) => {
  try {
    const res = await fetch(`${teorikaConfig.urlApiV1}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error(
        "teorikaFetchJSONApiV1 error:",
        res.status,
        url
      );
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("teorikaFetchJSONApiV1 error", e);
    return null;
  }
};
// Авторизация в cdp
export const teorikaFetchJsonDC = async (method, url, data) => {
  try {
    const res = await fetch(`${teorikaConfig.urlDC}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
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
