export const fetchHotGames = async () => {
            try {
              console.log("Fetching hot games...");
              const response = await fetch("https://www.boardgamegeek.com/xmlapi2/hot?type=boardgame");
              if (!response.ok) {
                throw new Error("Failed to fetch hot games");
              }
              const xmlText = await response.text();
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, "text/xml");
              const items = Array.from(xmlDoc.getElementsByTagName("item"));
          
              const games = items.map((item) => {
                const id = item.getAttribute("id");
                const name = item.getElementsByTagName("name")[0]?.getAttribute("value") || "Unknown Game";
                // The hot endpoint sometimes does not include a thumbnail; adjust if available.
                const thumbnail = item.getElementsByTagName("thumbnail")[0]?.textContent || "";
                return { id, name, thumbnail };
              });
          
              console.log("Hot games fetched:", games);
              return games;
            } catch (error) {
              console.error("Error fetching hot games:", error);
              return [];
            }
          };          