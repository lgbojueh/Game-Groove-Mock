// src/lib/api.ts

export async function fetchProtectedData(token: string) {
  try {
    const response = await fetch('/api/protected/some-endpoint', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch protected data');
    }

    return await response.json();
  } catch (error: any) {
    console.error("Protected fetch error:", error);
    throw new Error(error.message || 'Unexpected error while fetching data');
  }
}
