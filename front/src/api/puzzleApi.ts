// src/api/puzzleApi.ts

import { Puzzle } from "../interfaces/Puzzle";
import { Chess } from "chess.js"; // Import chess.js to handle moves

const API_URL = "http://localhost:8080/api/puzzles"; // Ensure the correct URL

export const fetchPuzzles = async (
  theme: string | undefined,
  minRating: number | undefined,
  maxRating: number | undefined,
  count: number | undefined
): Promise<Puzzle[]> => {
  try {
    const response = await fetch(
      `${API_URL}?count=${count}&theme=${theme}&minRating=${minRating}&maxRating=${maxRating}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch puzzles");
    }
    const puzzles: Puzzle[] = await response.json();

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
        // Black starts: `1... BlackMove`
        const result = chess.move(moves[1]);
        if (result) {
          solutionMoves.push(`1... ${result.san}`);
          moveNumber = 2; // Prepare for `2.` for White’s response
        }
        moves.slice(2).forEach((move, index) => {
          const result = chess.move(move);
          if (result) {
            const notation =
              index % 2 === 0
                ? `${moveNumber}.${result.san}` // White’s move
                : result.san; // Black’s move without numbering
            solutionMoves.push(notation);
            if (index % 2 !== 0) moveNumber++; // Increment after each Black move
          }
        });
      } else {
        // White starts: standard format
        moves.slice(1).forEach((move, index) => {
          const result = chess.move(move);
          if (result) {
            const notation =
              index % 2 === 0
                ? `${moveNumber}.${result.san}` // White’s move with move number
                : result.san; // Black’s move without numbering
            solutionMoves.push(notation);
            if (index % 2 !== 0) moveNumber++; // Increment after each Black move
          }
        });
      }

      // Join the moves into a single notation string and assign it to `solution`
      puzzle.solution = solutionMoves.join(" ");
    });

    return puzzles;
  } catch (error) {
    console.error(error);
    return [];
  }
};
