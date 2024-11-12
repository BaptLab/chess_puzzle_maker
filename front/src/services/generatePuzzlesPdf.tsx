// src/services/generatePuzzlesPdf.ts

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Puzzle } from "@/interfaces/Puzzle";
import { Chessboard2 } from "@chrisoakman/chessboard2/dist/chessboard2.min.mjs";

export const generatePuzzlesPdf = async (
  puzzles: Puzzle[],
  theme: string,
  puzzleAppendingBox: HTMLElement | null
) => {
  if (!puzzleAppendingBox) return;

  const pdf = new jsPDF("p", "mm", "a4");
  const maxProblemsPerPage = 9;
  const cellWidth = 65;
  const cellHeight = 80;
  const startX = 15;
  const startY = 30;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const totalPages = Math.ceil(
    puzzles.length / maxProblemsPerPage
  );

  for (
    let pageIndex = 0;
    pageIndex < totalPages;
    pageIndex++
  ) {
    const currentPage = pageIndex + 1;
    pdf.setFontSize(16);
    const title = `Diagrammes à thème : ${
      theme || "Divers"
    }`;
    const titleX =
      (pageWidth - pdf.getTextWidth(title)) / 2;
    pdf.text(title, titleX, 15);

    const puzzlesOnPage = puzzles.slice(
      pageIndex * maxProblemsPerPage,
      pageIndex * maxProblemsPerPage + maxProblemsPerPage
    );
    const puzzlesPerRow = 3;

    for (let i = 0; i < puzzlesOnPage.length; i++) {
      const puzzle = puzzlesOnPage[i];
      const row = Math.floor(i / puzzlesPerRow);
      const col = i % puzzlesPerRow;
      const x = startX + col * cellWidth;
      const y = startY + row * cellHeight;
      const puzzleNumber =
        pageIndex * maxProblemsPerPage + i + 1; // Puzzle ID to match with the solution

      // Clear previous chessboard from the puzzle appending box
      puzzleAppendingBox.innerHTML = "";

      const container = document.createElement("div");
      container.style.width = "200px";
      container.style.height = "200px";
      const chessboardElement =
        document.createElement("div");
      chessboardElement.id = `chessboard-${
        i + pageIndex * maxProblemsPerPage
      }`;
      container.appendChild(chessboardElement);
      puzzleAppendingBox.appendChild(container);

      const chessboard = Chessboard2(chessboardElement.id, {
        draggable: false,
        dropOffBoard: "trash",
        sparePieces: true,
        showNotation: true, // Ensure board notation is displayed
      });
      chessboard.setPosition(puzzle.fen);

      await new Promise((resolve) =>
        setTimeout(resolve, 100)
      );

      await html2canvas(container, {
        useCORS: true,
        scale: 2,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", x, y, 50, 50);

        // Display puzzle number with a 20px offset to the right
        pdf.setFontSize(10);
        pdf.text(`${puzzleNumber}`, x - 4, y + 4);

        const whosToMove =
          puzzle.fen.split(" ")[1] === "w"
            ? "white"
            : "black";
        const dotX = x + 55;
        const dotY = y + 5;
        pdf.setLineWidth(0.5);
        pdf.setDrawColor(0, 0, 0);
        pdf.setFillColor(
          whosToMove === "white" ? "#ffffff" : "#000000"
        );
        pdf.circle(dotX, dotY, 2, "FD");

        pdf.text(`Rating: ${puzzle.rating}`, x, y + 55);
      });

      chessboard.clear();
      puzzleAppendingBox.removeChild(container);
    }

    pdf.setFontSize(10);
    const pageNumber = `${currentPage}/${totalPages}`;
    pdf.text(pageNumber, pageWidth - 20, pageHeight - 10);

    if (currentPage < totalPages) pdf.addPage();
  }

  // Add a new page for solutions
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text("Solutions", pageWidth / 2 - 10, 15);

  pdf.setFontSize(12);
  puzzles.forEach((puzzle, index) => {
    const solutionText = `${index + 1}. ${
      puzzle.solution || "No solution available"
    }`;
    const linePositionY = 30 + index * 10; // Position solutions with some spacing
    pdf.text(solutionText, 15, linePositionY);
  });

  const pdfBlobUrl = pdf.output("bloburl");
  window.open(pdfBlobUrl, "_blank");
};
