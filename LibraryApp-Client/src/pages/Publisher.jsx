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

// API base URL'ini ortam değişkenlerinden alıyoruz
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export default function Publisher() {
  const [publishers, setPublishers] = useState([]);
  const [name, setName] = useState("");
  const [establishmentYear, setEstablishmentYear] = useState("");
  const [address, setAddress] = useState("");
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // API isteği ile yayıncıları alıyoruz
    axios
      .get(`${API_BASE_URL}/api/v1/publishers`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPublishers(response.data);
        } else {
          console.error("Beklenen formatta veri gelmedi:", response.data);
          setPublishers([]);
        }
      })
      .catch((error) => {
        console.error("API'den veri alınırken hata oluştu:", error);
        setPublishers([]);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kuruluş yılı doğrulaması
    if (!establishmentYear || isNaN(establishmentYear)) {
      setError("Lütfen geçerli bir kuruluş yılı girin.");
      return;
    }

    setError(""); // Hata yoksa temizle

    if (editingPublisher) {
      // Yayıncı güncelleme işlemi
      axios
        .put(`${API_BASE_URL}/api/v1/publishers/${editingPublisher.id}`, {
          name,
          establishmentYear,
          address,
        })
        .then((response) => {
          setPublishers(
            publishers.map((publisher) =>
              publisher.id === editingPublisher.id ? response.data : publisher
            )
          );
          setEditingPublisher(null);
          setName("");
          setEstablishmentYear("");
          setAddress("");
        });
    } else {
      // Yeni yayıncı ekleme işlemi
      axios
        .post(`${API_BASE_URL}/api/v1/publishers`, {
          name,
          establishmentYear,
          address,
        })
        .then((response) => {
          setPublishers([...publishers, response.data]);
          setName("");
          setEstablishmentYear("");
          setAddress("");
        });
    }
  };

  const handleEdit = (publisher) => {
    setEditingPublisher(publisher);
    setName(publisher.name);
    setEstablishmentYear(publisher.establishmentYear);
    setAddress(publisher.address);
  };

  const handleDelete = (id) => {
    // Yayıncı silme işlemi
    axios.delete(`${API_BASE_URL}/api/v1/publishers/${id}`).then(() => {
      setPublishers(publishers.filter((publisher) => publisher.id !== id));
    });
  };

  return (
    <div>
      <h1>Yayıncılar</h1>
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
          label="Yayıncı İsmi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Kuruluş Yılı"
          value={establishmentYear}
          onChange={(e) => setEstablishmentYear(e.target.value)}
          required
          error={!!error}
          helperText={error}
        />
        <TextField
          label="Adres"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {editingPublisher ? "Güncelle" : "Ekle"}
        </Button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Kuruluş Yılı</TableCell>
              <TableCell>Adres</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(publishers) &&
              publishers.map((publisher) => (
                <TableRow key={publisher.id}>
                  <TableCell>{publisher.name}</TableCell>
                  <TableCell>{publisher.establishmentYear}</TableCell>
                  <TableCell>{publisher.address}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(publisher)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(publisher.id)}>
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
