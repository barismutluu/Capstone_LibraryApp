import React from "react";
import { Typography, Container, Box } from "@mui/material";
import backgroundImage from "../assets/LibraryApp.jpg";
import "./Home.css"; // CSS dosyasını da import ediyoruz

const HomePage = () => {
  return (
    <Container className="homepage-container">
      <div className="overlay">
        {" "}
        {/* Arka planda sadece görsel için bir katman */}
        <Box textAlign="center" mt={5}>
          <Typography variant="h2" gutterBottom>
            LibraryApp'e Hoşgeldiniz
          </Typography>
          <Typography variant="h6" color="white">
            Kitaplarınızı, yazarlarınızı, yayınevlerinizi ve daha fazlasını tek
            bir yerde yönetin.
          </Typography>
        </Box>
      </div>
    </Container>
  );
};

export default HomePage;
