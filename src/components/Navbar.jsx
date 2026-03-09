import { Link, NavLink } from "react-router-dom";
import { ASSET } from "../constants/assets";

export default function Navbar() {
  return (
    <header className="top-nav">
      <div className="container nav-body">
        <Link to="/" className="brand">
          <img src={`${ASSET}/Logo.png`} alt="Logo" />
          <span>SIMS PPOB</span>
        </Link>
        <nav>
          <NavLink to="/topup">Top Up</NavLink>
          <NavLink to="/transaction">Transaction</NavLink>
          <NavLink to="/profile">Akun</NavLink>
        </nav>
      </div>
    </header>
  );
}
