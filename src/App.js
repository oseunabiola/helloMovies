import { useEffect, useState } from "react";
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes } from "react-router-dom";

function App() {
  const [liked, setLiked] = useState(JSON.parse(localStorage.getItem("helloMoviesLiked")) || []);

  function addToLiked(movie) {
    setLiked((prev) => {
      const newLiked = [...prev, movie];
      localStorage.setItem("helloMoviesLiked", JSON.stringify(newLiked));
      return newLiked;
    });
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Movies addToLiked={addToLiked} liked={liked} />} />
          <Route path="/favourites" element={<Favourites liked={liked} />} />
        </Route>
      </Routes>
    </BrowserRouter>
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
  const DEFAULT_SEARCH_QUERIES = [
    "smart",
    "art",
    "love",
    "trade",
    "technology",
    "adventure",
    "ceo",
    "africa",
  ];
  const randomIndex = Math.floor(Math.random() * DEFAULT_SEARCH_QUERIES.length);

  return DEFAULT_SEARCH_QUERIES[randomIndex];
}

function Movies({ addToLiked, liked }) {
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
    setFeaturedLoaded(false);
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
          ? parsedMovies.map((movie, index) => (
              <MovieCard
                movie={movie}
                addToLiked={addToLiked}
                key={`${index}`}
                isLiked={liked.includes(movie)}
              />
            ))
          : null}
      </div>
    </Wrapper>
  );
}
function Favourites({ removeLiked }) {
  const [liked, setLiked] = useState(JSON.parse(localStorage.getItem("helloMoviesLiked")) || []);

  return (
    <Wrapper>
      {liked?.length ? (
        <div className="movies | d-grid gap-4 pb-5">
          {liked.map((movie, index) => (
            <MovieCard movie={movie} key={`${index}`} isLiked={true} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>
            You have not liked any movie?{" "}
            <Link to="/" style={{ textDecoration: "underline" }}>
              Check out some movies
            </Link>
          </p>
        </div>
      )}
    </Wrapper>
  );
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
      <Wrapper className="d-flex justify-content-between align-items-center my-4 fw-bold">
        <p className="fs-3 mb-0">
          <NavLink to="/">HelloMovies.</NavLink>
        </p>
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

function MovieCard({ movie, addToLiked, isLiked }) {
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
        <div>
          <i
            className={`fs-5 bi ${isLiked ? "bi-star-fill" : "bi-star"}`}
            onClick={() => addToLiked(movie)}></i>
        </div>
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
