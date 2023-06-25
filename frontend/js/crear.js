window.onload = async () => {
    const $ = (id) => document.getElementById(id)
    const urlBase = "http://localhost:3031/api/movies/";

    document.querySelector(".formAdd").addEventListener("submit", async (e) => {
      e.preventDefault();

      let title = $('title').value;
      let rating = $('rating').value;
      let length = $('length').value;
      let awards = $('awards').value;
      let release_date = $('release_date').value;

      try {
        let response = await fetch(urlBase + 'create/', {
          method: 'POST',
          body: JSON.stringify({
            title,
            rating,
            length,
            awards,
            release_date
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let result = await response.json();
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    });
    const homeButton = document.getElementById("botonHome");
    const a = document.createElement("a");
    a.setAttribute("href", "home.html"); 
    a.setAttribute("class", "botonAgregar");
    a.textContent = 'Home'
    homeButton.appendChild(a)

  };