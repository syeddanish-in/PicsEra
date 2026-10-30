import { useState } from "react";
import StarRating from "./StarRating.jsx";
import PhotoZoomModal from "./PhotoZoomModal.jsx";
import { useAuth } from "../context/useAuth.js";

function PhotoCard({
    photo,
    fixedRating,
    userRating,
    onRate,
}) {
    const { isPhotoSaved, toggleSavePhoto, addToCart, currentUser, openAuthModal } = useAuth();
    const isSaved = isPhotoSaved(photo.id);
    const [addedAlert, setAddedAlert] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const handleSaveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSavePhoto(photo.id);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const success = addToCart(photo, 1);
        if (success && currentUser) {
            setAddedAlert(true);
            setTimeout(() => setAddedAlert(false), 1600);
        }
    };

    // User must be logged in to rate/like photos
    const handleRate = (rating) => {
        if (!currentUser) {
            openAuthModal("signin", "Please sign in to rate this photograph!");
            return;
        }
        onRate(rating);
    };

    return (
        <>
            <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Photo & Overlays (Click opens Zoom state, NOT cart) */}
                <div
                    onClick={() => setIsZoomOpen(true)}
                    className="group relative h-64 overflow-hidden bg-gray-100 cursor-zoom-in"
                    title="Click photo to zoom"
                >
                    <img
                        src={photo.image}
                        alt={photo.alt || photo.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Category Badge */}
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        {photo.category}
                    </span>

                    {/* Fixed Rating Badge */}
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-gray-800 shadow-xs">
                        ★ {fixedRating.toFixed(1)}
                    </span>

                    {/* Zoom icon hint on hover */}
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur-xs px-2 py-1 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        🔍 Zoom
                    </span>
                </div>

                {/* Photo Details */}
                <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                            {photo.title}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            {photo.category} · Fine Art Photography
                        </p>

                        {/* Interactive User Rating (Requires Login) */}
                        <div className="mt-3">
                            <StarRating
                                userRating={userRating}
                                onRate={handleRate}
                            />
                        </div>
                    </div>

                    {/* Interactive Action Buttons: Save (Heart + Text) and Add to Cart */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                        {/* Heart Save Button: kept intact with emoji and save text */}
                        <button
                            type="button"
                            onClick={handleSaveClick}
                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-3 text-xs font-semibold transition-all duration-200 border cursor-pointer active:scale-95 ${
                                isSaved
                                    ? "border-red-300 bg-red-50 text-red-600 shadow-xs"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:text-red-600"
                            }`}
                            title={isSaved ? "Saved to your favorites" : "Save photograph"}
                        >
                            <span className={`text-sm transition-transform duration-200 ${isSaved ? "scale-110" : ""}`}>
                                {isSaved ? "❤️" : "🤍"}
                            </span>
                            <span className={isSaved ? "font-bold text-red-600" : ""}>
                                {isSaved ? "Saved" : "Save"}
                            </span>
                        </button>

                        {/* Add to Cart Button */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-3 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                                addedAlert
                                    ? "bg-emerald-600 text-white"
                                    : "bg-orange-600 text-white hover:bg-orange-700"
                            }`}
                            title="Add to cart"
                        >
                            <span>{addedAlert ? "✓" : "🛒"}</span>
                            <span>{addedAlert ? "Added!" : "Add to Cart"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Photo Zoom Modal */}
            {isZoomOpen && (
                <PhotoZoomModal
                    photo={photo}
                    onClose={() => setIsZoomOpen(false)}
                />
            )}
        </>
    );
}

export default PhotoCard;
