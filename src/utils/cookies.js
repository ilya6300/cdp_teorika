const parseCookie = (name) => {
  const regString = new RegExp(`${name}=(.+?)(;|$)`);
  const results = document.cookie.match(regString);
  if (results !== null) {
    return results[1];
  } else {
    return false;
  }
};

export const getСookiesID = async () => {
  const resCC = await fetch("https://teorika.ru/api/get-cookies", {
    credentials: "include",
  });
  if (!resCC.ok) {
    console.error("getСookiesID error:", resCC.status);
    return undefined;
  }
  const r = await resCC.json();
  return r?.cookies?.mast_id;
};

export const getDateCookie = async (cookie, url) => {
  try {
    const authFlag = parseCookie(cookie);
    if (authFlag) {
      const response = await fetch(url);
      const userData = await response.json();
      if (userData) {
        return { data: userData, event: authFlag };
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
