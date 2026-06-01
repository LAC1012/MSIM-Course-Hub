import { Link } from "react-router-dom";

const REVIEW_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc38D79TAzg-ADQtQDWdMUFN-OLHzZN6VnBrpQtAmsZ6T3_bg/viewform";

export default function SiteHeader() {
  return (
    <header className="header">
      <div className="header__inner" aria-label="Header">
        <p className="header__logo">MSIM Course Hub</p>
        <nav className="header__nav" aria-label="Main">
          <Link to="/" className="header__link">
            Home
          </Link>
          <a
            href={REVIEW_FORM_URL}
            className="header__link"
            target="_blank"
            rel="noopener noreferrer"
          >
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

