import axios from "axios";

// Fetch board games from BoardGameGeek API
export async function fetchGames(searchQuery: string) {
  try {
    const response = await axios.get(`https://boardgamegeek.com/xmlapi2/search?query=${searchQuery}&type=boardgame`);
    
    if (response.data) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}