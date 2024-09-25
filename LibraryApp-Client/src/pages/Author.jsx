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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import Navbar from "../Navbar"; // Doğru yolu kontrol edin
// API base URL'ini ortam değişkenlerinden alıyoruz
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export default function Author() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [editingAuthor, setEditingAuthor] = useState(null);

  useEffect(() => {
    // API isteğini ortam değişkeni ile yapıyoruz
    axios
      .get(`${API_BASE_URL}/api/v1/authors`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setAuthors(response.data);
        } else {
          console.error("Beklenen formatta veri gelmedi:", response.data);
          setAuthors([]);
        }
      })
      .catch((error) => {
        console.error("API'den veri alınırken hata oluştu:", error);
        setAuthors([]);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingAuthor) {
      axios
        .put(`${API_BASE_URL}/api/v1/authors/${editingAuthor.id}`, {
          name,
          birthDate,
          country,
        })
        .then((response) => {
          setAuthors(
            authors.map((author) =>
              author.id === editingAuthor.id ? response.data : author
            )
          );
          setEditingAuthor(null);
          setName("");
          setBirthDate("");
          setCountry("");
        });
    } else {
      axios
        .post(`${API_BASE_URL}/api/v1/authors`, { name, birthDate, country })
        .then((response) => {
          setAuthors([...authors, response.data]);
          setName("");
          setBirthDate("");
          setCountry("");
        });
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setName(author.name);
    setBirthDate(author.birthDate);
    setCountry(author.country);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/api/v1/authors/${id}`).then(() => {
      setAuthors(authors.filter((author) => author.id !== id));
    });
  };

  return (
    <div>
      <h1>Yazarlar</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "20px 0",
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <TextField
          label="İsim"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Doğum Tarihi"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Ülke"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {editingAuthor ? "Güncelle" : "Ekle"}
        </Button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Doğum Tarihi</TableCell>
              <TableCell>Ülke</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(authors) &&
              authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>{author.name}</TableCell>
                  <TableCell>{author.birthDate}</TableCell>
                  <TableCell>{author.country}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(author)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(author.id)}>
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
