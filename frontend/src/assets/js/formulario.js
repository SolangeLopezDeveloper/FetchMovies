
window.onload = async () => {
    const $ = (id) => document.getElementById(id)
    const urlBase = "http://localhost:3031/api/movies/"
    
    let query = new URLSearchParams(location.search); //esto lee mi url y me devuelve los parámetros y
    // una serie de métodos, se llama instanciar.
    let id = query.has('id') && query.get('id')

    try {
        let response = await fetch(urlBase + id)//cuando es por get mando solo el endpoint
        let pelicula = await response.json();
        let { title, awards, rating, length : duration, release_date } = pelicula.data
        //console.log(title);

        let dateFormat = moment(release_date).format('YYYY-MM-DD')


        $('title').value = title;
        $('rating').value = rating;
        $('length').value = duration;
        $('awards').value = awards;
        $('release_date').value = dateFormat;
    }catch(error){
        console.error
    }
    
    document.querySelector('.formulario').addEventListener('submit', async(e) => {
        e.preventDefault();
        try {
            let response = await fetch(urlBase + 'update/' + id, {
                method: 'PUT',
                body: JSON.stringify({
                    title: $('title').value,
                    rating: $('rating').value,
                    length: $('length').value,
                    awards: $('awards').value,
                    release_date: $('release_date').value 
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            let result = await response.json()
            console.log(result)
        }catch(error){
        console.error
    }
})
const crear = document.getElementById('agregar')
const a = document.createElement("a");
a.setAttribute("href", "crear.html"); 
a.setAttribute("class", "botonAgregar");
a.textContent = 'Crear Una Nueva Película'
crear.appendChild(a)

const eliminarButton = document.getElementById("eliminarButton");
eliminarButton.addEventListener("click", () => {
    Swal.fire({
        title: "¿Estás seguro de que deseas eliminar esta película?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarPelicula(id);
        }
    });
});
function eliminarPelicula(movieId) {
    fetch(urlBase + "delete/" + movieId, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(result => {
            const message = document.createElement("h2");
            message.textContent = "Película eliminada";
            message.style.fontSize = "24px";
            document.body.appendChild(message);
      
            window.location.href = "home.html";
        })
        .catch(error => {
            console.error(error);
        });
}
};


