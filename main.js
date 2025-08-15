// References
const inputdata = document.querySelector(".input");
const searchbtn = document.querySelector(".fa-magnifying-glass");
const moviename = document.querySelector(".movieName");
const picture = document.querySelector(".photo");
const year = document.querySelector(".year");
const rating = document.querySelector(".rating");
const actors = document.querySelector(".actors");
const collections = document.querySelector(".collection");
const country = document.querySelector(".country");
const director = document.querySelector(".director");
const language = document.querySelector(".language");
const runtime = document.querySelector(".runtime");
const type = document.querySelector(".type");
const plot = document.querySelector(".plot");
const addbtn = document.querySelector(".btn1");
const favcontainer = document.querySelector(".fav-movie-box");

let movie = "";

// Fetch API Data
const getApi = async () => {
  let searchedmovie = inputdata.value.trim();
  if (!searchedmovie) return alert("Please enter a movie name.");

  const url = `http://www.omdbapi.com/?apikey=233367cc&t=${searchedmovie}`;
  const response = await fetch(url);
  movie = await response.json();

  if (movie.Response === "False") {
    alert("Movie not found!");
    return;
  }

  // Update DOM with movie data
  moviename.textContent = movie.Title;
  type.textContent = `Type: ${movie.Type}`;
  year.textContent = `Year: ${movie.Year}`;
  rating.textContent = `IMDB Rating: ${movie.imdbRating}`;
  actors.textContent = `Actors: ${movie.Actors}`;
  collections.textContent = `Boxoffice Collection: ${movie.BoxOffice}`;
  country.textContent = `Country: ${movie.Country}`;
  director.textContent = `Director: ${movie.Director}`;
  language.textContent = `Language: ${movie.Language}`;
  runtime.textContent = `Runtime: ${movie.Runtime}`;
  picture.src = movie.Poster;
  plot.textContent = movie.Plot;

  inputdata.value = ""; // Clear input
};

// Add to Favourites with unique serial number and duplicate check
const addtofav = () => {
  if (!movie || movie.Response === "False") {
    alert("No valid movie to add.");
    return;
  }

  let favList = JSON.parse(localStorage.getItem("favMovies")) || [];

  // Check for duplicate movie
  const alreadyAdded = favList.some(item => item.title === movie.Title);
  if (alreadyAdded) {
    alert("Movie already added to favourites.");
    return;
  }

  const favMovie = {
    Serialno: favList.length > 0 ? favList[favList.length - 1].Serialno + 1 : 1,
    title: movie.Title,
    poster: movie.Poster,
  };

  favList.push(favMovie);
  localStorage.setItem("favMovies", JSON.stringify(favList));
  createFavBox(favMovie);
};

// Create and Append Favourite Box
function createFavBox(fav) {
  const template = document.getElementById("template");
  const clone = template.content.cloneNode(true);
  const box = clone.querySelector(".fav-box");

  box.querySelector(".movie-name").textContent = fav.title;
  box.querySelector(".fav-image").src = fav.poster;
  box.querySelector(".serial-no").textContent = `${fav.Serialno}.`;

  const removeBtn = box.querySelector(".remove-btn");
  removeBtn.addEventListener("click", () => {
    box.remove();
    removeFromStorage(fav.Serialno);
  });

  favcontainer.appendChild(box);
}

// Remove from localStorage
function removeFromStorage(serial) {
  let favList = JSON.parse(localStorage.getItem("favMovies")) || [];
  favList = favList.filter((item) => item.Serialno !== serial);
  localStorage.setItem("favMovies", JSON.stringify(favList));
}

// Load Favourites on Page Load
const loadlist = () => {
  const favList = JSON.parse(localStorage.getItem("favMovies")) || [];
  for (let fav of favList) {
    createFavBox(fav);
  }
};

// Events
searchbtn.addEventListener("click", getApi);
addbtn.addEventListener("click", addtofav);
window.addEventListener("load", loadlist);
