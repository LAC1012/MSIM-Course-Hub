import { Link } from "react-router-dom";

export default function SiteHeader() {
  return (
    <header className="header">
      <div className="header__inner" aria-label="Header">
        <p className="header__logo">MSIM Course Hub</p>
        <nav className="header__nav" aria-label="Main">
          <Link to="/" className="header__link">
            Home
          </Link>
          <a href="#" className="header__link">
            Review a Class
          </a>
        </nav>
      </div>
      <div className="header__divider" aria-hidden="true">
        <img src="/assets/header-line.svg" alt="" width={1440} height={1} />
      </div>
    </header>
  );
}

