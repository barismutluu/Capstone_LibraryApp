import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Site Name
      </Link>
      <ul>
        <CustomLink to="/publisher">Publisher</CustomLink>
        <CustomLink to="/author">Author</CustomLink>
        <CustomLink to="/category">Category</CustomLink>
        <CustomLink to="/borrowing">Borrowing</CustomLink>
        <CustomLink to="/book">Book</CustomLink>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvePath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvePath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      {" "}
      {/* className'ı düzgün şekilde ayarla */}
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
