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
  } catch (e) {
    console.error("teorikaFetchJSONApiV1 error", e);
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
  } catch (e) {
    console.error("teorikaFetchJsonDC error", e);
  }
};
