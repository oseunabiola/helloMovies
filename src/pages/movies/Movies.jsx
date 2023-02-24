import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import MovieCard from "../../components/MovieCard";
import Wrapper from "../../components/Wrapper";
import { getRandomSearchQuery } from "../../utils";

export default function Movies({ toggleLiked, liked }) {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(getRandomSearchQuery());
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function loadFeatured() {
      setIsLoading(true);
      const result = await fetch(
        `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&i=${process.env.REACT_APP_API_ID}&s=${search}`
      );
      const resultJson = await result.json();
      setMovies(resultJson.Search);
      setIsLoading(false);
    }

    loadFeatured();
  }, [search]);

  function setSearchQuery(e) {
    e.preventDefault();
    if (!e.target.search.value) return;
    setSearch(e.target.search.value);
  }

  if (isLoading) return <Loading />;

  return (
    <Wrapper>
      <form onSubmit={setSearchQuery}>
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
