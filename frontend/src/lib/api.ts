// src/lib/api.ts

export async function fetchProtectedData(token: string) {
  const response = await fetch('/api/protected/some-endpoint', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData: Record<string, unknown> = await response.json().catch(() => ({}));
    throw new Error(
      typeof errorData.error === 'string' ? errorData.error : 'Failed to fetch protected data'
    );
  }

  return response.json();
}
