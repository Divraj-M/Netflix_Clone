// const
// Dynamic api key 
const apiKey = "d3e04a94f9282f7ef84cf6ca7cba8ed6";
// base URL
const apiEndPoint = "https://api.themoviedb.org/3/";
// demo path
const imgPath = "https://image.tmdb.org/t/p/original";
const youtubeApi = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=the%20enforcer%2020trailer&key=AIzaSyA9meZN2VcJ5qIN7hdcVE0klNWpsAWTPDA"



const apiPaths = {
    fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending : `${apiEndPoint}/trending/all/day?api_key=${apiKey}`,
    fetchYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyA9meZN2VcJ5qIN7hdcVE0klNWpsAWTPDA`

}
 
// Boots up the app
function init() {
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}
function fetchTrendingMovies(){
    fetchAndbuildMoviesSection(apiPaths.fetchTrending, 'Trending Now')
    .then(list => {
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    }).catch(err =>{
        console.error(err);
    });
}
function buildBannerSection(movie){
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
    const div = document.createElement('div');
    div.innerHTML = `
    <h2 class="banner_title"> ${movie.title}</h2>
    <p class=""> Trending in movies | Released - ${movie.release_date} </p>
    <p class="banner_overview"> ${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>    
    <div class="action-buttons-cont">
       <button class="action-button"> &nbsp;  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard" data-name="Play"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg>  Play</button>
       <button class="action-button"> &nbsp; <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard" data-name="Info"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> More Info  </button>
    </div>
  `;
  div.className = "banner-content container";
  bannerCont.append(div);
}

function searchMovieTrailer(movieName, iframId){
    if (!movieName) return;
    fetch(apiPaths.fetchYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
        const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
         console.log(youtubeUrl);
         window.open(youtubeUrl,'_blank');
         document.getElementById(iframId).src =`https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0`;
        // console.log(youtube); 
    })
    .catch(err => console.log(err));
}

function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
        .then(res => res.json())
        .then(res => {
            const categories = res.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.forEach(category => {
                    fetchAndbuildMoviesSection(
                        apiPaths.fetchMoviesList(category.id),
                        category.name
                    );
                });
            }
            // console.table(movies);
        })
        .catch(err => console.error(err));
}
function fetchAndbuildMoviesSection(fetchUrl, categoryName) {
    console.log(fetchUrl, categoryName);
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            console.table(res.results)
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies, categoryName);
            }
            return movies;
        })
        .catch(err => console.error(err)) 
}
function buildMoviesSection(list, categoryName) {
    console.log(list, categoryName);

    const moviesCont = document.getElementById('movies-cont');

    const moviesListHTML = list.map(item => {
        return `
        <div class= "movies-item"  onmouseover = "searchMovieTrailer('${item.title}', 'yt${item.id}' )">
        <img class="movies-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}"/>
        <iframe width="245px" height="150px" src="" id="yt${item.id}" ></iframe>

       
        </div>
      

            `;
    }).join('');
    const moviesSectionHTML = ` 
             <h2 class="movies-section-heading">${categoryName} <span class="explore-nudge"> Explore All </span> </h2>
             <div class="movies-row">
                    ${moviesListHTML}
             </div>
         `

    console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className = 'movies-section'
    div.innerHTML = moviesSectionHTML;
    // Append html into container
    moviesCont.append(div);
}

window.addEventListener('load', function () {
    init();
    window.addEventListener('scroll', function(){
        // header ui update
        const header = document.getElementById('header');
        if(window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
     } )

    })