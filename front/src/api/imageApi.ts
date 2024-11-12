// src/api/imageApi.ts

const IMAGE_API_URL =
  "https://api.chess-image-generator.com/generate"; // Replace with the correct URL

export const generateImageFromFEN = async (
  fen: string
): Promise<string> => {
  try {
    const response = await fetch(
      `${IMAGE_API_URL}?fen=${encodeURIComponent(fen)}`
    );
    if (!response.ok) {
      throw new Error("Failed to generate image");
    }
    const data = await response.json();
    return data.imageUrl; // Adjust this based on the API response structure
  } catch (error) {
    console.error(error);
    return ""; // Return an empty string or handle the error as needed
  }
};
