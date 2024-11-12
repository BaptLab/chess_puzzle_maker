export interface Puzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string;
  gameUrl: string;
  imageUrl: string;
  whosToMove: string;
  solution: string;
}
