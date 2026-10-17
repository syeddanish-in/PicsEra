
import StarRating from "./StarRating.jsx";

function PhotoCard({
    photo,
    quantity,
    onQuantityChange,
    fixedRating,
    userRating,
    onRate,
}) {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

            {/* Photo */}
            <div className="group relative h-64 overflow-hidden bg-gray-200">
                <img
                    src={photo.image}
                    alt={photo.alt || photo.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Category */}
                <span className="absolute left-3 top-3 rounded bg-black/70 px-3 py-1 text-xs font-bold uppercase text-white">
                    {photo.category}
                </span>

                {/* Fixed Rating */}
                <span className="absolute right-3 top-3 rounded bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
                    ★ {fixedRating.toFixed(1)}
                </span>
            </div>

            {/* Photo Details */}
            <div className="p-4">
                <h3 className="text-lg font-semibold">
                    {photo.title}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                    {photo.category} · Archival Print Available
                </p>

                {/* Interactive User Rating */}
                <StarRating
                    userRating={userRating}
                    onRate={onRate}
                />

                {/* Print Quantity */}
                <div className="mt-4 flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm font-semibold">
                        Prints:
                    </span>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                onQuantityChange(Math.max(0, quantity - 1))
                            }
                            className="font-bold text-gray-500 hover:text-orange-600"
                            aria-label="Decrease print quantity"
                        >
                            −
                        </button>

                        <span className="font-semibold">
                            {quantity}
                        </span>

                        <button
                            type="button"
                            onClick={() => onQuantityChange(quantity + 1)}
                            className="font-bold text-gray-500 hover:text-orange-600"
                            aria-label="Increase print quantity"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PhotoCard;
