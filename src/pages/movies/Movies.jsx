import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import MovieCard from "../../components/MovieCard";
import Wrapper from "../../components/Wrapper";
import { getRandomSearchQuery } from "../../utils";

export default function Movies({ toggleLiked, liked }) {
  const [isLoading, setIsLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState(getRandomSearchQuery());
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function getGenres() {
      const URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`;
      const response = await fetch(URL);
      const responseJson = await response.json();
      const { genres } = responseJson;
      return setGenres(genres.map((_g) => _g.name));
    }

    getGenres();
  }, []);

  useEffect(() => {
    async function getMovies() {
      setIsLoading(true)
      const URL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1&query=${searchQuery}`;
      const response = await fetch(URL);
      const responseJson = await response.json();
      setMovies(responseJson.results);
      setIsLoading(false)
    }
    getMovies();
  }, [searchQuery]);

  function setQuery(e) {
    e.preventDefault();
    if (!e.target.search.value) return;
    setSearchQuery(e.target.search.value);
  }

  if (isLoading) return <Loading />;

  return (
    <Wrapper>
      <form onSubmit={setQuery}>
        <div
          className="input-group mb-5"
          style={{ borderRadius: "1.5rem", border: "1px solid #ddd", overflow: "hidden" }}>
          <span
            className="input-group-text bg-transparent border-0"
            style={{ borderRadius: "1.5rem" }}>
            <i className="bi bi-search"></i>
          </span>
          <input
            type="search"
            name="search"
            className="form-control border-start-0"
            placeholder="Search movies"
            aria-label="Search movies"
          />
        </div>
      </form>

      <div className="movies | d-grid gap-4 pb-5">
        {movies?.length
          ? movies.map((movie, index) => (
              <MovieCard
                movie={movie}
                toggleLiked={toggleLiked}
                key={`${index}`}
                isLiked={liked.includes(movie)}
              />
            ))
          : null}
      </div>
    </Wrapper>
  );
}
