import { Puzzle } from "../interfaces/Puzzle";
import { Chess } from "chess.js";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const fetchPuzzles = async (
	theme: string | undefined,
	minRating: number | undefined,
	maxRating: number | undefined,
	count: number | undefined
): Promise<{
	puzzles: Puzzle[];
	themeDefinitions: Record<string, { fr: string; definition: string }>;
	error?: string;
}> => {
	console.log(
		"Fetching puzzles from:",
		`${API_URL}?count=${count}&theme=${theme}&minRating=${minRating}&maxRating=${maxRating}`
	);

	try {
		const response = await fetch(
			`${API_URL}?count=${count}&theme=${theme}&minRating=${minRating}&maxRating=${maxRating}`
		);

		console.log("Response status:", response.status);
		console.log("Response headers:", response.headers);

		if (!response.ok) {
			if (response.status === 400) {
				throw new Error("Invalid parameters. Please check your input.");
			} else if (response.status === 500) {
				throw new Error("Server error. Please try again later.");
			} else {
				throw new Error(
					"Failed to fetch puzzles. Unexpected error occurred."
				);
			}
		}

		const jsonResponse = await response.json();
		console.log("JSON response:", jsonResponse);

		if (jsonResponse.status === "error" || jsonResponse.error) {
			throw new Error(
				jsonResponse.message ||
					"An error occurred while fetching puzzles."
			);
		}

		// On extrait puzzles ET definitions
		const puzzles = jsonResponse.data.puzzles as Puzzle[];
		const themeDefinitions = jsonResponse.data.themes as Record<
			string,
			{ fr: string; definition: string }
		>;
		// Traitement des FEN et génération de solution
		puzzles.forEach((puzzle) => {
			const chess = new Chess(puzzle.fen);
			const moves = puzzle.moves ? puzzle.moves.split(" ") : [];

			if (moves.length > 0) chess.move(moves[0]);
			puzzle.fen = chess.fen();

			let moveNumber = 1;
			const solutionMoves: string[] = [];

			if (chess.turn() === "b" && moves.length > 1) {
				const blackFirst = chess.move(moves[1]);
				if (blackFirst) {
					solutionMoves.push(`1... ${blackFirst.san}`);
					moveNumber = 2;
				}
				moves.slice(2).forEach((move, idx) => {
					const result = chess.move(move);
					if (result) {
						const notation =
							idx % 2 === 0
								? `${moveNumber}.${result.san}`
								: result.san;
						solutionMoves.push(notation);
						if (idx % 2 !== 0) moveNumber++;
					}
				});
			} else {
				moves.slice(1).forEach((move, idx) => {
					const result = chess.move(move);
					if (result) {
						const notation =
							idx % 2 === 0
								? `${moveNumber}.${result.san}`
								: result.san;
						solutionMoves.push(notation);
						if (idx % 2 !== 0) moveNumber++;
					}
				});
			}

			puzzle.solution = solutionMoves.join(" ");
		});

		return { puzzles, themeDefinitions };
	} catch (error: any) {
		console.error(`Error fetching puzzles from ${API_URL}:`, error);
		return {
			puzzles: [],
			themeDefinitions: {},
			error: error.message || "An unexpected error occurred.",
		};
	}
};
