import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

function App() {
  const [liked, setLiked] = useState(JSON.parse(localStorage.getItem("helloMoviesLiked")) || []);

  function toggleLiked(movie) {
    setLiked((prev) => {
      let newLiked;
      console.log(prev, movie);
      if (prev.includes(movie)) {
        newLiked = prev.filter((_liked) => _liked !== movie);
      } else {
        newLiked = [...prev, movie];
      }
      localStorage.setItem("helloMoviesLiked", JSON.stringify(newLiked));
      return newLiked;
    });
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Movies toggleLiked={toggleLiked} liked={liked} />} />
          <Route
            path="/favourites"
            element={<Favourites toggleLiked={toggleLiked} liked={liked} />}
          />
          <Route path="/movie/:id" element={<Movie liked={liked} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <>
      <Header />
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
    "kamasutra",
    "energy",
    "climate",
    "sense",
  ];
  const randomIndex = Math.floor(Math.random() * DEFAULT_SEARCH_QUERIES.length);

  return DEFAULT_SEARCH_QUERIES[randomIndex];
}

function Movies({ toggleLiked, liked }) {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(getRandomSearchQuery());
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function loadFeatured() {
      setIsLoading(true);
      const result = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${API_ID}&s=${search}`
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

function Movie() {
  const [movie, setMovie] = useState(undefined);
  const { id } = useParams();

  useEffect(() => {
    async function loadMovie() {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
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

function Favourites({ toggleLiked }) {
  const liked = JSON.parse(localStorage.getItem("helloMoviesLiked")) || [];

  return (
    <Wrapper>
      <h1 className="h4 mb-5">Favourites.</h1>
      {liked?.length ? (
        <div className="movies | d-grid gap-4 pb-5">
          {liked.map((movie, index) => (
            <MovieCard movie={movie} key={`${index}`} toggleLiked={toggleLiked} isLiked={true} />
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

function Header() {
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

function MovieCard({ movie, toggleLiked, isLiked }) {
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
      <img src={movie.Poster} alt={movie.Title} />
      <div
        className="movie__details | p-3"
        onClick={(e) => {
          if (!e.target.dataset.like) {
            navigate(`/movie/${movie.imdbID}`);
          }
        }}>
        <p className="fw-bold fs-5 lh-1">{movie.Title}</p>
        <p className="mb-0 fst-italic">
          <small>{movie.Year}</small>
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

function Loading() {
  return (
    <div className="d-flex height-80 align-items-center justify-content-center">
      <div className="loading"></div>
    </div>
  );
}
