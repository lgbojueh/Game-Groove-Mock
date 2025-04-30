// src/components/GameCamera.tsx
"use client";

import { useRef, useCallback, useEffect } from "react";
import ReactWebcam from "react-webcam";

interface GameCameraProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export default function GameCamera({ onCapture, onClose }: GameCameraProps) {
  const webcamRef = useRef<ReactWebcam>(null);

  // Capture current frame as blob
  const capture = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot(); 
    if (!screenshot) return;
    // convert data URI to Blob
    const res = await fetch(screenshot);
    const blob = await res.blob();
    onCapture(blob);
  }, [onCapture]);

  // Ensure the component only loads once
  useEffect(() => {
    return () => {
      // react-webcam handles track cleanup internally on unmount
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg overflow-hidden">
        <ReactWebcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment", // back camera on mobile
          }}
          className="w-full h-full object-cover"
        />
        <div className="flex justify-between p-2 bg-gray-800">
          <button
            onClick={capture}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Capture
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
