import { useEffect, useState } from "react";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Movies />} />
        <Route path="/favourites" element={<Favourites />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}

export default App;

const API_KEY = "939fbadf",
  API_ID = "tt3896198";

function getRandomSearchQuery() {
  const DEFAULT_SEARCH_QUERIES = ["smart", "developer", "technology", "adventure", "ceo", "africa"];
  const randomIndex = Math.floor(Math.random() * DEFAULT_SEARCH_QUERIES.length);

  return DEFAULT_SEARCH_QUERIES[randomIndex];
}

function Movies() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(getRandomSearchQuery());
  const [featuredLoaded, setFeaturedLoaded] = useState(true);
  const [movies, setMovies] = useState([]);
  const [parsedMovies, setParsedMovies] = useState(movies);

  useEffect(() => {
    async function loadFeatured() {
      setIsLoading(true);
      const result = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${API_ID}&s=${search}`
      );
      const resultJson = await result.json();
      setFeaturedLoaded(true);
      setParsedMovies(resultJson.Search);
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
          <input
            type="search"
            name="search"
            className="form-control"
            placeholder="Search movies"
            aria-label="Search movies"
          />
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
        </div>
      </form>

      <div className="movies | d-grid gap-4 pb-5">
        {parsedMovies?.length
          ? parsedMovies.map((movie, index) => <MovieCard movie={movie} key={`${index}`} />)
          : null}
      </div>
    </Wrapper>
  );
}

function Favourites() {
  return <div>Favourites here</div>;
}

function Wrapper({ children, className, ...rest }) {
  return (
    <div className={`container col-md-9 ${className}`} {...rest}>
      {children}
    </div>
  );
}

function MainHeader() {
  return (
    <header>
      <Wrapper className="d-flex justify-content-between align-items-center">
        <p>HelloMovies</p>
        <nav>
          <ul className="d-flex my-3">
            <li className="mx-4">
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/favourites">Favourites</NavLink>
            </li>
          </ul>
        </nav>
      </Wrapper>
    </header>
  );
}

function MovieCard({ movie }) {
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
      <img src={movie.Poster} alt={movie.Title} />
      <div className="movie__details | p-3">
        <p className="fw-bold fs-5 lh-1">{movie.Title}</p>
        <p className="mb-0 fst-italic">
          <small>{movie.Year}</small>
        </p>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="d-flex height-80 align-items-center justify-content-center">
      <div className="loading"></div>
    </div>
  );
}
