const Movies = require('../models/movies');

const OK = 200;
const CREATED = 201;

const NotFound = require('../errors/not_found'); // 404
const Forbidden = require('../errors/forbidden'); // 403
const BadRequest = require('../errors/bad-request'); // 400

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const addMovie = new Movies({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  });

  addMovie.save()
    .then((savedFilm) => {
      res.status(CREATED).send(savedFilm);
    })
    .catch((error) => {
      next(error);
    });
};

const getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movies) => res.status(OK).send(movies))
    .catch((error) => {
      next(error);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movies.findById(movieId)
    .orFail(new NotFound('Такого фильма не существует!'))
    .then((film) => {
      if (!film.owner.equals(req.user._id)) {
        next(new Forbidden('Нельзя удалить чужой фильм'));
      } else {
        film.deleteOne()
          .then(() => res.send(film));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Некорректный ID фильма'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
