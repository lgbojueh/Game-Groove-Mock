export const fetchHotGames = async () => {
  try {
    console.log("Fetching hot games...");
    // Update the URL below based on the API documentation.
    // This example assumes an endpoint that returns popular games in JSON format.
    const response = await fetch("https://api.boardgamesapi.com/games/popular");
    if (!response.ok) {
      throw new Error("Failed to fetch hot games");
    }
    const data = await response.json();
    console.log("Hot games fetched:", data);
    // Adjust the mapping based on the API response structure.
    // For example, if the API returns an object with a "results" array:
    const games = data.results || data;
    // Optionally, map through the results to return only the necessary fields:
    return games.map((game: any) => ({
      id: game.id,
      name: game.name,
      thumbnail: game.thumbnail || "", // Provide a default if needed.
      // You can include additional fields if required.
    }));
  } catch (error) {
    console.error("Error fetching hot games:", error);
    return [];
  }
};