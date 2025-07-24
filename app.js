// Función que convierte el nombre de la carta a un nombre de archivo válido
function getCardImagePath(name) {
  // Detectar si es arcano mayor o menor (con "de")
  if (name.toLowerCase().includes("de")) {
    // Por ejemplo "diez de espadas" -> "diez-de-espadas.jpg"
    return `images/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
  } else {
    // Arcano mayor, ej: "El Loco" -> "el-loco.jpg"
    return `images/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('spread');
  const choices = new Choices(element, {
    searchEnabled: false,  // desactiva búsqueda si no quieres
    itemSelectText: '',    // elimina texto extra al seleccionar
    shouldSort: false      // mantener el orden original
  });
});

document.getElementById("draw").addEventListener("click", async () => {
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

    // Limpiar clases y contenido previo
    cardsDiv.className = "cards-container";

    // Agregar clase según tirada para posicionamiento
    if (spread === 7) {
      cardsDiv.classList.add("horseshoe");
    } else if (spread === 10) {
      cardsDiv.classList.add("cross");
    }

    cardsDiv.innerHTML = "";

    // Renderizar cada carta
    data.cards.forEach((card, i) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      
       // Si la carta está invertida, añade la clase 'reversed'
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

    // Mostrar interpretación
    interpDiv.innerHTML = `<p><strong>Interpretación:</strong><br>${data.interpretation}</p>`;
  } catch (error) {
    cardsDiv.innerHTML = "Error al conectar con el servidor.";
    interpDiv.innerHTML = "";
    console.error(error);
  }
});
