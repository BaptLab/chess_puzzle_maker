"use client";

import { fetchPuzzles } from "@/api/puzzleApi";
import { useState, useRef, useEffect } from "react";
import { Puzzle } from "@/interfaces/Puzzle";
import ChessboardComponent from "../services/chessboardGenerator";
import { generatePuzzlesPdf } from "@/services/generatePuzzlesPdf";
import styles from "./page.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";

const Home = () => {
	const [themes, setThemes] = useState<string[]>(["Divers"]);
	const [minRating, setMinRating] = useState<number>(1);
	const [maxRating, setMaxRating] = useState<number>(3000);
	const [count, setCount] = useState<number>(9);
	const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
	const [countOption, setCountOption] = useState<string>("9");
	const [displayRating, setDisplayRating] = useState<boolean>(true);
	const [displayDefinitions, setDisplayDefinitions] = useState<boolean>(true);
	const [displayCoordinates, setDisplayCoordinates] = useState<boolean>(true);
	const [sortOrder, setSortOrder] = useState<string>("lowToHigh");
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);

	const selectContainerRef = useRef<HTMLDivElement>(null);
	const puzzleAppendingBoxRef = useRef<HTMLDivElement>(null);

	const themeOptions = [
		"Divers",
		"Pion avancé",
		"Avantage",
		"Mat arabe",
		"Attaque sur f2 f7",
		"Attraction",
		"Mat sur la dernière rangée",
		"Finale de fou",
		"Mat de Boden",
		"Prise du défenseur",
		"Découverte",
		"Écrasement",
		"Défense",
		"Déviation",
		"Attaque à la découverte",
		"Mat avec deux fous",
		"Échec double",
		"En passant",
		"Finale",
		"Égalité",
		"Roi exposé",
		"Fourchette",
		"Pièce en prise",
		"Mat du crochet",
		"Interférence",
		"Intermezzo",
		"Attaque sur l'aile roi",
		"Finale de cavalier",
		"Problème long",
		"Maître",
		"Maître contre maître",
		"Mat",
		"Mat en 1",
		"Mat en 2",
		"Mat en 3",
		"Mat en 4",
		"Milieu de jeu",
		"Un coup",
		"Ouverture",
		"Finale de pions",
		"Clouage",
		"Promotion",
		"Finale de dames",
		"Finale de dames et tours",
		"Attaque sur l'aile dame",
		"Coup silencieux",
		"Finale de tours",
		"Sacrifice",
		"Court",
		"Enfilade",
		"Mat à l'étouffé",
		"Super grand maître",
		"Pièce enfermée",
		"Très long",
		"Rayon X",
		"Zugzwang",
	];

	const addThemeSelect = (value: string, index: number) => {
		const updatedThemes = [...themes];
		updatedThemes[index] = value;
		if (value && index === themes.length - 1) {
			updatedThemes.push("");
		}
		setThemes(updatedThemes);
	};

	const removeThemeSelect = (index: number) => {
		const updatedThemes = themes.filter((_, i) => i !== index);
		setThemes(updatedThemes);
	};

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
			selectElement.addEventListener("click", toggleSelectArrow);
			selectElement.addEventListener("blur", removeSelectArrow);
		}

		return () => {
			if (selectElement) {
				selectElement.removeEventListener("click", toggleSelectArrow);
				selectElement.removeEventListener("blur", removeSelectArrow);
			}
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage(null);

		const selectedThemes = themes.filter((theme) => theme !== "");
		if (selectedThemes.length === 0) {
			alert("Choisissez au moins un thème.");
			setLoading(false);
			return;
		}

		const finalCount =
			countOption === "custom" ? count : parseInt(countOption);

		const response = await fetchPuzzles(
			selectedThemes.join(","),
			minRating,
			maxRating,
			finalCount
		);

		if (response.error) {
			// If the API indicates an error, display the alert
			alert(
				"Aucun problème avec ces paramètres n'a été trouvé.\nEssayer de réduire le nombre de thèmes ou d'élargir l'écart d'élo."
			);
			setLoading(false);
			return;
		}

		const data = response.puzzles || []; // Default to an empty array if no puzzles are returned
		const themeDefinitions = response.themeDefinitions || {};

		if (!Array.isArray(data) || data.length === 0) {
			alert(
				"Aucun problème avec ces paramètres n'a été trouvé.\nEssayer de réduire le nombre de thèmes ou d'élargir l'écart d'élo."
			);
			setLoading(false);
			return;
		}

		if (sortOrder === "lowToHigh") {
			data.sort((a, b) => a.rating - b.rating);
		} else if (sortOrder === "highToLow") {
			data.sort((a, b) => b.rating - a.rating);
		} else if (sortOrder === "random") {
			data.sort(() => Math.random() - 0.5);
		}

		setPuzzles(data);
		setLoading(false);

		const blobUrl = await generatePuzzlesPdf(
			data,
			selectedThemes.join(", "),
			puzzleAppendingBoxRef.current,
			displayRating,
			displayCoordinates,
			displayDefinitions,
			themeDefinitions
		);
		if (blobUrl) {
			setPdfUrl(blobUrl); // ← stocke dans le state
			window.open(blobUrl, "_blank"); // ← ouvre le nouvel onglet
		}
	};

	return (
		<>
			<Header />
			<main className={styles.mainContainer}>
				<div className={styles.puzzleMenu}>
					<h2>Sélectionnez vos paramètres</h2>
					{errorMessage && (
						<p style={{ color: "red", fontWeight: "bold" }}>
							{errorMessage}
						</p>
					)}
					<form onSubmit={handleSubmit}>
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
											addThemeSelect(
												e.target.value,
												index
											)
										}
										style={{
											color:
												theme === "" ? "grey" : "white",
										}}
									>
										<option value='' disabled hidden>
											Choisir un thème
										</option>
										{themeOptions
											.filter(
												(option) =>
													(index === 0 &&
														option === "divers") ||
													(option !== "divers" &&
														(!themes.includes(
															option
														) ||
															option === theme))
											)
											.map((t) => (
												<option key={t} value={t}>
													{t}
												</option>
											))}
									</select>
									<i className='fas fa-chevron-down select-arrow'></i>
								</div>
								{index > 0 && theme && (
									<button
										type='button'
										onClick={() => removeThemeSelect(index)}
										style={{
											marginLeft: "20px",
											marginBottom: "8px",
											padding: "3px 8px 4px 8px",
											borderRadius: "5px",
											background: "rgb(213 61 44)",
											border: "1px solid rgb(213 61 44)",
											color: "white",
											fontSize: "18px",
											cursor: "pointer",
										}}
									>
										✕
									</button>
								)}
							</label>
						))}

						<label>
							Difficulté minimum : {minRating}
							<input
								type='range'
								min='1'
								max='3001'
								step='200'
								value={minRating}
								onChange={(e) =>
									setMinRating(parseInt(e.target.value))
								}
							/>
						</label>
						<label>
							Difficulté maximum : {maxRating}
							<input
								type='range'
								min='1'
								max='3001'
								step='200'
								value={maxRating}
								onChange={(e) =>
									setMaxRating(parseInt(e.target.value))
								}
							/>
						</label>

						<label>
							Nombre de problèmes :
							<div className={styles.puzzleCountRadioContainer}>
								<label>
									<input
										type='radio'
										name='countOption'
										value='9'
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
										type='radio'
										name='countOption'
										value='18'
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
										type='radio'
										name='countOption'
										value='27'
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
										type='radio'
										name='countOption'
										value='custom'
										checked={countOption === "custom"}
										onChange={() =>
											setCountOption("custom")
										}
									/>
									Personnalisé
									<input
										type='number'
										value={count}
										onChange={(e) =>
											setCount(parseInt(e.target.value))
										}
										disabled={countOption !== "custom"}
										id='count-input'
										style={{
											marginLeft: "10px",
											width: "60px",
										}}
									/>
								</label>
							</div>
						</label>
						<label className={styles.definitionCheckboxLabel}>
							<input
								type='checkbox'
								checked={displayDefinitions}
								onChange={(e) =>
									setDisplayDefinitions(e.target.checked)
								}
							/>
							Afficher la ou les définitions
						</label>
						<label className={styles.ratingCheckboxLabel}>
							<input
								type='checkbox'
								checked={displayRating}
								onChange={(e) =>
									setDisplayRating(e.target.checked)
								}
							/>
							Afficher le classement
						</label>
						<label className={styles.coordinateCheckboxLabel}>
							<input
								type='checkbox'
								checked={displayCoordinates}
								onChange={(e) =>
									setDisplayCoordinates(e.target.checked)
								}
							/>
							Afficher les coordonnées
						</label>

						<label className={styles.orderRadioLabel}>
							Ordre de difficulté :
							<div className={styles.orderRadioLabelContainer}>
								<label>
									<input
										type='radio'
										name='sortOrder'
										value='lowToHigh'
										checked={sortOrder === "lowToHigh"}
										onChange={() =>
											setSortOrder("lowToHigh")
										}
									/>
									Croissant
								</label>
								<label>
									<input
										type='radio'
										name='sortOrder'
										value='highToLow'
										checked={sortOrder === "highToLow"}
										onChange={() =>
											setSortOrder("highToLow")
										}
									/>
									Décroissant
								</label>
								<label>
									<input
										type='radio'
										name='sortOrder'
										value='random'
										checked={sortOrder === "random"}
										onChange={() => setSortOrder("random")}
									/>
									Aléatoire
								</label>
							</div>
						</label>

						<div
							ref={puzzleAppendingBoxRef}
							className='puzzle-appending-box'
						></div>

						<button id='generate-puzzle-btn' type='submit'>
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
					{pdfUrl && (
						<p style={{ marginTop: "15px" }}>
							<a
								href={pdfUrl}
								target='_blank'
								rel='noopener noreferrer'
							>
								📄 Cliquez ici si le PDF ne s’est pas ouvert
							</a>
						</p>
					)}
				</div>
				<p
					style={{
						position: "fixed",
						bottom: "10px",
						right: "10px",
						fontSize: "12px",
						color: "#aaa",
					}}
				>
					v1.0.3
				</p>
			</main>
			<Footer />
		</>
	);
};

export default Home;
