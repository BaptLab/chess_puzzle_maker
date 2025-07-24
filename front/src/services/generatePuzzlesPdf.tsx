import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Puzzle } from "@/interfaces/Puzzle";
import { Chessboard2 } from "@chrisoakman/chessboard2/dist/chessboard2.min.mjs";

export const generatePuzzlesPdf = async (
	puzzles: Puzzle[],
	theme: string,
	puzzleAppendingBox: HTMLElement | null,
	displayRating: boolean,
	displayCoordinates: boolean,
	displayDefinitions: boolean,
	themeDefinitions: Record<string, { fr: string; definition: string }>
) => {
	if (!puzzleAppendingBox) return;

	const pdf = new jsPDF("p", "mm", "a4");
	const maxProblemsPerPage = 9;
	const cellWidth = 65;
	const defaultCellHeight = 88;
	const reducedCellHeight = 78;
	const definitionsOffset = 7; // marge après définitions

	const startX = 15;
	const defaultStartY = 40;
	const pageWidth = pdf.internal.pageSize.getWidth();
	const pageHeight = pdf.internal.pageSize.getHeight();
	const totalPages = Math.ceil(puzzles.length / maxProblemsPerPage);

	const leftCoordinates = ["8", "7", "6", "5", "4", "3", "2", "1"];
	const bottomCoordinates = ["a", "b", "c", "d", "e", "f", "g", "h"];

	// Nombre de thèmes
	const defsCount = Object.keys(themeDefinitions).length;

	for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
		const currentPage = pageIndex + 1;
		pdf.setFontSize(16);
		const title = `Diagrammes à thème : ${theme || "Divers"}`;
		const titleX = (pageWidth - pdf.getTextWidth(title)) / 2;
		const advertising =
			"Ces diagrammes ont été générés gratuitement sur https://chesspuzzlemaker.com";
		pdf.text(title, titleX, 15);
		pdf.setFontSize(8); // ⇦ ici tu changes la taille juste pour la pub

		pdf.text(advertising, 10, pageHeight - 10);

		// ► Affichage des définitions (page 1)
		let defYEnd = 0;
		if (displayDefinitions && pageIndex === 0) {
			pdf.setFontSize(10);
			let defY = 25;
			const defX = 15;
			Object.values(themeDefinitions).forEach((value) => {
				const line = `${value.fr} : ${value.definition}`;
				const wrapped = pdf.splitTextToSize(line, pageWidth - 30);
				pdf.text(wrapped, defX, defY);
				defY += wrapped.length * 3 + 2;
			});
			defYEnd = defY;
		}

		// ► Calcul du Y de départ des diagrammes
		const puzzlesStartY =
			pageIndex === 0 && displayDefinitions
				? defYEnd + definitionsOffset
				: defaultStartY;

		// ► Choix de la hauteur de ligne
		const useReducedHeight = pageIndex === 0 && defsCount >= 4;
		const cellHeight = useReducedHeight
			? reducedCellHeight
			: defaultCellHeight;

		// ► Dessin des diagrammes
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
			const y = puzzlesStartY + row * cellHeight;
			const puzzleNumber = pageIndex * maxProblemsPerPage + i + 1;

			// Génération du container pour html2canvas
			puzzleAppendingBox.innerHTML = "";
			const container = document.createElement("div");
			container.style.width = "200px";
			container.style.height = "200px";
			const chessboardElement = document.createElement("div");
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

			await new Promise((res) => setTimeout(res, 100));

			await html2canvas(container, { useCORS: true, scale: 1.7 }).then(
				(canvas) => {
					const imgData = canvas.toDataURL("image/png");
					pdf.addImage(imgData, "PNG", x, y, 50, 50);

					// Numéro
					pdf.setFontSize(10);
					pdf.setFont("helvetica", "bold");
					pdf.text(`${puzzleNumber}`, x + 54, y + 4);
					pdf.setFont("helvetica", "normal");

					// Difficulté
					if (displayRating) {
						pdf.setFontSize(10);
						pdf.text(
							`Difficulté : ${puzzle.rating}`,
							x + 15,
							y + 60
						);
					}

					// Qui joue
					const whosToMove =
						puzzle.fen.split(" ")[1] === "w" ? "white" : "black";
					const dotX = x + 55;
					const dotY = y + 45;
					pdf.setLineWidth(0.4);
					pdf.setDrawColor(0, 0, 0);
					pdf.setFillColor(
						whosToMove === "white" ? "#ffffff" : "#000000"
					);
					pdf.circle(dotX, dotY, 2, "FD");

					// Coordonnées
					if (displayCoordinates) {
						pdf.setFontSize(8);
						leftCoordinates.forEach((num, idx) => {
							pdf.text(num, x - 5, y + 5 + idx * 6.1);
						});
						bottomCoordinates.forEach((ltr, idx) => {
							pdf.text(ltr, x + 3 + idx * 6.1, y + 54);
						});
					}
				}
			);

			chessboard.clear();
			puzzleAppendingBox.removeChild(container);
		}

		// ► Pagination
		pdf.setFontSize(10);
		pdf.text(
			`${currentPage}/${totalPages}`,
			pageWidth - 20,
			pageHeight - 10
		);
		if (currentPage < totalPages) pdf.addPage();
	}

	// ► Page des solutions
	pdf.addPage();
	pdf.setFontSize(16);
	pdf.text("Solutions", pageWidth / 2 - 10, 15);
	pdf.setFontSize(12);

	const columnLimit = 22;
	const lineHeight = 12;
	const leftColumnX = 15;
	const rightColumnX = pageWidth / 2 + 10;
	const maxLineWidth = pageWidth / 2 - 20;

	puzzles.forEach((p, idx) => {
		const sol = `${idx + 1}. ${p.solution || "No solution available"}`;
		const xPos = idx < columnLimit ? leftColumnX : rightColumnX;
		const yPos = 30 + (idx % columnLimit) * lineHeight;
		const wrapped = pdf.splitTextToSize(sol, maxLineWidth);
		pdf.text(wrapped, xPos, yPos);
	});

	return pdf.output("bloburl").toString();
};
