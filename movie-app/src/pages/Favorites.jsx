import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
    }

    const fav = JSON.parse(localStorage.getItem("fav")) || [];
    setFavorites(fav);
  }, []);

  return (
    <div className="fav-page">
      <nav className="navbar">
        <div className="logo">NETFLIX</div>

        <button onClick={() => navigate("/")}>
          Home
        </button>
      </nav>

      <h2 className="fav-title">My Favorites</h2>

      <div className="fav-grid">
        {favorites.map((movie) => (
          <div className="fav-card" key={movie.imdbID}>
            <img
  src={
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Image"
  }
/>

            <h4>{movie.Title}</h4>

            <p>{movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;