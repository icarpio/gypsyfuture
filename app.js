// ==========================
// 👁️‍🗨️ FUNCIÓN DE IMAGENES
// ==========================
function getCardImagePath(name) {
  if (name.toLowerCase().includes("de")) {
    return `images/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
  } else {
    return `images/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
  }
}

// ==========================
// 📦 INICIALIZAR SELECT
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('spread');
  const choices = new Choices(element, {
    searchEnabled: false,
    itemSelectText: '',
    shouldSort: false
  });

  // 🔥 1️⃣ Intentar lanzar popunder al cargar
  setTimeout(() => {
    if (window.popCount === undefined) window.popCount = 0;

    if (popCount < 1) {
      simulatePopunderClick();
      popCount++;
    }
  }, 500);
});

// ==========================
// 🔮 BOTÓN "TIRAR LAS CARTAS"
// ==========================
document.getElementById("draw").addEventListener("click", async () => {
  // 🔥 2️⃣ Intentar lanzar popunder en clic del botón
  if (window.popCount === undefined) window.popCount = 0;

  if (popCount < 2) {
    simulatePopunderClick();
    popCount++;
  }

  const spread = parseInt(document.getElementById("spread").value);
  const cardsDiv = document.getElementById("cards");
  const interpDiv = document.getElementById("interpretation");

  cardsDiv.innerHTML = `
    <img src="images/loading.png" alt="Cargando" class="spinner-icon" />
  `;
  interpDiv.innerHTML = "";

  try {
    const response = await fetch("https://albertaapi.onrender.com/tarotapi/draw/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spread })
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const data = await response.json();

    cardsDiv.className = "cards-container";

    if (spread === 7) {
      cardsDiv.classList.add("horseshoe");
    } else if (spread === 10) {
      cardsDiv.classList.add("cross");
    }

    cardsDiv.innerHTML = "";

    data.cards.forEach((card, i) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");

      if (card.position.toLowerCase() === "invertida") {
        cardDiv.classList.add("reversed");
      }

      const img = document.createElement("img");
      img.src = getCardImagePath(card.name);
      img.alt = card.name;
      img.classList.add("card-image");

      const text = document.createElement("p");
      text.textContent = `${i + 1}. ${card.name} (${card.position})`;

      cardDiv.appendChild(img);
      cardDiv.appendChild(text);
      cardsDiv.appendChild(cardDiv);
    });

    interpDiv.innerHTML = `<p><strong>Interpretación:</strong><br>${data.interpretation}</p>`;
  } catch (error) {
    cardsDiv.innerHTML = "Error al conectar con el servidor.";
    interpDiv.innerHTML = "";
    console.error(error);
  }
});

// ==========================
// 🎯 SIMULAR CLIC PARA POPUNDER
// ==========================
function simulatePopunderClick() {
  try {
    const evt = new MouseEvent("click", { bubbles: true, cancelable: true });
    document.body.dispatchEvent(evt);
  } catch (e) {
    console.error("No se pudo simular el clic para popunder:", e);
  }
}
