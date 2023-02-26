import { useNavigate } from "react-router-dom";
import dummyPoster from "../default-movie-768x1129.jpg";

export default function MovieCard({ movie, toggleLiked, isLiked }) {
  const navigate = useNavigate();
  function showMovieDetails(e) {
    e.currentTarget.classList.add("show");
  }
  function hideMovieDetails(e) {
    e.currentTarget.classList.remove("show");
  }

  return (
    <div
      className="movie | rounded-200"
      tabIndex={0}
      onMouseOver={showMovieDetails}
      onMouseLeave={hideMovieDetails}
      onFocus={showMovieDetails}
      onBlur={hideMovieDetails}>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : dummyPoster
        }
        alt={movie.title}
      />
      <div
        className="movie__details | p-3"
        onClick={(e) => {
          if (!e.target.dataset.like) {
            navigate(`/movie/${movie.id}`);
          }
        }}>
        <p className="fw-bold fs-5 lh-1">{movie.title}</p>
        <p className="mb-0 fst-italic">
          <small>{new Date(movie.release_date).getFullYear() || null}</small>
        </p>
        <div>
          <i
            data-like="true"
            className={`fs-5 bi ${isLiked ? "bi-star-fill" : "bi-star"}`}
            onClick={() => toggleLiked(movie)}></i>
        </div>
      </div>
    </div>
  );
}
