// src/app/homepage/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import GameCamera from "@/components/GameCamera"; // your camera component

interface RecognitionResult {
  id: string;
  name: string;
  thumbnail: string;
}

export default function HomeClient() {
  const { theme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // camera / recognition state
  const [showCam, setShowCam] = useState(false);
  const [recognition, setRecognition] = useState<RecognitionResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && theme === "dark"
      ? "/game-groove-logo-light.svg"
      : "/game-groove-logo-dark.svg";

  // handle "Find My Game" button
  const handleFindGameClick = () => {
    router.push("/search");
  };

  // handle captured photo from camera
  const handleCapture = async (blob: Blob) => {
    setShowCam(false);
    const form = new FormData();
    form.append("photo", blob, "snap.jpg");

    try {
      const res = await fetch("/api/recognize", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        console.error("Recognition API error");
        return;
      }
      const info: RecognitionResult = await res.json();
      setRecognition(info);
    } catch (err) {
      console.error("Recognition failed:", err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4">
      {/* Logo */}
      <div className="relative w-full max-w-[350px] h-[250px] sm:max-w-[550px] sm:h-[300px] md:w-[800px] md:h-[473px] mx-auto">
        {mounted && (
          <Image
            src={logoSrc}
            alt="Game Groove Logo"
            fill
            priority
            className="object-contain"
          />
        )}
      </div>

      {/* Recognition result */}
      {recognition && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md flex items-center space-x-4 max-w-md">
          <Image
            src={recognition.thumbnail}
            alt={recognition.name}
            width={80}
            height={80}
            className="rounded object-cover"
            unoptimized
          />
          <div>
            <h2 className="text-xl font-semibold">{recognition.name}</h2>
            <button
              onClick={() => router.push(`/game/${recognition.id}`)}
              className="mt-2 text-blue-600 hover:underline"
            >
              View Details →
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleFindGameClick}
          className="px-6 py-3 text-lg font-semibold rounded-lg transition bg-red-500 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-500 text-white"
        >
          Find My Game
        </button>
        <button
          onClick={() => setShowCam(true)}
          className="px-6 py-3 text-lg font-semibold rounded-lg transition bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-black dark:text-white"
        >
          📷 Identify with Camera
        </button>
      </div>

      {/* Camera modal */}
      {showCam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <GameCamera
            onCapture={handleCapture}
            onClose={() => setShowCam(false)}
          />
        </div>
      )}
    </main>
);
}
