"use client";

import { fetchPuzzles } from "@/api/puzzleApi";
import { useState, useRef, useEffect } from "react";
import { Puzzle } from "@/interfaces/Puzzle";
import ChessboardComponent from "../services/chessboardGenerator";
import { generatePuzzlesPdf } from "@/services/generatePuzzlesPdf";
import styles from "./page.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Home = () => {
  // State to store selected themes, starting with one "Divers" theme
  const [themes, setThemes] = useState<string[]>([""]);
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
    useState<boolean>(true);
  const [sortOrder, setSortOrder] =
    useState<string>("lowToHigh");

  const selectContainerRef = useRef<HTMLDivElement>(null);
  const puzzleAppendingBoxRef =
    useRef<HTMLDivElement>(null);

  // Available themes for selection (translated to French)
  const themeOptions = [
    "divers",
    "pion avancé",
    "avantage",
    "mat arabe",
    "attaque F2F7",
    "attraction",
    "mat derrière",
    "finale de fou",
    "mat de Boden",
    "prise défenseur",
    "dégagement",
    "écrasement",
    "défense",
    "déviation",
    "attaque découverte",
    "mat double fou",
    "échec double",
    "en passant",
    "finale",
    "égalité",
    "roi exposé",
    "fourchette",
    "pièce en prise",
    "mat crochet",
    "interférence",
    "intermezzo",
    "attaque aile roi",
    "finale de cavalier",
    "long",
    "maître",
    "maître contre maître",
    "mat",
    "mat en 1",
    "mat en 2",
    "mat en 3",
    "mat en 4",
    "milieu de jeu",
    "un coup",
    "ouverture",
    "finale de pions",
    "clouage",
    "promotion",
    "finale de dame",
    "finale de dame et tour",
    "attaque aile dame",
    "coup silencieux",
    "finale de tour",
    "sacrifice",
    "court",
    "enfilade",
    "mat étouffé",
    "super grand maître",
    "pièce piégée",
    "très long",
    "rayon X",
    "zugzwang",
  ];

  // Function to handle adding a new theme selection or updating an existing one
  const addThemeSelect = (value: string, index: number) => {
    const updatedThemes = [...themes];
    updatedThemes[index] = value;

    // If the last select has a value, add a new blank select
    if (value && index === themes.length - 1) {
      updatedThemes.push("");
    }

    setThemes(updatedThemes);
  };

  // Function to handle removing a theme selection
  const removeThemeSelect = (index: number) => {
    const updatedThemes = themes.filter(
      (_, i) => i !== index
    );
    setThemes(updatedThemes);
  };

  useEffect(() => {
    // Toggle select arrow styling on focus and blur events
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

  // Handle form submission for fetching and displaying puzzles
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    // Filter out any empty themes before submission
    const selectedThemes = themes.filter(
      (theme) => theme !== ""
    );

    if (selectedThemes.length === 0) {
      alert("Please select at least one theme.");
      setLoading(false);
      return;
    }

    const finalCount =
      countOption === "custom"
        ? count
        : parseInt(countOption);

    let data = await fetchPuzzles(
      selectedThemes, // Pass the array of selected themes
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

    // Generate PDF if puzzles are available, otherwise alert
    if (data.length > 0) {
      generatePuzzlesPdf(
        data,
        selectedThemes.join(", "), // Join themes for PDF title
        puzzleAppendingBoxRef.current,
        displayRating,
        displayCoordinates
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
          {/* Multiple Theme selection dropdowns */}
          {themes.map((theme, index) => (
            <label
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {`Thème ${index + 1}`}
              <div
                className={styles.selectContainer}
                ref={selectContainerRef}
                style={{ marginLeft: "10px" }}
              >
                <select
                  value={theme}
                  onChange={(e) =>
                    addThemeSelect(e.target.value, index)
                  }
                  style={{
                    color: theme === "" ? "grey" : "white",
                  }} // Greys out placeholder text
                >
                  <option value="" disabled hidden>
                    Choisir un thème
                  </option>
                  {/* Only allow "Divers" for the first select; filter it out for others */}
                  {themeOptions
                    .filter(
                      (option) =>
                        (index === 0 &&
                          option === "divers") ||
                        (option !== "divers" &&
                          (!themes.includes(option) ||
                            option === theme))
                    )
                    .map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>
                <i className="fas fa-chevron-down select-arrow"></i>
              </div>
              {/* Display 'X' button for selected themes only (not the first one if blank) */}
              {index > 0 && theme && (
                <button
                  type="button"
                  onClick={() => removeThemeSelect(index)}
                  style={{
                    marginLeft: "10px",
                    paddingBottom: "18px",
                    background: "transparent",
                    border: "none",
                    color: "red",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              )}
            </label>
          ))}

          {/* Rating range selectors */}
          <label>
            Difficulté minimum : {minRating}
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
            Difficulté maximum : {maxRating}
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

          {/* Number of puzzles selection */}
          <label>
            Nombre de problèmes :
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
                Personnalisé
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

          {/* Display rating and coordinates options */}
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

          {/* Sorting order options */}
          <label className={styles.orderRadioLabel}>
            Ordre de difficulté :
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
                Croissant
              </label>
              <label>
                <input
                  type="radio"
                  name="sortOrder"
                  value="highToLow"
                  checked={sortOrder === "highToLow"}
                  onChange={() => setSortOrder("highToLow")}
                />
                Décroissant
              </label>
              <label>
                <input
                  type="radio"
                  name="sortOrder"
                  value="random"
                  checked={sortOrder === "random"}
                  onChange={() => setSortOrder("random")}
                />
                Aléatoire
              </label>
            </div>
          </label>

          <div
            ref={puzzleAppendingBoxRef}
            className="puzzle-appending-box"
          ></div>

          <button type="submit">
            Générer les problèmes
          </button>
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
