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
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export default function Borrowing() {
  const [borrowings, setBorrowings] = useState([]);
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerMail, setBorrowerMail] = useState("");
  const [borrowingDate, setBorrowingDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [bookId, setBookId] = useState("");
  const [books, setBooks] = useState([]);
  const [editingBorrowing, setEditingBorrowing] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar kontrolü
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar mesajı

  useEffect(() => {
    fetchBorrowings();
    fetchBooks();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/borrows`);
      setBorrowings(response.data);
    } catch (error) {
      console.error("Borrowings verisi çekilemedi:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/books`);
      setBooks(response.data);
    } catch (error) {
      console.error("Kitaplar çekilemedi:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedBook = books.find((book) => book.id === bookId);

    const borrowingData = {
      borrowerName,
      borrowerMail,
      borrowingDate,
      bookForBorrowingRequest: {
        id: selectedBook.id,
        name: selectedBook.name,
        publicationYear: selectedBook.publicationYear,
        stock: selectedBook.stock,
      },
      ...(editingBorrowing && { returnDate }),
    };

    try {
      if (editingBorrowing) {
        await axios.put(
          `${API_BASE_URL}/api/v1/borrows/${editingBorrowing.id}`,
          borrowingData
        );
        fetchBorrowings();
        setSnackbarMessage("Ödünç alma işlemi başarıyla güncellendi!");
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/borrows`,
          borrowingData
        );
        setBorrowings([...borrowings, response.data]);
        setSnackbarMessage("Ödünç alma işlemi başarıyla eklendi!");
      }
      resetForm();
      setOpenSnackbar(true); // İşlem sonrası Snackbar açılıyor
    } catch (error) {
      console.error("Borrowing kaydedilemedi:", error);
    }
  };

  const resetForm = () => {
    setBorrowerName("");
    setBorrowerMail("");
    setBorrowingDate("");
    setReturnDate("");
    setBookId("");
    setEditingBorrowing(null);
  };

  const handleEdit = (borrowing) => {
    setEditingBorrowing(borrowing);
    setBorrowerName(borrowing.borrowerName || "");
    setBorrowerMail(borrowing.borrowerMail || "");
    setBorrowingDate(borrowing.borrowingDate || "");
    setReturnDate(borrowing.returnDate || "");
    setBookId(borrowing.book?.id || "");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/borrows/${id}`);
      setBorrowings(borrowings.filter((borrowing) => borrowing.id !== id));
      setSnackbarMessage("Ödünç alma işlemi başarıyla silindi!");
      setOpenSnackbar(true); // Silme işlemi sonrası Snackbar açılıyor
    } catch (error) {
      console.error("Borrowing silinemedi:", error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1>Kitap Alma</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ödünç Alan Kişinin Adı"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ödünç Alan Kişinin E-Posta Adresi"
              value={borrowerMail}
              onChange={(e) => setBorrowerMail(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ödünç Alma Tarihi"
              type="date"
              value={borrowingDate}
              onChange={(e) => setBorrowingDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          {editingBorrowing && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Return Date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Kitap Bilgisi</InputLabel>
              <Select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                required
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editingBorrowing ? "Güncelle" : "Kaydet"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <h3>Kitap Alan Kişi Bilgileri</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Adı</TableCell>
              <TableCell> E-Posta</TableCell>
              <TableCell>Kitap Adı</TableCell>
              <TableCell>Alım Tarihi</TableCell>
              <TableCell>Iade Tarihi</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowings.map((borrowing) => (
              <TableRow key={borrowing.id}>
                <TableCell>{borrowing.borrowerName}</TableCell>
                <TableCell>{borrowing.borrowerMail}</TableCell>
                <TableCell>{borrowing.book.name}</TableCell>
                <TableCell>{borrowing.borrowingDate}</TableCell>
                <TableCell>{borrowing.returnDate || "N/A"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(borrowing)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(borrowing.id)}>
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
