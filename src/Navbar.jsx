import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        LibraryApp
      </Link>
      <ul>
        <CustomLink to="/author">Yazarlar</CustomLink>
        <CustomLink to="/publisher">Yayıncılar</CustomLink>
        <CustomLink to="/category">Kategoriler</CustomLink>
        <CustomLink to="/book">Kitaplar</CustomLink>
        <CustomLink to="/borrowing">Ödünç Alma Kayıtları</CustomLink>
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
