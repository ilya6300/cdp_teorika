import { teorikaConfig } from "./service/api/api.config.js";
import { teorikaReg, teorikaAuth } from "./service/api/api.request.js";
import { checkScenarios } from "./popup.js";
import { startScheme } from "./leadbotTeorika.js";
import { getСookiesID, getDateCookie } from "./utils/cookies.js";
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
      return local;
    }
  } catch {
    console.error(e);
  }
};

window.getСookiesID = getСookiesID;
window.getDateCookie = getDateCookie;

initPageTracking();

const injectStyles = () => {
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = styleCss;
  document.head.append(style);
};

window.addEventListener("DOMContentLoaded", async () => {
  try {
    injectStyles();

    if (teorikaReg) window.teorikaReg = teorikaReg;

    if (checkScenarios) {
      await checkScenarios(teorikaConfig);
    }
    if (startScheme) {
      await startScheme();
    }
    const dateCookie = getDataLocal("registration_form_data");
    if (dateCookie) {
      if (dateCookie.event === "registration") {
        await teorikaReg(dateCookie);
      }
    }
  } catch (error) {
    console.error("Ошибка виджета теорики:", error);
  }
});
