const teorikaPopup = document.querySelector("#lid-bot-container-hidden");
const teoConfig = {
  url: "https://teorika.ru/api/v1/",
  // url: "https://teorika.ru/api/v1/",
  urlDC: "https://teorika.ru/api/dc/dc/",
  // url: null,
  id: null,
  idEvent: null,
  clickStat: 0,
  mast_id: "",
  eventCreate: false,
  viewAllowed: true,
  policyAllowed: true,
};

const tempStateNewYearPopup = [
  {
    origin: "https://gk-mact.ru",
    body: [
      "✅Спасибо за обращение!",
      "Мы ответим в ближайшее рабочее время (пн–пт, 09:00–18:00).",
    ],
    border: "#f0b323",
  },
  {
    origin: "https://prom-mact.ru",
    body: [
      "✅Спасибо за обращение!",
      "Мы ответим в ближайшее рабочее время (пн–пт, 09:00–18:00).",
    ],
    border: "#4fc3a1",
  },
];

const statFuncIncrement = async (event_id, event) => {
  try {
    if (teoConfig.clickStat <= 2) {
      teoConfig.clickStat++;
      const res = await fetch(
        `${teoConfig.url}report/update_count?id_online_scripts=${Number(event_id)}&mast_id=${teoConfig.mast_id}&event=${event}`,
        {
          mode: "no-cors",
        },
      );
    }
  } catch (e) {
    console.error(e);
  }
};

const createHtmlElement = (_tag, classes, props) => {
  const tag = document.createElement(_tag);
  if (props?.textContent) {
    tag.innerHTML = props?.textContent; //\00D7
  }
  if (props?.id) {
    tag.id = props?.id;
  }
  classes.forEach((cls) => {
    tag.classList.add(cls);
  });
  if (props?.funcClick) {
    props?.funcClick();
  }
  return tag;
};

const getСookiesValue = (name) => {
  const regCookie = new RegExp(`${name}=(.+?)(;|$)`);
  const results = document.cookie.match(regCookie);
  if (results !== null) {
    return results[1];
  } else {
    return "Не найден";
  }
};

const checkDate = () => {
  const d = window.btoa(new Date().toLocaleDateString());
  if (localStorage.getItem("req_time") !== d) {
    localStorage.setItem(
      "req_time",
      window.btoa(new Date().toLocaleDateString()),
    );
    if (localStorage.getItem("reqid")) {
      localStorage.removeItem("reqid");
    }
  }
};

const getСookies = async () => {
  const resCC = await fetch("https://teorika.ru/api/get-cookies", {
    credentials: "include", // отправляем куки
  });

  const r = await resCC.json();
  teoConfig.mast_id = r.cookies.mast_id;
  return r.cookies.mast_id;
};

const rtg = async () => {
  const r = await fetch(
    `${
      teoConfig.url
    }search/?mast_id=${await getСookies()}&url_project=${window.location.origin.replace(
      /\/$/,
      "",
    )}`,
  );
  const j = await r.json();
  console.log(
    "j ===>",
    j,
    window.location.origin,
    window.location,
    await getСookies(),
  );
  //
  teoConfig.id = j.data.individual.length - 1;
  const scenariosData = j.data.individual.concat(
    j.data.all_user ? j.data.all_user : [],
  );
  return scenariosData;
};

