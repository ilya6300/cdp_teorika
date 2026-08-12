1. ## Анализ опитимизации и на скрытые ошибки

1.1 Проанализировать файл @api.request.js, а именно методы teorikaReg и teorikaAuth.
1.2 Подготовить экспорт этих методов для импорта на сторонние сайты cdp


2. ## Импорт отдельных методов

У нас есть тестовый сайт

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="upgrade-insecure-requests"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Timeweb test</title>
  </head>
  <body>
    <div class="container">Теорика ТЕСТ</div>
    <!-- Тестовые ссылки начало -->
    <p>Ссылки</p>
    <p><a href="./pages/page1.html">page1</a></p>
    <p><a href="./pages/page2.html">page2</a></p>
    <p><a href="./pages/page3.html">page3</a></p>
    <!-- Тестовые ссылки конец -->
    <!-- Форма начало-->
    <form
      style="
        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          &quot;Segoe UI&quot;,
          Roboto,
          sans-serif;
        border: 1px solid #3dd4e1;
        width: 100%;
        max-width: 400px;
        margin: 20px;
        padding: 25px;
        border-radius: 8px;
        background: #3dd4e11a; /* Тот же полупрозрачный фон */
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 16px;
      "
    >
      <!-- Поле: Имя -->
      <div style="display: flex; flex-direction: column; gap: 6px">
        <label style="font-size: 14px; color: #7f7f7f; font-weight: 500"
          >Имя</label
        >
        <input
          type="text"
          name="first_name"
          style="
            padding: 10px 12px;
            border: 1px solid #3dd4e1;
            border-radius: 6px;
            font-size: 15px;
            color: #333;
            background: #fff;
            outline: none;
            box-sizing: border-box;
            width: 100%;
          "
        />
      </div>

      <!-- Поле: Фамилия -->
      <div style="display: flex; flex-direction: column; gap: 6px">
        <label style="font-size: 14px; color: #7f7f7f; font-weight: 500"
          >Фамилия</label
        >
        <input
          type="text"
          name="last_name"
          style="
            padding: 10px 12px;
            border: 1px solid #3dd4e1;
            border-radius: 6px;
            font-size: 15px;
            color: #333;
            background: #fff;
            outline: none;
            box-sizing: border-box;
            width: 100%;
          "
        />
      </div>

      <!-- Поле: Email -->
      <div style="display: flex; flex-direction: column; gap: 6px">
        <label style="font-size: 14px; color: #7f7f7f; font-weight: 500"
          >Email</label
        >
        <input
          type="text"
          name="email"
          style="
            padding: 10px 12px;
            border: 1px solid #3dd4e1;
            border-radius: 6px;
            font-size: 15px;
            color: #333;
            background: #fff;
            outline: none;
            box-sizing: border-box;
            width: 100%;
          "
        />
      </div>

      <!-- Поле: Телефон -->
      <div style="display: flex; flex-direction: column; gap: 6px">
        <label style="font-size: 14px; color: #7f7f7f; font-weight: 500"
          >Телефон</label
        >
        <input
          type="text"
          name="phone"
          style="
            padding: 10px 12px;
            border: 1px solid #3dd4e1;
            border-radius: 6px;
            font-size: 15px;
            color: #333;
            background: #fff;
            outline: none;
            box-sizing: border-box;
            width: 100%;
          "
        />
      </div>

      <!-- Кнопка отправки -->
      <button
        type="submit"
        style="
          margin-top: 8px;
          padding: 12px;
          background: #3dd4e1;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.2s ease;
          width: 100%;
        "
        onmouseover="this.style.opacity = '0.9'"
        onmouseout="this.style.opacity = '1'"
      >
        Отправить
      </button>
    </form>
    <!-- Сводобная кнопка начало -->
    <button
      style="
        margin-top: 8px;
        padding: 12px;
        background: #3dd4e1;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: opacity 0.2s ease;
        width: 320px;
      "
      onmouseover="this.style.opacity = '0.9'"
      onmouseout="this.style.opacity = '1'"
    >
      Просто кнопка
    </button>
    <!-- Сводобная кнопка конец -->
    <!-- Форма конец -->
    <script src="https://ilya6300.github.io/cdp_teorika/dist/teorikaModule.js"></script>
   </body>
</html>

2.1 При нажатие на кнопку формы "Регистрация" должен отработать метод регистрации и передать данные агрументом
2.2 При нажатие на кнопку "Авторизация" необходимо вызвать метод авторизации и передать данные агрументом


