const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
      'api_key': API_KEY,
    },
  });

  // Utils
function createMovies(movies, container) {
    container.innerHTML='';

    movies.forEach(movie => {
        container.innerHTML += `
        <div class="movie-container">
            <a href='#movie=${movie.id}'>
                <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}"
                class="movie-img"
                alt="${movie.title}"/>
            </a>
        </div>`
    });
}
  
function createCategories(categories, container) {
container.innerHTML = "";
categories.forEach(category => {
    container.innerHTML += `
    <div class="category-container">
        <a href="#category=${category.id}-${category.name}">
            <h3 id="id${category.id}" class="category-title">${category.name}</h3>
        </a>
    </div>`
});
}

//  Llamadas a la API
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList);
}

async function getCategegoriesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  genericSection.innerHTML = "";
  movies.forEach(movie => {
    genericSection.innerHTML += `
        <div class="movie-container">
            <a href='#movie=${movie.id}'>
                <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}"
                class="movie-img"
                alt="${movie.title}"/>
            </a>
        </div>`
  });
}

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
        query,
        },
    });
    const movies = data.results;

    createMovies(movies, genericSection);
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
  
    createMovies(movies, genericSection);
}

async function getMovieById(id) {
    const { data: movie } = await api('movie/' + id);
  
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    console.log(movieImgUrl)
    headerSection.style.background = `
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
      ),
      url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    
    getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
const { data } = await api(`movie/${id}/recommendations`);
const relatedMovies = data.results;
console.log(relatedMovies)

createMovies(relatedMovies, relatedMoviesContainer);
}