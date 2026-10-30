function StarRating({ userRating, onRate }) {
    return (
        <div className="mt-2.5 flex flex-row items-center justify-between gap-2 flex-nowrap">
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap shrink-0">
                Rate this photo
            </span>

            <div className="flex flex-row items-center gap-0.5 flex-nowrap shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRate(star)}
                        className={`inline-flex items-center justify-center text-lg leading-none transition-transform hover:scale-110 active:scale-95 cursor-pointer p-0.5 ${
                            star <= userRating
                                ? "text-yellow-400"
                                : "text-gray-300 hover:text-yellow-300"
                        }`}
                        aria-label={`Rate ${star} out of 5`}
                        aria-pressed={userRating === star}
                    >
                        ★
                    </button>
                ))}

                {userRating > 0 && (
                    <span className="ml-1 text-xs font-semibold text-gray-600 whitespace-nowrap">
                        {userRating}/5
                    </span>
                )}
            </div>
        </div>
    );
}

export default StarRating;
