import { useState, useEffect } from "react";

function PhotoZoomModal({ photo, onClose }) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background body scroll while zoom modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Top Controls Bar */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white">
          <h2 className="text-base sm:text-lg font-bold">{photo.title}</h2>
          <p className="text-xs text-gray-300">
            {photo.category} · Click photo to toggle 2x zoom
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Toggle Button */}
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white transition cursor-pointer"
            title={isZoomed ? "Zoom Out (1x)" : "Zoom In (2x)"}
          >
            <span>{isZoomed ? "🔍 Zoom Out (1x)" : "🔎 Zoom In (2x)"}</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur-md transition cursor-pointer"
            aria-label="Close zoomed view"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Zoomable Image Container */}
      <div
        className="relative max-h-[90vh] max-w-[95vw] overflow-auto flex items-center justify-center p-2 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.image}
          alt={photo.title}
          onClick={() => setIsZoomed((prev) => !prev)}
          className={`rounded-lg object-contain transition-all duration-300 select-none shadow-2xl ${
            isZoomed
              ? "max-h-none max-w-none scale-150 sm:scale-175 cursor-zoom-out"
              : "max-h-[80vh] max-w-[90vw] cursor-zoom-in hover:opacity-95"
          }`}
          title={isZoomed ? "Click to zoom out" : "Click to zoom in"}
        />
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 backdrop-blur-md px-4 py-1.5 text-xs text-gray-300 pointer-events-none">
        {isZoomed ? "Click image or button to reset fit" : "Click image to zoom in"}
      </div>
    </div>
  );
}

export default PhotoZoomModal;
