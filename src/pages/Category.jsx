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
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

// API base URL'ini ortam değişkenlerinden alıyoruz
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar kontrolü
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar mesajı

  useEffect(() => {
    // API isteği ile kategorileri alıyoruz
    axios
      .get(`${API_BASE_URL}/api/v1/categories`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Beklenen formatta veri gelmedi:", response.data);
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error("API'den veri alınırken hata oluştu:", error);
        setCategories([]);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCategory) {
      // Güncelleme işlemi için hem isim hem açıklama gönderiyoruz.
      const updatedCategory = {
        name: name || editingCategory.name, // Eğer isim boşsa, mevcut ismi kullan
        description,
      };

      // Kategori güncelleme işlemi
      axios
        .put(
          `${API_BASE_URL}/api/v1/categories/${editingCategory.id}`,
          updatedCategory
        )
        .then((response) => {
          setCategories(
            categories.map((category) =>
              category.id === editingCategory.id ? response.data : category
            )
          );
          setSnackbarMessage("Kategori başarıyla güncellendi!");
          setOpenSnackbar(true); // Güncelleme sonrası snackbar açılıyor
          resetForm();
        })
        .catch((error) => {
          console.error("Kategori güncellenemedi:", error);
        });
    } else {
      // Yeni kategori ekleme işlemi
      axios
        .post(`${API_BASE_URL}/api/v1/categories`, { name, description })
        .then((response) => {
          setCategories([...categories, response.data]);
          setSnackbarMessage("Kategori başarıyla eklendi!");
          setOpenSnackbar(true); // Ekleme sonrası snackbar açılıyor
          resetForm();
        })
        .catch((error) => {
          console.error("Kategori eklenemedi:", error);
        });
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
  };

  const handleDelete = (id) => {
    // Kategori silme işlemi
    axios
      .delete(`${API_BASE_URL}/api/v1/categories/${id}`)
      .then(() => {
        setCategories(categories.filter((category) => category.id !== id));
        setSnackbarMessage("Kategori başarıyla silindi!");
        setOpenSnackbar(true); // Silme sonrası snackbar açılıyor
      })
      .catch((error) => {
        console.error("Kategori silinemedi:", error);
      });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1>Kategoriler</h1>
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
          label="Kategori İsmi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={!editingCategory} // Sadece ekleme sırasında zorunlu
        />
        <TextField
          label="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {editingCategory ? "Güncelle" : "Ekle"}
        </Button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar Bileşeni */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
