// pages/api/fenToImage.js

export default async function fenToImage(fen: string) {
  try {
    const response = await fetch(
      `https://fen2png.com/api/?fen=${encodeURIComponent(
        fen
      )}&raw=true`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image from fen2png");
    }

    const imageUrl = response.url; // Get the URL of the image
    return imageUrl;
  } catch (error) {
    console.error(error);
  }
}
