const router = require('express').Router();
const { validateMovieInfo, validateMovieId } = require('../middlewares/validators');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', validateMovieInfo, createMovie);
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
