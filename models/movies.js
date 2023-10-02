const mongoose = require('mongoose');
const validator = require('validator');

const moviesSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Заполните поле - страна'],
  },
  director: {
    type: String,
    required: [true, 'Заолните поле - режиссер'],
  },
  duration: {
    type: Number,
    required: [true, 'Заполните поле - продолжительность фильма'],
  },
  year: {
    type: String,
    required: [true, 'Заполните поле - год создания'],
  },
  description: {
    type: String,
    required: [true, 'Заполните поле - описание'],
  },
  image: {
    type: String,
    required: [true, 'Добавьте ссылку на постер фильма'],
    validate: {
      validator: (image) => validator.isURL(image),
      message: 'Некорректный URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Добавьте ссылку на трейлер фильма'],
    validate: {
      validator: (trailer) => validator.isURL(trailer),
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Добавьте ссылку на миниатюрное изображение постера к фильму'],
    validate: {
      validator: (thumbnail) => validator.isURL(thumbnail),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    required: true,
    type: Number,
  },
  nameRU: {
    type: String,
    required: [true, 'Заполните поле - название RU'],
  },
  nameEN: {
    type: String,
    required: [true, 'Заполните поле - название EN'],
  },
});

module.exports = mongoose.model('movies', moviesSchema);
