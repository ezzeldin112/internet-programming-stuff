import React, { useState } from "react";
import "./styles.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const addMovie = (e) => {
    e.preventDefault();
    if (!title) {
      alert("Please enter a movie title!");
      return;
    }

    const newMovie = {
      id: Date.now(),
      title,
      review,
      rating,
    };

    setMovies([...movies, newMovie]);
    setTitle("");
    setReview("");
    setRating(0);
  };

  const removeMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <div className="app">
      <h1>My Movie Watch List</h1>

      <form onSubmit={addMovie} className="movie-form">
        <div>
          <label>Movie Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Your Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label>Your Rating:</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                className={star <= rating ? "star selected" : "star"}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>

        <button type="submit">Add Movie</button>
      </form>

      <div className="movie-list">
        <h2>Your Movies</h2>
        {movies.length === 0 ? (
          <p>No movies added yet.</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <h3>{movie.title}</h3>
              <div>{"⭐".repeat(movie.rating)}</div>
              <p>"{movie.review}"</p>
              <button onClick={() => removeMovie(movie.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
