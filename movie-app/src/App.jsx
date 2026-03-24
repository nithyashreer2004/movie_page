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

  const random = ["batman", "avengers", "spiderman", "joker"];

  useEffect(() => {
    const query =
      search === ""
        ? random[Math.floor(Math.random() * random.length)]
        : search;

    fetch(`${API}?apikey=${KEY}&s=${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Search) setMovies(data.Search);
      });
  }, [search]);

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

  /* LOGIN PAGE */

  if (!user) {
    return (
      <div className="login">
        <div className="login-card">
          <h1>MOVIE PAGE</h1>
          <h2>Sign In</h2>

          <input placeholder="Email" id="email" />
          <input
            type="password"
            placeholder="Password"
            id="pass"
          />

          <button
            onClick={() => {
              const email =
                document.getElementById("email").value;

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

  /* MOVIE PAGE */

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2>MOVIE PAGE</h2>

        <button
          onClick={() => setFavoritesOpen(true)}
        >
          ❤️ Favorites
        </button>
      </nav>

      {/* SEARCH */}
      <div className="controls">
        <input
          placeholder="Search movies..."
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* MOVIES */}
      <div className="container">
        {movies.map((movie) => (
          <div className="movie" key={movie.imdbID}>
            <img src={movie.Poster} />

            <button
              className="fav"
              onClick={() => toggleFav(movie)}
            >
              {favorites.find(
                (f) => f.imdbID === movie.imdbID
              )
                ? "❤️"
                : "🤍"}
            </button>

            <h4>{movie.Title}</h4>
          </div>
        ))}
      </div>

      {/* FAVORITES POPUP */}

      {favoritesOpen && (
        <div
          className="popup"
          onClick={() =>
            setFavoritesOpen(false)
          }
        >
          <div
            className="popup-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2>My Favorites</h2>

            <div className="fav-grid">
              {favorites.map((movie) => (
                <div
                  className="fav-card"
                  key={movie.imdbID}
                >
                  <img src={movie.Poster} />

                  <p>{movie.Title}</p>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFav(movie.imdbID)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;