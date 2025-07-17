document.getElementById("findTicketBtn").addEventListener("click", async function () {
  const from = document.querySelector('#fromInput')?.value.trim() || '';
  const to = document.querySelector('#toInput')?.value.trim() || '';
  const departureDate = document.querySelector('#departureDate')?.value || '';
  const returnDate = document.querySelector('#returnDate')?.value || '';
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // очищаем старые результаты

  if (!from || !to || !departureDate) {
    alert("Пожалуйста, заполните поля: Откуда, Куда и Дата вылета.");
    return;
  }

  const API_KEY = "e2d";
  const API_URL = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";

  const params = new URLSearchParams({
    origin: from,
    destination: to,
    departure_at: departureDate,
    currency: "rub",
    token: API_KEY
  });

  if (returnDate) {
    params.append("return_at", returnDate);
  }

  const url = `${API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.success || !data.data || Object.keys(data.data).length === 0) {
      resultsDiv.innerHTML = "<p>Билеты не найдены.</p>";
      return;
    }

    resultsDiv.innerHTML = "<h3>Найденные билеты:</h3>";

    Object.entries(data.data).forEach(([date, ticket]) => {
      const ticketDiv = document.createElement("div");
      ticketDiv.style.border = "1px solid #ccc";
      ticketDiv.style.padding = "10px";
      ticketDiv.style.marginBottom = "10px";
      ticketDiv.style.borderRadius = "8px";
      ticketDiv.style.backgroundColor = "#f9f9f9";

      ticketDiv.innerHTML = `
        <strong>${from} → ${to}</strong><br>
        Дата вылета: <strong>${date}</strong><br>
        Цена: <strong>${ticket.price}₽</strong><br>
        Авиакомпания: ${ticket.airline || "не указана"}<br>
        Пересадки: ${ticket.transfers}<br>
        Время вылета: ${ticket.departure_at}
      `;

      resultsDiv.appendChild(ticketDiv);
    });

  } catch (error) {
    console.error("Ошибка при запросе:", error);
    resultsDiv.innerHTML = "<p>Произошла ошибка при поиске билетов.</p>";
  }
});
