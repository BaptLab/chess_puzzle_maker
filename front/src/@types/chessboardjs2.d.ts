declare module "@chrisoakman/chessboard2" {
  export interface Chessboard {
    start(): void;
    clear(): void;
    destroy(): void;
    // Add other method signatures you might need based on the library's API
  }

  export default function Chessboard(
    elementId: string,
    options?: any
  ): Chessboard;
}
