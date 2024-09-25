import Navbar from "./Navbar";
import Publisher from "./pages/Publisher";
import Author from "./pages/Author";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Borrowing from "./pages/Borrowing";
import Book from "./pages/Book";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publisher" element={<Publisher />} />
          <Route path="/author" element={<Author />} />
          <Route path="/category" element={<Category />} />
          <Route path="/borrowing" element={<Borrowing />} />
          <Route path="/book" element={<Book />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
