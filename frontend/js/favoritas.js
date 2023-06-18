window.onload = async () => {
  const app = document.getElementById("root");
  const container = document.createElement("div");
  container.setAttribute("class", "container");
  app.appendChild(container);
  const urlBase = "http://localhost:3031/api/movies/"
  // Aqui debemos agregar nuestro fetch
  try {
    let response = await fetch(urlBase)
    let peliculas = await response.json();

    let data = peliculas.data;
    const favorites = localStorage.getItem("favorites") ? JSON.parse(localStorage.getItem("favorites")) : [];

    let hasFavorites = false; 

    data.forEach((movie) => {
      const movieId = movie.id;

      if (!favorites.includes(movieId)) {
        return;
      }

      const card = document.createElement("div");
      card.setAttribute("class", "card");

      const h1 = document.createElement("h1");
      h1.textContent = movie.title;

      const p = document.createElement("p");
      p.textContent = `Rating: ${movie.rating}`;

      const duracion = document.createElement("p");
      duracion.textContent = `Duración: ${movie.length}`;

      container.appendChild(card);
      card.appendChild(h1);
      card.appendChild(p);
      if (movie.genre !== null) {
        const genero = document.createElement("p");
        genero.textContent = `Género: ${movie.genre.name}`;
        card.appendChild(genero);
      }
      card.appendChild(duracion);

      hasFavorites = true; 
    });

    if (!hasFavorites) {
      const card = document.createElement("div");
      card.setAttribute("class", "card");
      const message = document.createElement("h2");
      message.textContent = "Aún no has agregado películas a favoritas.";
      message.style.fontSize = "24px";
      card.appendChild(message);
      container.appendChild(card);
    }
  } catch (error) {
    console.error(error);
  }
};