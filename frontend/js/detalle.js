window.onload = async () => {
    const app = document.getElementById("root");
    const container = document.createElement("div");
    container.setAttribute("class", "container");
    app.appendChild(container);
    const urlBase = "http://localhost:3031/api/movies/";

    let query = new URLSearchParams(location.search);
    let id = query.has("id") && query.get("id");

    try {
      let response = await fetch(urlBase + id);
      let pelicula = await response.json();
  console.log(pelicula);
      // Aquí puedes manipular la respuesta y mostrar los detalles de la película en el formulario o de la forma que desees
      let { title, rating, length, genre } = pelicula.data;

      const card = document.createElement("div");
      card.setAttribute("class", "card");

      const h1 = document.createElement("h1");
      h1.textContent = title;

      const p = document.createElement("p");
      p.textContent = `Rating: ${rating}`;

      const duracion = document.createElement("p");
      duracion.textContent = `Duración: ${length}`;

      container.appendChild(card);
      card.appendChild(h1);
      card.appendChild(p);
      if (genre !== null) {
        const genero = document.createElement("p");
        genero.textContent = `Genero: ${genre.name}`;
        card.appendChild(genero);
      }
      card.appendChild(duracion);
    } catch (error) {
      console.error(error);
    }
  };