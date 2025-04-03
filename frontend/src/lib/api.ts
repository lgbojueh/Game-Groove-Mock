// src/lib/api.ts

export async function fetchProtectedData(token: string) {
            const response = await fetch('/api/protected/some-endpoint', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
          
            if (!response.ok) {
              throw new Error('Failed to fetch protected data');
            }
          
            return response.json();
          }
          