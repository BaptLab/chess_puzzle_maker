import { useEffect, useRef } from "react";
import "@chrisoakman/chessboard2/dist/chessboard2.min.css"; // Chessboard.js styles
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Chessboard2 } from "@chrisoakman/chessboard2/dist/chessboard2.min.mjs"; // Chessboard.js module

interface ChessboardComponentProps {
  fen: string; // FEN string to set the initial board position
  id: string; // Unique ID for each board instance
}

const ChessboardComponent: React.FC<
  ChessboardComponentProps
> = ({ fen, id }) => {
  const boardRef = useRef<any | null>(null); // Ref to hold the chessboard instance

  useEffect(() => {
    // Initialize chessboard with FEN and configuration
    boardRef.current = Chessboard2(id, {
      draggable: false,
      dropOffBoard: "trash",
      sparePieces: true,
    });
    boardRef.current.setPosition(fen); // Set initial position

    // Cleanup the chessboard instance on unmount
    return () => {
      boardRef.current?.destroy();
    };
  }, [fen, id]); // Reinitialize if fen or id changes

  return (
    <div>
      <div id={id} style={{ width: "300px" }}></div>
    </div>
  );
};

export default ChessboardComponent;
