import { Chess } from "chess.js"; // Import chess.js to handle the game logic
import { Chessboard2 } from "@chrisoakman/chessboard2/dist/chessboard2.min.mjs"; // Chessboard.js module
import "@chrisoakman/chessboard2/dist/chessboard2.min.css"; // Chessboard.js styles

export const generateSpectatorChessboard = (
  elementId: string,
  rawMoves: string[], // Raw PGN moves with metadata
  fen: string // Initial FEN position
) => {
  const chess = new Chess(fen); // Initialize chess.js instance with the FEN
  const board = Chessboard2(elementId, {
    draggable: false, // Prevent dragging of pieces
    dropOffBoard: "trash", // Disable dragging functionality
  });

  // Preprocess the raw moves to remove metadata and extract only the actual moves
  const cleanMoves = rawMoves
    .map((move) => move.replace(/\{.*?\}/g, "").trim()) // Remove anything inside curly braces and trim
    .filter((move) => move !== ""); // Remove empty strings

  let currentMoveIndex = 0;

  // Function to update the board position
  const updatePosition = (moveIndex: number) => {
    chess.reset(); // Reset the board to the initial position
    for (let i = 0; i < moveIndex; i++) {
      const move = cleanMoves[i];
      if (!chess.move(move)) {
        console.error(`Invalid move: ${move}`);
        break; // Stop if an invalid move is encountered
      }
    }
    board.setPosition(chess.fen()); // Update the chessboard position
  };

  // Initialize with the first position
  updatePosition(currentMoveIndex);

  // Handlers for moving through the game
  const nextMove = () => {
    if (currentMoveIndex < cleanMoves.length) {
      currentMoveIndex++;
      updatePosition(currentMoveIndex);
    }
  };

  const previousMove = () => {
    if (currentMoveIndex > 0) {
      currentMoveIndex--;
      updatePosition(currentMoveIndex);
    }
  };

  // Return the handlers for external controls
  return {
    nextMove,
    previousMove,
  };
};
