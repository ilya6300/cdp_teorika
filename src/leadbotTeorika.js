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
  policyAllowed: true,
};

// Схема leadbot начало

const getСookiesValue = (name) => {
  const regCookie = new RegExp(`${name}=(.+?)(;|$)`);
  const results = document.cookie.match(regCookie);
  if (results !== null) {
    return results[1];
  } else {
    return "Не найден";
  }
};

const getSchemeTeorika = async () => {
  const scheme = await fetch(
    `${teoConfig.url}chatbot_scheme/url?name_url=${encodeURIComponent(window.location.origin).replace(/\/$/, "")}`,
  );
  const result = await scheme.json();

  window.setPoliticsLink(result.data.body);
  return result.data.struct_data;
};

export const startScheme = async () => {
  const res = await getSchemeTeorika();
  if (res) {
    createScheme(res);
  } else {
    console.warn("Не удалось получить схему для чат-бота");
  }
};

const createScheme = (scheme) => {
  try {
    const lidBot = document.querySelector("body");

    const url = "https://teorika.ru/api/v1/";
    const urlDC = "https://teorika.ru/api/dc/dc/";

    const infoChat = document.createElement("div");
    const myInfoChat = createInfoBlockIcon();
    const myBodyChat = createChatBody();
    const myChatIcon = createIconChat();
    const myHedderLidBot = createHeaderLidBot();
    const myChatMsgContainer = createMessagesContainer();
    const myChatContainer = createChatContainer();

    function myScroll() {
      setTimeout(() => {
        myChatMsgContainer.scrollBy({
          top: 1000,
          // behavior: "smooth",
        });
      }, 100);
    }
    let data = null;

    const createData = () => {
      data = {
        title: "",
        source_host: "CDP",
        phone: { active: false, value: "", id: "" },
        email: { active: false, value: "", id: "" },
        name: { active: false, value: "", id: "" },
        inn: { active: false, value: "", id: "" },
        application_page: window.location.href,
        mast_id: getСookiesValue("mast_id"),
        roistat: getСookiesValue("roistat_visit"),
        metrica: getСookiesValue("_ym_uid"),
        responsible: "",
        department: "",
        userPath: "",
      };
    };
    // Флаг ошибки незаполненых инпутов
    let inputErrorFlag = false;
    // Флаг заголовка
    let allowTitle = true;
    // Создание иконки скрытого чата
    function createIconChat() {
      const iconContainer = document.createElement("div");
      const iconChat = document.createElement("div");
      const iconPuls = document.createElement("div");
      iconContainer.classList.add("lid-bot-icon-container");
      iconPuls.classList.add("lid-bot-icon-puls");
      iconPuls.style.border = `1px solid ${scheme?.color}`;
      iconChat.classList.add("lid-bot-icon");
      iconChat.style.background = scheme?.color;
      iconChat.style.backgroundImage =
        "url(https://gk-mact.ru/images/chat-icon.png)";
      iconChat.style.backgroundSize = "contain";
      // background-image: url(https://gk-mact.ru/images/chat-icon.png);
      // background-size: contain;
      iconChat.onclick = () => {
        visibleMyChat();
      };
      iconContainer.append(iconChat, iconPuls);
      return iconContainer;
    }
    // Создание хедера
    function createHeaderLidBot() {
      const header = document.createElement("div");
      header.classList.add("my_hidden");
      const centerBlockHeader = document.createElement("div");
      const headerTitleUp = document.createElement("div");
      headerTitleUp.textContent = scheme?.title_message;
      headerTitleUp.classList.add("header-title-lid-bot-up");
      const headerTitleDown = document.createElement("div");
      headerTitleDown.classList.add("header-title-lid-bot-down");
      headerTitleDown.textContent = scheme?.subtitle_message;
      centerBlockHeader.append(headerTitleUp, headerTitleDown);
      const leftBlockHeader = document.createElement("img");
      leftBlockHeader.src = `https://prom-mact.ru/upload/medialibrary/222/dce7cz0xooqrzgudplu53domm64qg33g/icons8_return_32.png`;
      leftBlockHeader.classList.add("btn-home-chat-container");
      leftBlockHeader.onclick = () => {
        goHomeChat();
      };
      const rightBlockHeader = document.createElement("div");

      rightBlockHeader.classList.add("btn-hidden-chat-container");
      rightBlockHeader.onclick = () => {
        closedMyChat();
      };
      header.append(centerBlockHeader, rightBlockHeader, leftBlockHeader);
      return header;
    }
    // Открыть чат
    const visibleMyChat = () => {
      myChatIcon.classList.add("my_hidden");
      myInfoChat.classList.add("my_hidden");
      myChatContainer.classList.add("lid-bot-container-visible");
      myChatContainer.style.background = scheme?.color;
      myChatContainer.classList.remove("lid-bot-container-closed");
      myChatContainer.classList.remove("my_hidden");
      setTimeout(() => {
        myBodyChat.classList.remove("my_hidden");
        myBodyChat.classList.add("lid-bot-body-chat");
        myHedderLidBot.classList.remove("my_hidden");
        myHedderLidBot.classList.add("mast-header-lid-bot");
      }, 500);
    };
    // Закрыть чат
    const closedMyChat = () => {
      myBodyChat.classList.add("my_hidden");
      myBodyChat.classList.remove("lid-bot-body-chat");
      myHedderLidBot.classList.add("my_hidden");
      myHedderLidBot.classList.remove("mast-header-lid-bot");
      myChatContainer.classList.remove("lid-bot-container-visible");
      myChatContainer.classList.add("lid-bot-container-closed");
      myChatContainer.style.background = scheme?.color;
      setTimeout(() => {
        myChatContainer.classList.add("my_hidden");
        myChatIcon.classList.remove("my_hidden");
        myInfoChat.classList.remove("my_hidden");
      }, 500);
    };
    // Создание контейнер открытого чата
    function createChatContainer() {
      const chatContainer = document.createElement("div");
      chatContainer.innerHTML = "";
      chatContainer.classList.add("my_hidden");

      chatContainer.append(myHedderLidBot, myBodyChat);
      return chatContainer;
    }
    // Создание сообщения рядом с скрытым чатом
    function createInfoBlockIcon() {
      infoChat.onclick = () => {
        visibleMyChat();
      };
      infoChat.classList.add("lid-bot-info");
      infoChat.style.background = scheme?.color;
      infoChat.id = "lid-bot-info";
      infoChat.textContent = scheme?.info_string;
      return infoChat;
    }
    // создание контейнера тела чата
    function createChatBody() {
      const bodyChat = document.createElement("div");
      bodyChat.classList.add("lid-bot-body-chat");
      bodyChat.append(createBotAvatar(scheme?.robo_message));
      return bodyChat;
    }
    function createBotAvatar(message) {
      const containerAvatar = document.createElement("div");
      containerAvatar.innerHTML = "";
      containerAvatar.classList.add("my_chat_avatar_container");
      const avatarBot = document.createElement("img");
      avatarBot.src = scheme?.img_source;
      avatarBot.classList.add("avatar_my_bot");
      const titleBodyMessages = document.createElement("div");
      titleBodyMessages.textContent = message;
      titleBodyMessages.classList.add("title_message_my_chat");
      containerAvatar.append(avatarBot, titleBodyMessages);
      return containerAvatar;
    }
    // Контейнер с сообщениями
    function createMessagesContainer() {
      const messagas = document.createElement("div");
      messagas.classList.add("my-lid-msg_container");
      myBodyChat.append(messagas);

      return messagas;
    }
    function createBtnPostForm() {
      const sendFormBtn = document.createElement("button");
      sendFormBtn.textContent = "Отправить";
      sendFormBtn.classList.add("my_bot_btn_send_form");
      sendFormBtn.id = "my_bot_send_form_btn_lid";
      sendFormBtn.style.background = scheme?.color;
      sendFormBtn.onclick = (e) => {
        e.preventDefault();
        inputErrorFlag = false;
        const errorCheck = (condition, name) => {
          if (condition && data[name].active) {
            const searchInptError = document.getElementById(`${data[name].id}`);
            searchInptError.style.border = "1px solid red";
            inputErrorFlag = true;
          }
          if (!condition && data[name].active) {
            const searchInptError = document.getElementById(`${data[name].id}`);
            searchInptError.style.border = `1px solid ${scheme?.color}`;
            inputErrorFlag = false;
          }
        };
        errorCheck(data.name.value === "", "name");
        errorCheck(
          data.phone.value.length < 6 || data.phone.value.length > 20 === "",
          "phone",
        );
        errorCheck(data.email.value.length < 5, "email");
        if (inputErrorFlag) {
          return;
        }
        sendLead({
          title: data.title,
          source_host: data.source_host,
          phone: data.phone.value,
          email: data.email.value,
          name: data.name.value,
          application_page: data.application_page,
          mast_id: data.mast_id,
          roistat: data.roistat,
          metrika_client_id: data.metrica,
          responsible: String(data.responsible),
          department: data.department,
          comments: "Путь пользователя: " + data.userPath.replace(/,$/, ""),
        });
        myScroll();

        return console.log("данные отправлены");
      };

      return sendFormBtn;
    }

    function createMessageUserInfo(text) {
      const textMessage = document.createElement("div");
      textMessage.classList.add("user_msg_my_bot");
      textMessage.textContent = text;

      textMessage.style.border = `1px solid ${scheme.color}`;
      textMessage.style.color = scheme?.color;

      myChatMsgContainer.append(textMessage);
    }

    function createMessageUser(items) {
      const userVariant = document.createElement("div");
      items.forEach((item) => {
        if (item.type === "input") {
          const userMessages = document.createElement("div");
          userMessages.classList.add("user_msg_my_bot");
          userMessages.textContent = item.text;

          userMessages.style.border = `1px solid ${scheme.color}`;
          userMessages.style.color = scheme?.color;
          userVariant.append(userMessages);
          userMessages.onclick = () => {
            if (allowTitle) {
              data.title = item.text;
              allowTitle = false;
            }
            data.userPath += " '" + `${item.text}` + "',";
            userVariant.remove();
            createUserAnwer(item);
            if (item.data && item.data.length !== 0) {
              createMessageUser(item.data);
            }
          };
        }
        if (item.type === "form") {
          data.department = item.department?.id;
          data.responsible = item.manager?.id || "Менеджер отсутствует";
          const createElementForm = (inp) => {
            const nameLi = document.createElement("div");
            const inptLi = document.createElement("div");
            const inpt = document.createElement("input");
            nameLi.classList.add("my_bot_form_input_text");
            inpt.classList.add("my_bot_form_input");
            inpt.style.border = `1px solid ${scheme?.color}`;
            nameLi.textContent = inp.text;
            inpt.id = inp.id;
            if (inpt.id === "_teorika_name_scheam_chat") {
              data.name.active = true;
              inpt.placeholder = "Как Вас зовут?";
              data.name.id = "_teorika_name_scheam_chat";
            }
            if (inpt.id === "_teorika_email_scheam_chat") {
              data.email.active = true;
              inpt.placeholder = "Укажите Вашу почту";
              data.email.id = "_teorika_email_scheam_chat";
            }
            if (inpt.id === "_teorika_phone_scheam_chat") {
              data.phone.active = true;
              inpt.placeholder = "Укажите номер телефона";
              data.phone.id = "_teorika_phone_scheam_chat";
            }
            if (inpt.id === "_teorika_inn_scheam_chat") {
              data.inn.active = true || undefined;
              inpt.placeholder = "Укажите Ваш ИНН";
              data.inn.id = "_teorika_inn_scheam_chat";
            }
            inpt.onchange = (e) => {
              if (inpt.id === "_teorika_name_scheam_chat") {
                data.name.value = e.target.value;
              }
              if (inpt.id === "_teorika_email_scheam_chat") {
                data.email.value = e.target.value;
              }
              if (inpt.id === "_teorika_phone_scheam_chat") {
                data.phone.value = e.target.value;
              }
              if (inpt.id === "_teorika_inn_scheam_chat") {
                data.inn.value = e.target.value;
              }
            };
            inptLi.append(inpt);
            userVariant.append(nameLi, inptLi);
          };
          item.data.map((inp) => {
            createElementForm(inp);
          });
          createMessageUserInfo("Заполните форму и мы свяжемся с Вами!");
          userVariant.append(createBtnPostForm());
        }
      });
      myChatMsgContainer.append(userVariant);
    }

    function createMessageBot(item) {
      const botMessages = document.createElement("p");
      botMessages.classList.add("bot_msg_my_bot");
      botMessages.style.border = `1px solid ${scheme?.color}`;
      botMessages.textContent = item.text;
      myChatMsgContainer.append(botMessages);
      myScroll();
    }
    function createUserAnwer(item) {
      const anwerContainer = document.createElement("div");
      anwerContainer.classList.add("user_answers_my_bot_container");
      const anwer = document.createElement("p");
      anwerContainer.append(anwer);

      anwer.classList.add("user_answers_my_bot");
      anwer.style.background = scheme?.color;
      anwer.style.color = "white";
      anwer.textContent = item?.text;
      myChatMsgContainer.append(anwerContainer);
      myScroll();
    }

    // Служебные функции
    function getWeekFunc() {
      const days = ["В", "Б", "Б", "Б", "Б", "Б", "В"];
      const d = new Date();
      return days[d.getDay()];
    }
    const sendLead = async (dateRequest) => {
      const res = await fetch(
        `${urlDC}user_info/add_bitrix_task?filter_user=lead`,
        {
          method: "POST",
          // mode: "no-cors",
          body: JSON.stringify(dateRequest),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res.status === 200) {
        checkPostBot();
      } else {
        const sendFormBtnReplay = document.querySelector(
          "#my_bot_send_form_btn_lid",
        );
        sendFormBtnReplay.disabled = false;
        if (data.name.value) {
          createMessageBot({
            text: `Ошибка ${res.status}. ${data.name.value}, пожалуйста, попробуйте оставить запрос чуть позже. Или можете обратиться по телефону горячей линии 88007775167.`,
          });
        } else {
          createMessageBot({
            text: `Ошибка ${res.status}. Пожалуйста, попробуйте оставить запрос чуть позже. Или можете обратиться по телефону горячей линии 88007775167.`,
          });
        }
      }
    };

    function checkPostBot() {
      const day = getWeekFunc();
      if (day === "Б") {
        if (data.name.value) {
          createMessageBot({
            text: `${data.name.value}, cпасибо! Передаю ваши данные менеджеру. Мы с вами свяжемся в ближайшее время!`,
          });
        } else {
          createMessageBot({
            text: `Спасибо! Передаю ваши данные менеджеру. Мы с вами свяжемся в ближайшее время!`,
          });
        }
      } else if (day === "В") {
        if (data.name.value) {
          createMessageBot({
            text: `${data.name.value}, cпасибо! Сейчас мы не сможем ответить, но мы с вами свяжемся в ближайшее рабочее время!`,
          });
        } else {
          createMessageBot({
            text: `Cпасибо! Сейчас мы не сможем ответить, но мы с вами свяжемся в ближайшее рабочее время!`,
          });
        }
      }
    }
    // Рендер стартовых элементов
    async function renderLidBot(scheme) {
      try {
        createData();
        const searchChatContainer = document.querySelector(
          ".lid-bot-container-hidden",
        );
        const searchMyHiiden = document.querySelector(".my_hidden");
        if (searchChatContainer !== null) {
          searchChatContainer.remove();
        }
        if (searchMyHiiden !== null) {
          searchMyHiiden.remove();
        }
        const chatHiddenContainer = document.createElement("div");
        chatHiddenContainer.classList.add("lid-bot-container-hidden");
        chatHiddenContainer.append(myChatIcon);
        chatHiddenContainer.append(myInfoChat);
        lidBot.append(chatHiddenContainer, myChatContainer);
        if (scheme?.first_message !== "") {
          createMessageBot({ text: scheme?.first_message });
        }
        renderStep(scheme?.data);
      } catch (e) {
        console.error(e);
      }
    }
    function renderStep(items) {
      createMessageUser(items);
    }
    const goHomeChat = () => {
      myChatMsgContainer.innerHTML = "";
      data.userPath = "";
      allowTitle = true;
      renderStep(scheme?.data);
    };

    renderLidBot(scheme);
  } catch (e) {
    console.error(e);
  }
};

startScheme();
