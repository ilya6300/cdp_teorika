export const debugElements = () => {
  // Кнопка трекинга
  const buttonTracking = document.createElement("button");
  buttonTracking.textContent = "Трекинг";
  buttonTracking.addEventListener("click", () => {
    sendPageTracking();
  });
  document.body.appendChild(buttonTracking);
};
