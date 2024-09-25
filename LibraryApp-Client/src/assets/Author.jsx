import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Author = () => {
  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    birthDate: "",
    country: "",
  });
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editAuthorData, setEditAuthorData] = useState({
    name: "",
    birthDate: "",
    country: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/v1/authors`)
      .then((response) => {
        setAuthors(response.data);
      })
      .catch(() => {
        setError("Failed to fetch authors");
      });
  }, []);

  const addAuthor = () => {
    if (!newAuthor.name || !newAuthor.birthDate || !newAuthor.country) {
      setError("All fields are required");
      return;
    }

    axios
      .post(`${API_BASE_URL}/api/v1/authors`, newAuthor)
      .then((response) => {
        setAuthors([...authors, response.data]);
        setNewAuthor({
          name: "",
          birthDate: "",
          country: "",
        });
      })
      .catch(() => {
        setError("Failed to add author");
      });
  };

  const updateAuthor = (id) => {
    axios
      .put(`${API_BASE_URL}/api/v1/authors/${id}`, editAuthorData)
      .then(() => {
        setAuthors(
          authors.map((a) => (a.id === id ? { ...a, ...editAuthorData } : a))
        );
        setEditingAuthor(null);
        setEditAuthorData({
          name: "",
          birthDate: "",
          country: "",
        });
      })
      .catch(() => {
        setError("Failed to update author");
      });
  };

  const deleteAuthor = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/v1/authors/${id}`)
      .then(() => {
        setAuthors(authors.filter((a) => a.id !== id));
      })
      .catch(() => {
        setError("Failed to delete author");
      });
  };

  return (
    <div className="author-container">
      <h1>Author Management</h1>

      {error && <div className="error-modal">{error}</div>}

      <div className="add-author">
        <input
          type="text"
          placeholder="Author Name"
          value={newAuthor.name}
          onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
        />
        <input
          type="date"
          placeholder="Birth Date"
          value={newAuthor.birthDate}
          onChange={(e) =>
            setNewAuthor({ ...newAuthor, birthDate: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Country"
          value={newAuthor.country}
          onChange={(e) =>
            setNewAuthor({ ...newAuthor, country: e.target.value })
          }
        />
        <button onClick={addAuthor}>Add Author</button>
      </div>

      <div className="author-list">
        {authors.map((author) => (
          <div key={author.id} className="author-item">
            {editingAuthor === author.id ? (
              <div>
                <input
                  type="text"
                  value={editAuthorData.name}
                  onChange={(e) =>
                    setEditAuthorData({
                      ...editAuthorData,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  value={editAuthorData.birthDate}
                  onChange={(e) =>
                    setEditAuthorData({
                      ...editAuthorData,
                      birthDate: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={editAuthorData.country}
                  onChange={(e) =>
                    setEditAuthorData({
                      ...editAuthorData,
                      country: e.target.value,
                    })
                  }
                />
                <button onClick={() => updateAuthor(author.id)}>Save</button>
                <button onClick={() => setEditingAuthor(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>
                  {author.id} - {author.name}
                </span>
                <span> - {author.birthDate}</span>
                <span> - {author.country}</span>
                <button
                  onClick={() => {
                    setEditingAuthor(author.id);
                    setEditAuthorData({
                      name: author.name,
                      birthDate: author.birthDate,
                      country: author.country,
                    });
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteAuthor(author.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Author;
