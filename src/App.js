import { useState } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Favourites from "./pages/favourites/Favourites";
import Movie from "./pages/movies/Movie";
import Movies from "./pages/movies/Movies";

function App() {
  const [liked, setLiked] = useState(JSON.parse(localStorage.getItem("helloMoviesLiked")) || []);

  function toggleLiked(movie) {
    setLiked((prev) => {
      let newLiked;
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
