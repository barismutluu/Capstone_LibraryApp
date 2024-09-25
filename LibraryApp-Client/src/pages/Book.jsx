import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

// API base URL'ini ortam değişkenlerinden alıyoruz
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export default function Book() {
  const [books, setBooks] = useState([]);
  const [name, setName] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [stock, setStock] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [errorPublicationYear, setErrorPublicationYear] = useState("");
  const [errorStock, setErrorStock] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    // Kitapları, yazarları, yayıncıları ve kategorileri güncelle
    axios.get(`${API_BASE_URL}/api/v1/books`).then((response) => {
      if (Array.isArray(response.data)) {
        setBooks(response.data);
      } else {
        console.error("Beklenen formatta veri gelmedi:", response.data);
        setBooks([]);
      }
    });
    axios
      .get(`${API_BASE_URL}/api/v1/authors`)
      .then((response) => setAuthors(response.data));
    axios
      .get(`${API_BASE_URL}/api/v1/publishers`)
      .then((response) => setPublishers(response.data));
    axios
      .get(`${API_BASE_URL}/api/v1/categories`)
      .then((response) => setCategories(response.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Yayın yılı ve stok doğrulaması
    if (!publicationYear || isNaN(publicationYear)) {
      setErrorPublicationYear("Yayın yılı bir sayı olmalıdır.");
      return;
    }
    if (!stock || isNaN(stock)) {
      setErrorStock("Stok bir sayı olmalıdır.");
      return;
    }

    const bookData = {
      name,
      publicationYear,
      stock,
      author: { id: authorId },
      publisher: { id: publisherId },
      categories: selectedCategories.map((id) => ({ id })),
    };

    if (editingBook) {
      // Kitap güncelleme işlemi
      axios
        .put(`${API_BASE_URL}/api/v1/books/${editingBook.id}`, bookData)
        .then((response) => {
          setBooks(
            books.map((book) =>
              book.id === editingBook.id ? response.data : book
            )
          );
          resetForm();
          fetchAllData(); // Verileri güncelle
        });
    } else {
      // Yeni kitap ekleme işlemi
      axios.post(`${API_BASE_URL}/api/v1/books`, bookData).then((response) => {
        setBooks([...books, response.data]);
        resetForm();
        fetchAllData(); // Verileri güncelle
      });
    }
  };

  const resetForm = () => {
    setName("");
    setPublicationYear("");
    setStock("");
    setAuthorId("");
    setPublisherId("");
    setSelectedCategories([]);
    setEditingBook(null);
    setErrorPublicationYear("");
    setErrorStock("");
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setName(book.name);
    setPublicationYear(book.publicationYear);
    setStock(book.stock);
    setAuthorId(book.author.id);
    setPublisherId(book.publisher.id);
    setSelectedCategories(book.categories.map((category) => category.id));
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/api/v1/books/${id}`).then(() => {
      setBooks(books.filter((book) => book.id !== id));
    });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  return (
    <div>
      <h1>Kitaplar</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "20px 0",
          display: "flex",
          gap: "15px",
          flexDirection: "column",
        }}
      >
        <TextField
          label="Kitap İsmi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Yayın Yılı"
          value={publicationYear}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(value)) {
              setErrorPublicationYear("");
              setPublicationYear(value);
            } else {
              setErrorPublicationYear("Yayın yılı bir sayı olmalıdır.");
            }
          }}
          error={!!errorPublicationYear}
          helperText={errorPublicationYear}
          required
        />
        <TextField
          label="Stok"
          value={stock}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(value)) {
              setErrorStock("");
              setStock(value);
            } else {
              setErrorStock("Stok bir sayı olmalıdır.");
            }
          }}
          error={!!errorStock}
          helperText={errorStock}
          required
        />

        <FormControl>
          <InputLabel id="author-select-label">Yazar</InputLabel>
          <Select
            labelId="author-select-label"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="publisher-select-label">Yayıncı</InputLabel>
          <Select
            labelId="publisher-select-label"
            value={publisherId}
            onChange={(e) => setPublisherId(e.target.value)}
            required
          >
            {publishers.map((publisher) => (
              <MenuItem key={publisher.id} value={publisher.id}>
                {publisher.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="category-select-label">Kategoriler</InputLabel>
          <Select
            labelId="category-select-label"
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            renderValue={(selected) =>
              selected
                .map(
                  (id) =>
                    categories.find((category) => category.id === id)?.name
                )
                .join(", ")
            }
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <Checkbox
                  checked={selectedCategories.indexOf(category.id) > -1}
                />
                <ListItemText primary={category.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          {editingBook ? "Güncelle" : "Ekle"}
        </Button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Yayın Yılı</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell>Yazar</TableCell>
              <TableCell>Yayıncı</TableCell>
              <TableCell>Kategoriler</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(books) &&
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.publicationYear}</TableCell>
                  <TableCell>{book.stock}</TableCell>
                  <TableCell>{book.author.name}</TableCell>
                  <TableCell>{book.publisher.name}</TableCell>
                  <TableCell>
                    {book.categories
                      .map((category) => category.name)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(book)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(book.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
