import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Wrapper from "../../components/Wrapper";
import dummyPoster from "../../default-movie-768x1129.jpg";

export default function Movie({ isLiked }) {
  const [movie, setMovie] = useState(undefined);
  const [credits, setCredits] = useState(undefined);
  const { id } = useParams();

  useEffect(() => {
    async function loadMovie() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      const responseJson = await response.json();
      setMovie(responseJson);
    }

    loadMovie();
  }, [id]);

  useEffect(() => {
    async function getCredits() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      const responseJson = await response.json();
      setCredits(responseJson);
    }

    getCredits();
  }, [id]);

  function makeGenres() {
    return movie.genres.map((_g) => _g.name).join(", ");
  }
  function makeActors() {
    return credits?.cast.map((_c) => _c.name).join(", ");
  }

  if (!movie) return <Loading />;

  return (
    <Wrapper className="pb-5">
      <div className="row mb-5">
        <div className="col-12 col-lg-4 me-4">
          <img
            className="rounded-200"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                : dummyPoster
            }
            alt={movie.title}
          />
        </div>
        <div className="details | col-12 col-lg-7">
          <h1 className="lh-1 me-2">{movie.title}</h1>

          <div className="mb-3">
            <span className="badge bg-dark text-white rounded-200 me-2">
              {new Date(movie.release_date).getFullYear() || null}
            </span>
            <span className="badge text-dark rounded-200 me-2">{makeGenres()}</span>
            <span className="badge text-dark me-2">{movie.runtime} mins</span>
          </div>
          <h2>Overview</h2>
          <p>{movie.overview}</p>
        </div>
      </div>
      <div className="row small">
        <div className="col-10 col-lg-4">
          <div className="mb-2">
            <h2 className="h6 mb-0">Status</h2>
            {movie.status || "-"}
          </div>
          <div className="mb-2">
            <h2 className="h6 mb-0">Budget</h2>
            {movie.budget || "-"}
          </div>
          <div className="mb-2">
            <h2 className="h6 mb-0">Revenue</h2>
            {movie.revenue || "-"}
          </div>
        </div>
        <div className="col-10 col-lg-4">
          <div className="mb-3">
            <h3 className="h6 mb-0">Language</h3>
            {movie.original_language || "-"}
          </div>
          <div className="mb-3">
            <h3 className="h6 mb-0">Actors</h3>
            {makeActors()}
          </div>
        </div>
        <div className="col-10 col-lg-4">
          <h3 className="h6 mb-0">Companies</h3>
          {movie.production_companies.map((_comp, key) => (
            <p key={key} className="mb-1">
              {_comp.name}
            </p>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
