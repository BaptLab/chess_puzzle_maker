"use client"; // Add this line at the top

import { fetchPuzzles } from "@/api/puzzleApi"; // Ensure the import path is correct
import { useState, useRef } from "react";
import { Puzzle } from "@/interfaces/Puzzle";
import ChessboardComponent from "../services/chessboardGenerator";
import { generatePuzzlesPdf } from "@/services/generatePuzzlesPdf";
import styles from "./page.module.css";

const Home = () => {
  const [theme, setTheme] = useState<string>("Divers");
  const [minRating, setMinRating] = useState<number>(1);
  const [maxRating, setMaxRating] = useState<number>(3000);
  const [count, setCount] = useState<number>(5);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Ref for the 'puzzle-appending-box' div
  const puzzleAppendingBoxRef =
    useRef<HTMLDivElement>(null);

  const themes = [
    "Divers",
    "Checkmate",
    "Fork",
    "Pin",
    "Skewer",
  ]; // Example themes

  // Handle form submission and PDF generation
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    // Fetch puzzles directly
    const data = await fetchPuzzles(
      theme,
      minRating,
      maxRating,
      count
    );
    console.log("Fetched puzzles:", data);
    setPuzzles(data);
    setLoading(false);

    if (data.length > 0) {
      // Pass the 'puzzle-appending-box' ref to `generatePuzzlesPdf`
      generatePuzzlesPdf(
        data,
        theme,
        puzzleAppendingBoxRef.current
      );
    } else {
      alert("No puzzles to generate PDF.");
    }
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.puzzleMenu}>
        <h1>Chess Puzzle Maker</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Theme:
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Minimum Rating:
            <input
              type="range"
              min="1"
              max="3001"
              step="200"
              value={minRating}
              onChange={(e) =>
                setMinRating(parseInt(e.target.value))
              }
            />
            {minRating}
          </label>
          <label>
            Maximum Rating:
            <input
              type="range"
              min="1"
              max="3001"
              step="200"
              value={maxRating}
              onChange={(e) =>
                setMaxRating(parseInt(e.target.value))
              }
            />
            {maxRating}
          </label>
          <label>
            Count:
            <input
              type="number"
              value={count}
              onChange={(e) =>
                setCount(parseInt(e.target.value))
              }
            />
          </label>

          {/* Puzzle appending box where chessboards will be temporarily rendered */}
          <div
            ref={puzzleAppendingBoxRef}
            className="puzzle-appending-box"
          ></div>

          <button type="submit">Generate Puzzle</button>
        </form>
        {loading && <p>Loading...</p>}
        <div>
          {puzzles.map((puzzle) => (
            <div
              key={puzzle.puzzleId}
              style={{
                marginBottom: "20px",
                display: "none",
              }}
            >
              <ChessboardComponent
                fen={puzzle.fen}
                id={`board-${puzzle.puzzleId}`}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
