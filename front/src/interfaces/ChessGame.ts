export interface ChessGame {
  event: string;
  site: string;
  date: string;
  white: string;
  black: string;
  result: string;
  utcDate: string;
  utcTime: string;
  whiteElo: string;
  blackElo: string;
  whiteRatingDiff: string;
  blackRatingDiff: string;
  variant: string;
  timeControl: string;
  eco: string;
  opening: string;
  termination: string;
  moves: string[];
}
