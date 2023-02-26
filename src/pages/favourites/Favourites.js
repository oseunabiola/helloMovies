import { Link } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import Wrapper from "../../components/Wrapper";

export default function Favourites({ toggleLiked, liked }) {
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
