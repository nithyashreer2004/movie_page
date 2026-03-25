import { useEffect, useState } from "react";
import "./App.css";

const API = "https://www.omdbapi.com/";
const KEY = "c9bb8db5";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("fav")) || []
  );
  const [email, setEmail] = useState("");

  // ✅ POPUP STATE
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const random = ["batman", "avengers", "spiderman", "joker"];

  // ✅ Safe image
  const getImage = (poster) => {
    if (!poster || poster === "N/A") {
      return "https://dummyimage.com/300x450/000/fff&text=No+Image";
    }
    return poster;
  };

  // ✅ FETCH MOVIES
  useEffect(() => {
    const query =
      search.trim() === ""
        ? random[Math.floor(Math.random() * random.length)]
        : search;

    fetch(`${API}?apikey=${KEY}&s=${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.Search) {
          const uniqueMovies = [
            ...new Map(
              data.Search.map((m) => [m.imdbID, m])
            ).values(),
          ];
          setMovies(uniqueMovies);
        } else {
          setMovies([]);
        }
      })
      .catch(() => setMovies([]));
  }, [search]);

  // ✅ FETCH MOVIE DETAILS (IMPORTANT FIX)
  const getMovieDetails = (id) => {
    fetch(`${API}?apikey=${KEY}&i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DETAILS:", data); // debug

        if (data && data.Response !== "False") {
          setSelectedMovie(data);
          setShowPopup(true);
        } else {
          alert("Movie details not found");
        }
      })
      .catch(() => alert("Error fetching details"));
  };

  // ✅ FAVORITES
  const toggleFav = (movie) => {
    const exist = favorites.find(
      (f) => f.imdbID === movie.imdbID
    );

    let updated;

    if (exist) {
      updated = favorites.filter(
        (f) => f.imdbID !== movie.imdbID
      );
    } else {
      updated = [...favorites, movie];
    }

    setFavorites(updated);
    localStorage.setItem("fav", JSON.stringify(updated));
  };

  const removeFav = (id) => {
    const updated = favorites.filter(
      (movie) => movie.imdbID !== id
    );

    setFavorites(updated);
    localStorage.setItem("fav", JSON.stringify(updated));
  };

  /* ================= LOGIN ================= */

  if (!user) {
    return (
      <div className="login">
        <div className="login-card">
          <h1>MOVIE PAGE</h1>
          <h2>Sign In</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input type="password" placeholder="Password" />

          <button
            onClick={() => {
              if (!email) {
                alert("Enter email");
                return;
              }
              localStorage.setItem("user", email);
              setUser(email);
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2>MOVIE PAGE</h2>

        <button onClick={() => setFavoritesOpen(true)}>
          ❤️ Favorites
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
          }}
        >
          Logout
        </button>
      </nav>

      {/* SEARCH */}
      <div className="controls">
        <input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

     {/* MOVIES */}
<div className="container">
  {movies.length > 0 ? (
    movies.map((movie) => (
      <div
        className="movie"
        key={movie.imdbID}
        onClick={() => getMovieDetails(movie.imdbID)}
      >
        <img
          src={getImage(movie.Poster)}
          alt={movie.Title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://dummyimage.com/300x450/000/fff&text=No+Image";
          }}
        />

        {/* ❤️ FAVORITE BUTTON (stop click bubbling) */}
        <button
          className="fav"
          onClick={(e) => {
            e.stopPropagation(); // ✅ IMPORTANT
            toggleFav(movie);
          }}
        >
          {favorites.some(
            (f) => f.imdbID === movie.imdbID
          )
            ? "❤️"
            : "🤍"}
        </button>

        <h4>{movie.Title}</h4>
      </div>
    ))
  ) : (
    <p style={{ textAlign: "center" }}>
      No movies found
    </p>
  )}
</div>

      {/* FAVORITES POPUP */}
      {favoritesOpen && (
        <div
          className="popup"
          onClick={() => setFavoritesOpen(false)}
        >
          <div
            className="popup-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>My Favorites</h2>

            <div className="fav-grid">
              {favorites.length > 0 ? (
                favorites.map((movie) => (
                  <div
                    className="fav-card"
                    key={movie.imdbID}
                  >
                    <img
                      src={getImage(movie.Poster)}
                      alt={movie.Title}
                    />
                    <p>{movie.Title}</p>

                    <button
                      onClick={() =>
                        removeFav(movie.imdbID)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p>No favorites yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOVIE DETAILS POPUP */}
{showPopup && selectedMovie && (
  <div className="popup" onClick={() => setShowPopup(false)}>
    <div
      className="popup-card horizontal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* LEFT SIDE → IMAGE */}
      <div className="popup-left">
        <img
          src={
            selectedMovie.Poster !== "N/A"
              ? selectedMovie.Poster
              : "https://dummyimage.com/300x450/000/fff&text=No+Image"
          }
          alt={selectedMovie.Title}
        />
      </div>

      {/* RIGHT SIDE → DETAILS */}
      <div className="popup-right">
        <h2>{selectedMovie.Title}</h2>

        <p><b>Year:</b> {selectedMovie.Year}</p>
        <p><b>Genre:</b> {selectedMovie.Genre}</p>
        <p><b>Director:</b> {selectedMovie.Director}</p>
        <p><b>Actors:</b> {selectedMovie.Actors}</p>
        <p><b>Rating:</b> ⭐ {selectedMovie.imdbRating}</p>

        <p className="plot">{selectedMovie.Plot}</p>

        <button onClick={() => setShowPopup(false)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;