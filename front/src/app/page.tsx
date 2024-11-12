"use client"; // Add this line at the top

import { fetchPuzzles } from "@/api/puzzleApi"; // Ensure the import path is correct
import { useState, useRef, useEffect } from "react";
import { Puzzle } from "@/interfaces/Puzzle";
import ChessboardComponent from "../services/chessboardGenerator";
import { generatePuzzlesPdf } from "@/services/generatePuzzlesPdf";
import styles from "./page.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS

const Home = () => {
  const [theme, setTheme] = useState<string>("Divers");
  const [minRating, setMinRating] = useState<number>(1);
  const [maxRating, setMaxRating] = useState<number>(3000);
  const [count, setCount] = useState<number>(5);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const selectContainerRef = useRef<HTMLDivElement>(null); // Ref for the select container
  const puzzleAppendingBoxRef =
    useRef<HTMLDivElement>(null); // Ref for the 'puzzle-appending-box' div

  // Example themes with duplicates removed
  const themes = Array.from(
    new Set([
      "Divers",
      "crushing",
      "fork",
      "middlegame",
      "short",
      "kingsideAttack",
      "mate",
      "mateIn1",
      "oneMove",
      "endgame",
      "master",
      "mateIn2",
      "backRankMate",
      "advantage",
      "discoveredAttack",
      "pinnedPiece",
      "pawnEndgame",
      "rookEndgame",
      "defensiveMove",
      "long",
      "deflection",
    ])
  );

  useEffect(() => {
    const toggleSelectArrow = () => {
      if (selectContainerRef.current) {
        selectContainerRef.current.classList.toggle("open");
      }
    };

    const removeSelectArrow = () => {
      if (selectContainerRef.current) {
        selectContainerRef.current.classList.remove("open");
      }
    };

    const selectElement =
      selectContainerRef.current?.querySelector("select");

    if (selectElement) {
      selectElement.addEventListener(
        "click",
        toggleSelectArrow
      );
      selectElement.addEventListener(
        "blur",
        removeSelectArrow
      );
    }

    return () => {
      if (selectElement) {
        selectElement.removeEventListener(
          "click",
          toggleSelectArrow
        );
        selectElement.removeEventListener(
          "blur",
          removeSelectArrow
        );
      }
    };
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

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
            Theme :
            <div
              className={styles.selectContainer}
              ref={selectContainerRef}
            >
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                id="theme-select"
              >
                {themes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <i className="fas fa-chevron-down select-arrow"></i>
            </div>
          </label>
          <label>
            Minimum Rating : {minRating}
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
          </label>
          <label>
            Maximum Rating : {maxRating}
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
          </label>
          <label>
            Count :
            <input
              type="number"
              value={count}
              onChange={(e) =>
                setCount(parseInt(e.target.value))
              }
              id="count-input"
            />
          </label>

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
