// src/app/head.tsx
export default function Head() {
  return (
    <>
      <title>Game Groove</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="Find your next favorite board game with Game Groove!"
      />

      {/* Preload all logo variants */}
      <link
        rel="preload"
        href="/game-groove-icon.svg"
        as="image"
        type="image/svg+xml"
      />
      <link
        rel="preload"
        href="/game-groove-logo-light.svg"
        as="image"
        type="image/svg+xml"
      />
      <link
        rel="preload"
        href="/game-groove-logo-dark.svg"
        as="image"
        type="image/svg+xml"
      />

      {/* Favicon */}
      <link rel="icon" href="/game-groove-icon.svg" />
    </>
  );
}
