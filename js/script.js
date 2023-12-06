const global = {
  currentPage: window.location.pathname,
  search: {
    term:'',
    type:'',
    page:1,
    totalPages: 1
  },
  api:{
    apiKey: '5c6bdcd939359fd514270f993c5e79b9',
    apiUrl: 'https://api.themoviedb.org/3/'
  }
};

// Display 20 most popular MOVIES
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular'); // {results} <= {resutls:{...},{...},{...}}
  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img src="http://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
          : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>
    `;

    document.querySelector('#popular-movies').appendChild(div);
  });
}

// Display 20 most popular TV shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular'); // {results} <= {resutls:{...},{...},{...}}
  results.forEach(show => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img src="http://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="show Title" />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date: ${show.first_air_date}</small>
        </p>
      </div>
      `;

    document.querySelector('#popular-shows').appendChild(div);
  });
}

// Display Movie Details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  // Overlay for background image
  displaybackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<img src="http://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
      : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $ ${addCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $ ${addCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${movie.production_companies
    .map(company => `<span>${company.name}</span>`)
    .join(', ')}</div>
</div>
  `;

  document.querySelector('#movie-details').appendChild(div);
}
// Display Show Details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];

  const show = await fetchAPIData(`tv/${showId}`);

  // Overlay for background image
  displaybackgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    show.poster_path
      ? `<img src="http://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}" />`
      : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}" />`
  }
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map(genre => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episodes to Air:</span> ${
      show.last_episode_to_air.name
    }</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${show.production_companies
    .map(company => `<span>${company.name}</span>`)
    .join(', ')}</div>
</div>
  `;

  document.querySelector('#show-details').appendChild(div);
}

// Display backdrop on Details Pages
function displaybackgroundImage(type, backgroundPath) {
  const overLayDiv = document.createElement('div');
  overLayDiv.style.backgroundImage = `url(http://image.tmdb.org/t/p/original/${backgroundPath})`;
  overLayDiv.style.backgroundSize = 'cover';
  overLayDiv.style.backgroundPosition = 'center';
  overLayDiv.style.backgroundRepeat = 'no-repeat';
  overLayDiv.style.height = '100vh';
  overLayDiv.style.width = '100vw';
  overLayDiv.style.position = 'absolute';
  overLayDiv.style.top = '0';
  overLayDiv.style.left = '0';
  overLayDiv.style.zIndex = '-1';
  overLayDiv.style.opacity = '0.15';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overLayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overLayDiv);
  }
}

// Search Movies/Shows
async function search(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if(global.search.term !== '' && global.search.term !== null){
    // @todo - make request and display results
    const results = await searchAPIData();
    console.log(results);
  }else{
    showAlert('Please enter a search term');
  }


}


// Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `

        <a href="movie-details.html?id=${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
        </h4>

    `;
    document.querySelector('.swiper-wrapper').appendChild(div);
  });

  initSwipper();
}

function initSwipper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Make Request to Search
async function searchAPIData() {
  const API_KEY = global.api.apiKey; //shouldn't be here in production;
  const API_URL = global.api.apiUrl;

  showSpinner();
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
  ); //should be on SERVER if it is in production

  const data = await response.json();
  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Highlight active link
function hightlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Show Alert
function showAlert(message,className){
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert',className);
  alertEl.appendChild(document.createTextNode(message))
  document.querySelector('#alert').appendChild(alertEl);


  setTimeout(()=>{alertEl.remove()},3000);

}


function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// init app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;

    case '/shows.html':
      displayPopularShows();
      break;

    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      search();
      break;
  }

  hightlightActiveLink();
}
document.addEventListener('DOMContentLoaded', init);
