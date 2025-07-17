document.addEventListener("DOMContentLoaded", function () {
  let airports = [];

  // Загружаем JSON
  fetch("airports_500.json")
    .then(response => response.json())
    .then(data => {
      airports = data;

      // Подключаем автозаполнение к каждому полю
      setupAutocomplete("fromInput", "fromSuggestions", airports);
      setupAutocomplete("toInput", "toSuggestions", airports);
    })
    .catch(err => {
      console.error("Ошибка загрузки JSON:", err);
    });

  function setupAutocomplete(inputId, suggestionsId, data) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      suggestions.innerHTML = "";

      if (query.length < 2) return;

        const matches = data.filter(airport =>
          (airport.city || "").toLowerCase().includes(query) ||
          (airport.airport || "").toLowerCase().includes(query) ||
          (airport.iata || "").toLowerCase().includes(query) ||
          (airport.country || "").toLowerCase().includes(query)
        ).slice(0, 8);

      if (matches.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Ничего не найдено";
        suggestions.appendChild(li);
        return;
      }

      matches.forEach(airport => {
        const name = ` ${airport.city} (${airport.iata})`;
        const li = document.createElement("li");
        li.textContent = name;
        li.addEventListener("click", () => {
          input.value = name;
          suggestions.innerHTML = "";
        });
        suggestions.appendChild(li);
      });
    });

    document.addEventListener("click", e => {
      if (!e.target.closest(`#${inputId}`)) {
        suggestions.innerHTML = "";
      }
    });
  }
});
