export const fetchGameDetails = async (id: string) => {
  try {
    console.log("Fetching game details for id:", id);
    // Update the URL below to the proper endpoint for retrieving a single game's details.
    const response = await fetch(`https://api.boardgamesapi.com/games/${id}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    // Parse JSON response.
    const game = await response.json();
    console.log("Fetched game details:", game);
    return game;
  } catch (error) {
    console.error("Error fetching game details:", error);
    return null;
  }
};