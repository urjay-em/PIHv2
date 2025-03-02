import { Link } from "react-router-dom";
import "./HomePage.css";

function App() {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
        <Link to="/"> <img src="/assets/LOGOO.jpg" alt="Logo" /> </Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/login">Log In</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/pricing">Pricing & Offers</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/report">Report a Problem</Link></li>
        </ul>
      </nav>

      {/* Home Page Content */}
      <div className="container home-page__container">
        <h1 className="main__title">Paradise Daw</h1>
      </div>
    </>
  );
}

export default App;
