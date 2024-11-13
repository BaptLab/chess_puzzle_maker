"use client";

import { fetchPuzzles } from "@/api/puzzleApi";
import { useState, useRef, useEffect } from "react";
import { Puzzle } from "@/interfaces/Puzzle";
import ChessboardComponent from "../services/chessboardGenerator";
import { generatePuzzlesPdf } from "@/services/generatePuzzlesPdf";
import styles from "./page.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Home = () => {
  const [theme, setTheme] = useState<string>("Divers");
  const [minRating, setMinRating] = useState<number>(1);
  const [maxRating, setMaxRating] = useState<number>(3000);
  const [count, setCount] = useState<number>(9);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [countOption, setCountOption] =
    useState<string>("9");
  const [displayRating, setDisplayRating] =
    useState<boolean>(true);
  const [displayCoordinates, setDisplayCoordinates] =
    useState<boolean>(true); // New state for displaying coordinates
  const [sortOrder, setSortOrder] =
    useState<string>("lowToHigh"); // New state for sorting order

  const selectContainerRef = useRef<HTMLDivElement>(null);
  const puzzleAppendingBoxRef =
    useRef<HTMLDivElement>(null);

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

    const finalCount =
      countOption === "custom"
        ? count
        : parseInt(countOption);

    let data = await fetchPuzzles(
      theme,
      minRating,
      maxRating,
      finalCount
    );
    console.log("Fetched puzzles:", data);

    // Sort puzzles based on selected sortOrder
    if (sortOrder === "lowToHigh") {
      data.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === "highToLow") {
      data.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === "random") {
      data = data.sort(() => Math.random() - 0.5);
    }

    setPuzzles(data);
    setLoading(false);

    if (data.length > 0) {
      generatePuzzlesPdf(
        data,
        theme,
        puzzleAppendingBoxRef.current,
        displayRating,
        displayCoordinates
      ); // Pass displayCoordinates
    } else {
      alert("No puzzles to generate PDF.");
    }
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.puzzleMenu}>
        <h1>Chess Puzzle Maker</h1>
        <form onSubmit={handleSubmit}>
          {/* Theme Selection */}
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

          {/* Rating Range */}
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

          {/* Count Options */}
          <label>
            Number of Puzzles :
            <div
              className={styles.puzzleCountRadioContainer}
            >
              <label>
                <input
                  type="radio"
                  name="countOption"
                  value="9"
                  checked={countOption === "9"}
                  onChange={() => {
                    setCountOption("9");
                    setCount(9);
                  }}
                />
                9
              </label>
              <label>
                <input
                  type="radio"
                  name="countOption"
                  value="18"
                  checked={countOption === "18"}
                  onChange={() => {
                    setCountOption("18");
                    setCount(18);
                  }}
                />
                18
              </label>
              <label>
                <input
                  type="radio"
                  name="countOption"
                  value="27"
                  checked={countOption === "27"}
                  onChange={() => {
                    setCountOption("27");
                    setCount(27);
                  }}
                />
                27
              </label>
              <label>
                <input
                  type="radio"
                  name="countOption"
                  value="custom"
                  checked={countOption === "custom"}
                  onChange={() => setCountOption("custom")}
                />
                Custom
                <input
                  type="number"
                  value={count}
                  onChange={(e) =>
                    setCount(parseInt(e.target.value))
                  }
                  disabled={countOption !== "custom"}
                  id="count-input"
                  style={{
                    marginLeft: "10px",
                    width: "60px",
                  }}
                />
              </label>
            </div>
          </label>

          {/* Display Rating Option */}
          <label className={styles.ratingCheckboxLabel}>
            <input
              type="checkbox"
              checked={displayRating}
              onChange={(e) =>
                setDisplayRating(e.target.checked)
              }
            />
            Display Rating
          </label>

          {/* Display Coordinates Option */}
          <label className={styles.coordinateCheckboxLabel}>
            <input
              type="checkbox"
              checked={displayCoordinates}
              onChange={(e) =>
                setDisplayCoordinates(e.target.checked)
              }
            />
            Display Coordinates
          </label>

          {/* Sorting Order Options */}
          <label className={styles.orderRadioLabel}>
            Order by Rating :
            <div
              className={styles.orderRadioLabelContainer}
            >
              <label>
                <input
                  type="radio"
                  name="sortOrder"
                  value="lowToHigh"
                  checked={sortOrder === "lowToHigh"}
                  onChange={() => setSortOrder("lowToHigh")}
                />
                Low to High
              </label>
              <label>
                <input
                  type="radio"
                  name="sortOrder"
                  value="highToLow"
                  checked={sortOrder === "highToLow"}
                  onChange={() => setSortOrder("highToLow")}
                />
                High to Low
              </label>
              <label>
                <input
                  type="radio"
                  name="sortOrder"
                  value="random"
                  checked={sortOrder === "random"}
                  onChange={() => setSortOrder("random")}
                />
                Random
              </label>
            </div>
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
