import { Puzzle } from "../interfaces/Puzzle";
import { Chess } from "chess.js"; // Import chess.js to handle moves

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchPuzzles = async (
  theme: string | undefined,
  minRating: number | undefined,
  maxRating: number | undefined,
  count: number | undefined
): Promise<Puzzle[]> => {
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
      throw new Error("Failed to fetch puzzles");
    }

    const jsonResponse = await response.json();
    console.log("JSON response:", jsonResponse);

    if (jsonResponse.status !== "success") {
      throw new Error("Unexpected API response");
    }

    const puzzles: Puzzle[] = jsonResponse.data;

    puzzles.forEach((puzzle) => {
      const chess = new Chess(puzzle.fen);
      const moves = puzzle.moves
        ? puzzle.moves.split(" ")
        : [];

      // Apply only the first move to the FEN for the final position
      if (moves.length > 0) {
        chess.move(moves[0]);
      }

      // Update the FEN to reflect the position after the first move
      puzzle.fen = chess.fen();

      // Generate the solution string
      let moveNumber = 1;
      const solutionMoves: string[] = [];

      // Check if Black is to move first
      if (chess.turn() === "b") {
        const result = chess.move(moves[1]);
        if (result) {
          solutionMoves.push(`1... ${result.san}`);
          moveNumber = 2;
        }
        moves.slice(2).forEach((move, index) => {
          const result = chess.move(move);
          if (result) {
            const notation =
              index % 2 === 0
                ? `${moveNumber}.${result.san}`
                : result.san;
            solutionMoves.push(notation);
            if (index % 2 !== 0) moveNumber++;
          }
        });
      } else {
        // White starts: standard format
        moves.slice(1).forEach((move, index) => {
          const result = chess.move(move);
          if (result) {
            const notation =
              index % 2 === 0
                ? `${moveNumber}.${result.san}`
                : result.san;
            solutionMoves.push(notation);
            if (index % 2 !== 0) moveNumber++;
          }
        });
      }

      // Join the moves into a single notation string and assign it to `solution`
      puzzle.solution = solutionMoves.join(" ");
    });

    return puzzles;
  } catch (error) {
    console.error(
      `Error fetching puzzles from ${API_URL}:`,
      error
    );
    return [];
  }
};
