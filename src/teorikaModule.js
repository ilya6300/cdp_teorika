import { teorikaConfig } from "./service/api/api.config.js";

import { teorikaReg, teorikaAuth, teorikaInit } from "./service/api/api.request.js";

// import { checkScenarios } from "./popup.js";

// import { startScheme } from "./leadbotTeorika.js";

// import { getСookiesID, getDateCookie } from "./utils/cookies.js";

import { initPageTracking } from "./pageTracking.js";

import styleCss from "./style.css?inline";

window.settingsTeorika = { link: "" };

window.setPoliticsLink = (link) => {
  settingsTeorika.link = link;
};

const getDataLocal = async (name) => {
  try {
    const local = localStorage.getItem(name);

    if (local !== null) {
      return JSON.parse(local);
    }

    return null;
  } catch (error) {
    console.error("getDataLocal error:", error);

    return null;
  }
};

// window.getСookiesID = getСookiesID;

// window.getDateCookie = getDateCookie;

initPageTracking();

const injectStyles = () => {
  const style = document.createElement("style");

  style.type = "text/css";

  style.textContent = styleCss;

  document.head.append(style);
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    injectStyles();

    teorikaInit()

    if (teorikaReg) window.teorikaReg = teorikaReg;

    if (teorikaAuth) window.teorikaAuth = teorikaAuth;

    return;
    // if (checkScenarios) {
    //   await checkScenarios(teorikaConfig);
    // }

    // if (startScheme) {
    //   await startScheme();
    // }

    // const dateCookie = await getDataLocal("registration_form_data");

    // if (dateCookie) {
    //   if (dateCookie.event === "registration") {
    //     await teorikaReg(dateCookie);
    //   } else if (dateCookie.event === "auth") {
    //     await teorikaAuth(dateCookie);
    //   }
    // }
  } catch (error) {
    console.error("Ошибка виджета теорики:", error);
  }
});
