import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Puzzle } from "@/interfaces/Puzzle";
import { Chessboard2 } from "@chrisoakman/chessboard2/dist/chessboard2.min.mjs";

export const generatePuzzlesPdf = async (
  puzzles: Puzzle[],
  theme: string,
  puzzleAppendingBox: HTMLElement | null,
  displayRating: boolean, // Parameter for displaying rating
  displayCoordinates: boolean // Parameter for displaying coordinates
) => {
  if (!puzzleAppendingBox) return;

  const pdf = new jsPDF("p", "mm", "a4");
  const maxProblemsPerPage = 9;
  const cellWidth = 65;
  const cellHeight = 88;
  const startX = 15;
  const startY = 40;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const totalPages = Math.ceil(
    puzzles.length / maxProblemsPerPage
  );

  const leftCoordinates = [
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "1",
  ];
  const bottomCoordinates = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
  ];

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
        pageIndex * maxProblemsPerPage + i + 1;

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
        showNotation: false,
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

        // Display puzzle number on the right and bold
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${puzzleNumber}`, x + 54, y + 4);

        // Reset font to normal before rendering other elements
        pdf.setFont("helvetica", "normal");

        // Conditionally display rating based on displayRating parameter
        if (displayRating) {
          pdf.setFontSize(10);
          pdf.text(
            `Difficulté : ${puzzle.rating}`,
            x + 15,
            y + 60
          );
        }

        const whosToMove =
          puzzle.fen.split(" ")[1] === "w"
            ? "white"
            : "black";
        const dotX = x + 55;
        const dotY = y + 45;
        pdf.setLineWidth(0.4);
        pdf.setDrawColor(0, 0, 0);
        pdf.setFillColor(
          whosToMove === "white" ? "#ffffff" : "#000000"
        );
        pdf.circle(dotX, dotY, 2, "FD");

        // Conditionally display coordinates based on displayCoordinates parameter
        if (displayCoordinates) {
          pdf.setFontSize(8);
          leftCoordinates.forEach((num, index) => {
            pdf.text(num, x - 5, y + 5 + index * 6.1);
          });
          bottomCoordinates.forEach((letter, index) => {
            pdf.text(letter, x + 3 + index * 6.1, y + 54);
          });
        }
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
  const columnLimit = 22; // Switch to the right column after 25 solutions
  const lineHeight = 12; // Increase line height for more vertical spacing
  const leftColumnX = 15; // X position for the left column
  const rightColumnX = pageWidth / 2 + 10; // X position for the right column
  const maxLineWidth = pageWidth / 2 - 20; // Maximum width for wrapping text

  puzzles.forEach((puzzle, index) => {
    const solutionText = `${index + 1}. ${
      puzzle.solution || "No solution available"
    }`;

    // Determine the x and y positions based on the index
    const xPosition =
      index < columnLimit ? leftColumnX : rightColumnX;
    const yPosition =
      30 + (index % columnLimit) * lineHeight;

    // Split text to wrap within the max line width
    const wrappedText = pdf.splitTextToSize(
      solutionText,
      maxLineWidth
    );

    // Render the wrapped text
    pdf.text(wrappedText, xPosition, yPosition);
  });

  const pdfBlobUrl = pdf.output("bloburl");
  window.open(pdfBlobUrl, "_blank");
};
