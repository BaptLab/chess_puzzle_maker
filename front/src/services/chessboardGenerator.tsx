import { useEffect, useRef } from "react";
import "@chrisoakman/chessboard2/dist/chessboard2.min.css"; // Import CSS
import { Chessboard2 } from "@chrisoakman/chessboard2/dist/chessboard2.min.mjs"; // Import Chessboard.js directly from dist

interface ChessboardComponentProps {
  fen: string; // Define the prop type for FEN
  id: string; // Define the prop type for the unique id
}

const ChessboardComponent: React.FC<
  ChessboardComponentProps
> = ({ fen, id }) => {
  const boardRef = useRef<Chessboard | null>(null); // Create a ref to hold the board instance

  useEffect(() => {
    // Initialize the chessboard with the provided FEN string
    boardRef.current = Chessboard2(id, {
      draggable: false,
      dropOffBoard: "trash",
      sparePieces: true,
    });
    boardRef.current.setPosition(fen); // Set the initial position using the FEN

    return () => {
      boardRef.current?.destroy(); // Cleanup on unmount
    };
  }, [fen, id]); // Re-run effect if fen or id prop changes

  return (
    <div>
      <div id={id} style={{ width: "300px" }}></div>
    </div>
  );
};

export default ChessboardComponent;
