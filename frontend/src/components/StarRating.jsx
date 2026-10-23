function StarRating({ userRating, onRate }) {
    return (
        <div className="mt-3">
            <p className="mb-1 text-sm text-gray-600">
                Rate this photo
            </p>

            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRate(star)}
                        className={`text-2xl transition-colors ${star <= userRating
                            ? "text-yellow-500"
                            : "text-gray-300 hover:text-yellow-400"
                            }`}
                        aria-label={`Rate ${star} out of 5`}
                        aria-pressed={userRating === star}
                    >
                        ★
                    </button>
                ))}

                {userRating > 0 && (
                    <span className="ml-2 text-sm text-gray-600">
                        {userRating}/5
                    </span>
                )}
            </div>
        </div>
    );
}

export default StarRating;