const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const fetch = require('node-fetch');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;
const API = 'http://www.omdbapi.com/?apikey=7c7f3cb2';

const moviesController = {
    list: async (req, res) => {

        const urlBase= "https://www.omdbapi.com/";
        const apiKey = "7c7f3cb2";

        fetch(`${urlBase}?apiKey=${apiKey}`)
       .then(response => response.json())
       .then(movies => {
                return res.json(movies)
            })
    },
    detail: async(req,res) =>{
                try{
                   const urlBase= "https://www.omdbapi.com/";
                const apiKey = "7c7f3cb2";
                const id = req.params.id;
                const response = await fetch(`${urlBase}?apiKey=${apiKey}&i=${id}`)
                const movie = await response.json()

                
                return res.render('moviesDetail',{
                    movie:{
                        title: movie.Title,
                        Poster: movie.Poster,
                        rating: movie.imdbRating,
                        awards: movie.Awards,
                    
                    }
            })
        
                }  catch(error) {console.log(error)}
            },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui debo modificar para crear la funcionalidad requerida
   /*  'buscar': (req, res) => {
        const urlBase= "https://www.omdbapi.com/";
        const apiKey = "7c7f3cb2";
        const keyword = req.body.titulo;
        fetch(`${urlBase}?apiKey=${apiKey}&t=${keyword}`)
        .then(response =>{
            return response.json()
        }) .then(movie=>{
            return res.send(movie)
        })
        .catch((error)=> console.log(error))

    }, */
    buscar : async(req,res) =>{
        try{
          
            const urlBase= "https://www.omdbapi.com/";
        const apiKey = "7c7f3cb2";
        const keyword = req.body.titulo;
        const response = await fetch(`${urlBase}?apiKey=${apiKey}&t=${keyword}`)
        const movie = await response.json()

        return res.render('moviesDetailOmdb',{movie})

        }  catch(error) {console.log(error)}
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        
        Promise
        .all([promGenres, promActors])
        .then(([allGenres, allActors]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesAdd'), {allGenres,allActors})})
        .catch(error => res.send(error))
    },
    create: function (req,res) {
        Movies
        .create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            }
        )
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    edit: function(req,res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId,{include: ['genre','actors']});
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
        .all([promMovies, promGenres, promActors])
        .then(([Movie, allGenres, allActors]) => {
            Movie.release_date = moment(Movie.release_date).format('L');
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie,allGenres,allActors})})
        .catch(error => res.send(error))
    },
    update: function (req,res) {
        let movieId = req.params.id;
        Movies
        .update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
            })
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    delete: function (req,res) {
        let movieId = req.params.id;
        Movies
        .findByPk(movieId)
        .then(Movie => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesDelete'), {Movie})})
        .catch(error => res.send(error))
    },
    destroy: function (req,res) {
        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/movies')})
        .catch(error => res.send(error)) 
    }
}

module.exports = moviesController;