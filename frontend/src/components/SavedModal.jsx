import { useAuth } from "../context/useAuth.js";

function SavedModal() {
  const {
    isSavedModalOpen,
    closeSavedModal,
    savedPhotosList,
    toggleSavePhoto,
    addToCart,
    currentUser,
  } = useAuth();

  if (!isSavedModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300"
      onClick={closeSavedModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Your Saved Collection
              </h2>
              <p className="text-xs text-gray-500">
                {currentUser ? `Saved exclusively for ${currentUser.name}` : "Your favorites"}
              </p>
            </div>
          </div>
          <button
            onClick={closeSavedModal}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
            aria-label="Close saved modal"
          >
            ✕
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6">
          {savedPhotosList.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-5xl">🤍</span>
              <h3 className="mt-4 text-base font-semibold text-gray-700">
                No saved photos yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Click the <span className="font-semibold text-gray-700">"🤍 Save"</span> button on any photograph to save it here for future reference.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {savedPhotosList.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition hover:shadow-md"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSavePhoto(photo.id)}
                      className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-red-600 shadow-sm backdrop-blur-xs hover:bg-white cursor-pointer"
                      title="Remove from saved"
                    >
                      <span>❤️</span> Saved
                    </button>
                    <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      {photo.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-3">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {photo.title}
                    </h4>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addToCart(photo, 1)}
                        className="flex-1 rounded-lg bg-orange-600 py-1.5 px-2 text-xs font-semibold text-white shadow-xs transition hover:bg-orange-700 text-center cursor-pointer"
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3 text-xs text-gray-500">
          <span>{savedPhotosList.length} photograph{savedPhotosList.length !== 1 ? "s" : ""} saved</span>
          <button
            type="button"
            onClick={closeSavedModal}
            className="rounded-lg bg-gray-200 px-4 py-1.5 font-semibold text-gray-700 hover:bg-gray-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SavedModal;
