import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Wrapper from "../../components/Wrapper";

export default function Movie() {
  const [movie, setMovie] = useState(undefined);
  const { id } = useParams();

  useEffect(() => {
    async function loadMovie() {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&i=${id}&plot=full`
      );
      const responseJson = await response.json();
      setMovie(responseJson);
    }

    loadMovie();
  }, [id]);

  if (!movie) return <Loading />;

  return (
    <Wrapper className="pb-5">
      <div className="row mb-5">
        <div className="col-12 col-lg-4 me-4">
          <img src={movie.Poster} alt={movie.Title} className="rounded-200" />
        </div>
        <div className="details | col-12 col-lg-7">
          <h1 className="lh-1">{movie.Title}</h1>
          <div className="mb-3">
            <span className="badge bg-dark text-white rounded-200 me-2">{movie.Year}</span>
            <span className="badge text-dark me-2">{movie.Runtime}</span>
            <span className="badge bg-dark text-white rounded-200">{movie.Rated}</span>
            {movie.Type?.toLowerCase() === "series" ? (
              <span className="badge text-dark me-2">{movie.Type}</span>
            ) : null}
          </div>
          <div className="mb-3">
            <small>{movie.Genre}</small>
          </div>
          <p>{movie.Plot}</p>
        </div>
      </div>
      <div className="row small">
        <div className="col-10 col-lg-4">
          <div className="mb-2">
            <h2 className="h6 mb-0">Director</h2>
            {movie.Director}
          </div>
          <div className="mb-3">
            <h2 className="h6 mb-0">Writer</h2>
            {movie.Writer}
          </div>
        </div>
        <div className="col-10 col-lg-4">
          <div className="mb-3">
            <h3 className="h6 mb-0">Actors</h3>
            {movie.Actors}
          </div>
          <div className="mb-3">
            <h3 className="h6 mb-0">Language</h3>
            {movie.Language}
          </div>
          <div className="mb-3">
            <h3 className="h6 mb-0">Awards</h3>
            {movie.Awards}
          </div>
        </div>
        <div className="col-10 col-lg-4">
          <h3 className="h6 mb-0">Ratings</h3>
          {movie.Ratings.map((rating, key) => (
            <div key={key}>
              <p className="mb-1">
                {rating.Source}: {rating.Value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