const converDateEvent = (r) => {
  if (JSON.parse(r.body).date === "") {
    return JSON.parse(r.body).date;
  } else {
    const inputDate = new Date().toLocaleDateString();
    const [day, month, year] = inputDate.split(".");
    const dateObj = new Date(year, month - 1, day);
    const formattedDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(dateObj)
      .replace(/\//g, "-");

    return formattedDate;
  }
};

// Все активные
const eventGet = async (r) => {
  const fitScenarios = r.filter(
    (s) =>
      (JSON.parse(s.body).is_active &&
        converDateEvent(s) == JSON.parse(s.body).date) ||
      (JSON.parse(s.body).is_active && "" == JSON.parse(s.body).date),
  );
  const scenarios = await Promise.all(
    fitScenarios.map(async (s) => {
      try {
        const res = await fetch(`${teoConfig.url}${s.type}/${s.id_event}`);
        const json = await res.json();
        return {
          data: json.data,
          event: s.event,
          timeout: JSON.parse(s.body).timeout * 1000,
          click: JSON.parse(s.body).click,
          url: JSON.parse(s.body).url,
          id: s.id,
        };
      } catch (error) {
        console.error(`Error fetching ${s.type}/${s.id_event}:`, error);
        return null; // или throw error, если нужно прервать
      }
    }),
  );
  return scenarios;
};

const renderStaticBlock = (event) => {
  if (event === "thenks") {
    const location = window.location.origin;
    const host = tempStateNewYearPopup.find((h) => h.origin === location);
    if (host) {
      const bodyHost = document.getElementsByTagName("body")[0];
      if (bodyHost) {
        const thanksBody = document.createElement("div");
        thanksBody.style.position = "fixed";
        thanksBody.style.zIndex = "999";
        thanksBody.style.left = 0;
        thanksBody.style.right = 0;
        thanksBody.style.top = 0;
        thanksBody.style.bottom = 0;
        thanksBody.style.display = "flex";
        thanksBody.style.alignItems = "center";
        thanksBody.style.justifyContent = "center";

        thanksBody.onclick = () => {
          thanksBody.remove();
        };
        const thanksUlContainer = document.createElement("div");

        // Стили
        thanksUlContainer.style.border = `2px solid ${host.border}`;
        thanksUlContainer.style.padding = "5vh 4vw";
        thanksUlContainer.style.background = "white";
        thanksUlContainer.style.maxWidth = "400px";
        thanksUlContainer.style.borderRadius = "3px";

        //
        host.body.forEach((text) => {
          const li = document.createElement("p");
          li.textContent = text;
          thanksUlContainer.append(li);
        });
        //
        thanksBody.append(thanksUlContainer);
        bodyHost.append(thanksBody);
      }
    }
  }
};

const blockCookiePolitics = () => {
  const containerRow = createHtmlElement("div", [
    "container_row_policy_teorika_",
  ]);
  const allowedInput = createHtmlElement("input", ["teoririka_relative"], {
    id: "inpt_policy_teorika_",
  });
  allowedInput.type = "checkbox";
  allowedInput.checked = teoConfig.policyAllowed;

  allowedInput.onclick = () => {
    teoConfig.policyAllowed = !teoConfig.policyAllowed;
  };
  const linkPolitics = createHtmlElement("a", ["text_row_policy_teorika_"]);
  const linkPolicy =
    window.settingsTeorika.link !== "" && window.settingsTeorika.link
      ? window.settingsTeorika.link
      : "https://gk-mact.ru/policy/privacy-policy.php";

  linkPolitics.href = linkPolicy;
  linkPolitics.textContent =
    "Согласен с политикой обработки персональных данных";
  linkPolitics.target = "_blank";
  containerRow.append(allowedInput, linkPolitics);
  return containerRow;
};

const renderScenarios = async (r) => {
  try {
    // Для всех сценариев
    const playScenarios = (event) => {
      if (!localStorage.getItem("reqid")) {
        localStorage.setItem("reqid", JSON.stringify([]));
      } else {
        const completedID = JSON.parse(localStorage.getItem("reqid"));
        if (completedID.find((id) => id === event.id)) {
          console.log("Сценарий уже отображался");
          return false;
        }
      }
      const idNew = JSON.parse(localStorage.getItem("reqid"));
      if (idNew) {
        idNew.push(event.id);
        localStorage.setItem("reqid", JSON.stringify(idNew));
      }
      return true;
    };

    const eventAll = await eventGet(r);

    if (eventAll) {
      eventAll.forEach((event) => {
        if (!teoConfig.viewAllowed) return;
        // const activUrl = window.location.href.replace(/\/$/, '').includes(event.url.replace(/\s+/g, ''));
        const activUrl = window.location.href.includes(
          event.url.replace(/\s+/g, ""),
        );
        if ((event && activUrl) || event.url === "") {
          if (!playScenarios(event)) return; // показывать повторно
          teoConfig.viewAllowed = false;

          const renderEvent = () => {
            if (event.event === "popup") {
              const body = document.querySelector("body");

              const t3p = createHtmlElement("div", [
                "popup_teorika_container_",
              ]);
              body.append(t3p);
              const t3pCloseBtn = createHtmlElement(
                "div",
                ["teorika-close-btn_"],
                { textContent: "&times;" },
              );
              const data = decodeURIComponent(
                escape(window.atob(event.data.data)),
              );
              const script_data = decodeURIComponent(
                escape(window.atob(event.data.script_data)),
              );
              t3p.innerHTML = data;
              const popupDiv__ = t3p.querySelector("div");
              const cookiePolitics = blockCookiePolitics();
              cookiePolitics.style.borderBottom = "1px solid #ffffff00";
              //
              popupDiv__.style.minWidth = "380px";
              const hDiv = popupDiv__.style.getPropertyPriority("height");
              if (hDiv !== "important") {
                popupDiv__.style.height = "auto";
                popupDiv__.style.gap = "17px";
              }
              if (popupDiv__.style.padding === "") {
                popupDiv__.style.padding = "30px 12px";
                popupDiv__.style.border = "none";
              }
              popupDiv__.append(cookiePolitics);
              statFuncIncrement(event.id, "view");
              // 4. Навешиваем обработчик на кнопки вну
              const scriptEl = document
                .createRange()
                .createContextualFragment(script_data);
              t3p.append(scriptEl, t3pCloseBtn);
              setTimeout(async () => {
                const bitrix24_lead_teorika_ = document.querySelector(
                  "#Bitrix24_lead_teorika_",
                );
                const bitrix24_deal_teorika_ = document.querySelector(
                  "#Bitrix24_deal_teorika_",
                );
                const bitrix24_tasks_teorika_ = document.querySelector(
                  "#Bitrix24_tasks_teorika_",
                );
                // Закрыть попап
                const t3pFormBtn = t3p.querySelector("span.btn");
                if (t3pFormBtn) {
                  t3pFormBtn.onclick = () => {
                    t3p.remove();
                  };
                }
                const popupConstructorClick = async () => {
                  if (!teoConfig.policyAllowed) {
                    // const inptPolicyTeorika_ = document.querySelector(
                    //   "#inpt_policy_teorika_",
                    // );
                    cookiePolitics.style.borderBottom = "1px solid red";
                    return;
                  }
                  const body = JSON.parse(event.data.body);
                  console.log("event ===>", body, event.data.type_event);
                  const dateRequest = {
                    title:
                      event.data.type_event === "Bitrix24_tasks_teorika_"
                        ? body.nameTask
                        : event.data.name,
                    mast_id: teoConfig.mast_id,
                    responsible: String(body.manager.id),
                  };
                  let btnIDPopup_ = "";

                  // Получение переменных с сайта
                  // if (getСookiesValue("sourceDomain")) {
                  dateRequest.source_host = "CDP";
                  // }
                  // if (getСookiesValue("entryUrl")) {
                  dateRequest.application_page = window.location.href;
                  // }
                  if (getСookiesValue("roistat_visit")) {
                    dateRequest.roistat = getСookiesValue("roistat_visit");
                  }
                  if (getСookiesValue("_ym_uid")) {
                    dateRequest.metrika_client_id = getСookiesValue("_ym_uid");
                  }
                  let inputErrorFlag = false;
                  const inputError = (nameID, value) => {
                    if (value === "") {
                      nameID.style.border = "1px solid #df2727";
                      inputErrorFlag = true;
                    }
                  };
                  for (let e = 0; e < 40; e++) {
                    const popupElement = document.querySelector(
                      `#${body.elementHTML[e]}`,
                    );
                    if (popupElement) {
                      if (popupElement.id === "popup_teorika_name_id_") {
                        // if (popupElement.id)
                        inputError(popupElement, popupElement.value);
                        dateRequest.name = popupElement.value;
                      }
                      // if (popupElement.id === "popup_teorika_inn_id_") {
                      // }
                      if (popupElement.id === "popup_teorika_phone_id_") {
                        dateRequest.phone = popupElement.value.replace(
                          /[^+0-9]/g,
                          "",
                        );
                        inputError(popupElement, popupElement.value);
                      }
                      if (popupElement.id === "popup_teorika_email_id_") {
                        dateRequest.email = popupElement.value;
                        inputError(popupElement, popupElement.value);
                      }
                      if (event.data.type_event === "Bitrix24_deal_teorika_") {
                        btnIDPopup_ = "deal";
                      }
                      if (event.data.type_event === "Bitrix24_lead_teorika_") {
                        btnIDPopup_ = "lead";
                        // dateRequest.comments = "";
                      }
                      if (event.data.type_event === "Bitrix24_tasks_teorika_") {
                        btnIDPopup_ = "task";
                      }
                    }
                  }
                  if (inputErrorFlag) return;
                  setTimeout(async () => {
                    const res = await fetch(
                      `${teoConfig.urlDC}user_info/add_bitrix_task?filter_user=${btnIDPopup_}`,
                      {
                        method: "POST",
                        // mode: "no-cors",
                        body: JSON.stringify(dateRequest),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      },
                    );
                    if (res) {
                      statFuncIncrement(event.id, "success");
                      const j = await res.json();
                    }
                  }, 400);
                  renderStaticBlock("thenks");
                  t3p.remove();
                };
                if (bitrix24_lead_teorika_) {
                  bitrix24_lead_teorika_.onclick = async () => {
                    popupConstructorClick();
                  };
                  bitrix24_lead_teorika_.style.cursor = "pointer";
                }
                if (bitrix24_deal_teorika_) {
                  bitrix24_deal_teorika_.style.cursor = "pointer";
                  bitrix24_deal_teorika_.onclick = async () => {
                    popupConstructorClick();
                  };
                }
                if (bitrix24_tasks_teorika_) {
                  bitrix24_tasks_teorika_.style.cursor = "pointer";
                  bitrix24_tasks_teorika_.onclick = async () => {
                    popupConstructorClick();
                  };
                }
                // Валидация
                const phoneInptValid = document.querySelector(
                  "#popup_teorika_phone_id_",
                );
                phoneInptValid.addEventListener("input", (e) => {
                  phoneInptValid.value = phoneInptValid.value.replace(
                    /[^+0-9]/g,
                    "",
                  );
                });
              }, 200); // микрозадержка, чтобы DOM успел обновиться

              t3pCloseBtn.onclick = () => {
                t3p.remove();
                // t3pContainer.style.display = "none";
                statFuncIncrement(event.id, "close");
              };
            }

            if (event.event === "чат-строка") {
              console.log("событие по таймингу чат-строка", event.timeout);
              const string_data = decodeURIComponent(
                escape(window.atob(event.data.string_data)),
              );
              const _div_container = createHtmlElement("div", [
                "teoririka_relative",
              ]);
              const _div = createHtmlElement(
                "div",
                ["lid-bot-info", "api_string"],
                {
                  textContent: string_data
                    .replace(/<div>/g, "")
                    .replace(/<\/div>/g, ""),
                },
              );
              _div.onclick = () => {
                statFuncIncrement(event.id, "success");
                _div_container.remove();
              };
              const _spanBtn = createHtmlElement(
                "span",
                ["api_string_close_btn"],
                { textContent: "&times;" },
              );
              _div_container.append(_div, _spanBtn);
              _spanBtn.onclick = () => {
                statFuncIncrement(event.id, "close");
                _div_container.remove();
              };
              const parent = document.querySelector(".lid-bot-info");
              parent.append(_div_container);
              statFuncIncrement(event.id, "view");
            }
          };

          setTimeout(() => {
            renderEvent();
            // clearInterval(intervalID);
          }, event.timeout);
        }
      });
    }

    //
  } catch (e) {
    console.error(e);
  }
};

export const checkScenarios = async (teorikaConfig) => {
  teoConfig.url = teorikaConfig.uplApi;
  await getСookies();
  checkDate();
  try {
    const r = await rtg();
    if (r) {
      await renderScenarios(r);
    }
  } catch (e) {
    console.error(e);
  }
};
