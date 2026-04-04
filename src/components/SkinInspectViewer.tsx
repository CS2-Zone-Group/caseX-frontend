"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Spinner from "@/components/Spinner";
import { useTranslations } from "next-intl";

interface SkinInspectViewerProps {
  isOpen: boolean;
  onClose: () => void;
  skinName: string;
  screenshotUrl: string | null;
  floatValue?: number | null;
  exterior?: string;
  paintSeed?: number | null;
  paintIndex?: number | null;
}

export default function SkinInspectViewer({
  isOpen,
  onClose,
  skinName,
  screenshotUrl,
  floatValue,
  exterior,
  paintSeed,
  paintIndex,
}: SkinInspectViewerProps) {
  const t = useTranslations("SkinInspectViewer");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setImageError(false);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, screenshotUrl]);

  // Handle keyboard
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(z + 0.25, 4));
      } else if (e.key === "-") {
        setZoom((z) => Math.max(z - 0.25, 0.5));
      } else if (e.key === "0") {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      setZoom((z) => Math.min(Math.max(z + delta, 0.5), 4));
    },
    []
  );

  // Handle drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [zoom, position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getFloatColor = (f: number) => {
    if (f < 0.07) return "#22c55e";
    if (f < 0.15) return "#84cc16";
    if (f < 0.38) return "#eab308";
    if (f < 0.45) return "#f97316";
    return "#ef4444";
  };

  const getFloatLabel = (f: number) => {
    if (f < 0.07) return "Factory New";
    if (f < 0.15) return "Minimal Wear";
    if (f < 0.38) return "Field-Tested";
    if (f < 0.45) return "Well-Worn";
    return "Battle-Scarred";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/80 border-b border-gray-800">
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="text-white font-semibold text-sm sm:text-base truncate">
            {skinName}
          </h3>
          {exterior && (
            <span className="hidden sm:inline-block px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-md flex-shrink-0">
              {exterior}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-800/80 rounded-lg px-2 py-1">
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
              className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title={t("zoomOut")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-gray-300 text-xs font-mono w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}
              className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title={t("zoomIn")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ml-1"
              title={t("resetZoom")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title={t("close")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden"
        style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {!screenshotUrl ? (
          <div className="text-center text-gray-400 space-y-3">
            <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-lg">{t("notAvailable")}</p>
            <p className="text-sm text-gray-500">{t("notAvailableHint")}</p>
          </div>
        ) : (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Spinner size={40} color="#22d3ee" />
                <p className="text-gray-400 text-sm">{t("loading")}</p>
              </div>
            )}

            {imageError && (
              <div className="text-center text-gray-400 space-y-3">
                <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-lg">{t("loadError")}</p>
                <p className="text-sm text-gray-500">{t("loadErrorHint")}</p>
              </div>
            )}

            <img
              src={screenshotUrl}
              alt={skinName}
              className="max-w-full max-h-full object-contain transition-transform duration-150"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                display: imageLoaded ? "block" : "none",
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              draggable={false}
            />
          </>
        )}
      </div>

      {/* Bottom info bar */}
      {screenshotUrl && imageLoaded && (
        <div className="px-4 sm:px-6 py-3 bg-black/80 border-t border-gray-800">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center text-sm">
            {/* Float value */}
            {floatValue !== null && floatValue !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{t("float")}:</span>
                <span className="font-mono font-medium text-white">
                  {Number(floatValue).toFixed(8)}
                </span>
                <span
                  className="px-1.5 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: getFloatColor(Number(floatValue)) + "20",
                    color: getFloatColor(Number(floatValue)),
                  }}
                >
                  {getFloatLabel(Number(floatValue))}
                </span>
              </div>
            )}

            {/* Float bar */}
            {floatValue !== null && floatValue !== undefined && (
              <div className="hidden sm:flex items-center gap-2 min-w-[150px]">
                <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 relative">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md border border-gray-800"
                    style={{
                      left: `${Number(floatValue) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Paint seed */}
            {paintSeed !== null && paintSeed !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{t("paintSeed")}:</span>
                <span className="font-mono font-medium text-white">{paintSeed}</span>
              </div>
            )}

            {/* Paint index */}
            {paintIndex !== null && paintIndex !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{t("paintIndex")}:</span>
                <span className="font-mono font-medium text-white">{paintIndex}</span>
              </div>
            )}

            {/* Keyboard shortcuts hint */}
            <div className="hidden lg:flex items-center gap-2 text-gray-600 text-xs">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">+/-</kbd>
              <span>{t("zoom")}</span>
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 ml-2">0</kbd>
              <span>{t("reset")}</span>
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 ml-2">Esc</kbd>
              <span>{t("close")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
