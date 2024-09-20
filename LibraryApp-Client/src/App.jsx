import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import "./App.css";

const initialPublisher = {
  id: 0,
  name: "",
  establishmentYear: "",
  address: "",
};

function PublisherForm() {
  const [newPublisher, setNewPublisher] = useState(initialPublisher);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPublisher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewPublisher = () => {
    axios
      .post(
        import.meta.env.VITE_APP_BASE_URL + "/api/v1/publishers",
        newPublisher
      )
      .then((res) => {
        console.log(res.data);
        // Başarılı ekleme sonrası formu temizle
        setNewPublisher(initialPublisher);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <h1>Yeni Yayıncı Ekle</h1>
      <TextField
        id="name"
        label="Yayıncı Adı"
        variant="standard"
        name="name"
        value={newPublisher.name}
        onChange={handleInputChange}
      />
      <br />
      <TextField
        id="establishmentYear"
        label="Kuruluş Yılı"
        variant="standard"
        name="establishmentYear"
        type="number"
        value={newPublisher.establishmentYear}
        onChange={handleInputChange}
      />
      <br />
      <TextField
        id="address"
        label="Adres"
        variant="standard"
        name="address"
        value={newPublisher.address}
        onChange={handleInputChange}
      />
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNewPublisher}
      >
        Yayıncı Ekle
      </Button>
    </>
  );
}

export default PublisherForm;
