import { NavLink } from "react-router-dom";
import Wrapper from "./Wrapper";

export default function Header() {
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
