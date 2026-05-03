let movies = JSON.parse(localStorage.getItem("movies")) || [];
let currentUser = localStorage.getItem("user") || null;

function save() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

function login() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Enter username");
  currentUser = username;
  localStorage.setItem("user", username);
  document.getElementById("currentUser").innerText = "Logged in as: " + username;
}

function addMovie() {
  const title = document.getElementById("movieTitle").value;
  const genre = document.getElementById("movieGenre").value;

  if (!title || !genre) return alert("Fill fields");

  movies.push({
    title,
    genre,
    reviews: [],
    created: Date.now()
  });

  save();
  displayMovies();
}

function addReview(index) {
  if (!currentUser) return alert("Login first");

  const text = document.getElementById(`reviewText-${index}`).value;
  const rating = parseFloat(document.getElementById(`rating-${index}`).value);

  if (!text || rating < 0 || rating > 10) {
    return alert("Invalid review");
  }

  movies[index].reviews.push({
    user: currentUser,
    text,
    rating,
    likes: 0
  });

  save();
  displayMovies();
}

function likeReview(movieIndex, reviewIndex) {
  movies[movieIndex].reviews[reviewIndex].likes++;
  save();
  displayMovies();
}

function getAverage(reviews) {
  if (reviews.length === 0) return "N/A";
  let sum = reviews.reduce((a, b) => a + b.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

function displayMovies(list = movies) {
  const container = document.getElementById("movieList");
  container.innerHTML = "";

  list.forEach((movie, i) => {
    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <h3>${movie.title} (${movie.genre})</h3>
      <p>Average Rating: <span class="rating">${getAverage(movie.reviews)}</span></p>

      <input id="reviewText-${i}" placeholder="Write review">
      <input id="rating-${i}" type="number" min="0" max="10" placeholder="Rating /10">
      <button onclick="addReview(${i})">Submit</button>

      <div>
        ${movie.reviews.map((r, j) => `
          <div class="review">
            <b>${r.user}</b>: ${r.text} 
            (${r.rating}/10) 👍 ${r.likes}
            <button onclick="likeReview(${i}, ${j})">Like</button>
          </div>
        `).join("")}
      </div>
    `;

    container.appendChild(div);
  });
}

function sortMovies(type) {
  let sorted = [...movies];

  if (type === "high") {
    sorted.sort((a, b) => getAverage(b.reviews) - getAverage(a.reviews));
  } else if (type === "low") {
    sorted.sort((a, b) => getAverage(a.reviews) - getAverage(b.reviews));
  } else if (type === "recent") {
    sorted.sort((a, b) => b.created - a.created);
  }

  displayMovies(sorted);
}

function filterByGenre() {
  const genre = document.getElementById("genreFilter").value.toLowerCase();
  const filtered = movies.filter(m => m.genre.toLowerCase().includes(genre));
  displayMovies(filtered);
}
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("themeToggle");

  body.classList.toggle("light");

  if (body.classList.contains("light")) {
    btn.innerText = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    btn.innerText = "🌞 Light Mode";
    localStorage.setItem("theme", "dark");
  }
}

displayMovies();

if (currentUser) {
  document.getElementById("currentUser").innerText = "Logged in as: " + currentUser;
}