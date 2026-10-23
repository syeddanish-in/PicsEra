import { useState, useEffect } from "react";
import { PHOTOS as FALLBACK_PHOTOS, CATEGORIES } from "../data/photo.js";
import { api } from "../api.js";
import { useAuth } from "../context/useAuth.js";
import PhotoCard from "./PhotoCard.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";

function MainContent() {
    const { currentUser } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [photos, setPhotos] = useState(FALLBACK_PHOTOS);
    const [isLoading, setIsLoading] = useState(false);

    // Ratings are isolated per authenticated user and reset immediately on sign out
    const [userRatings, setUserRatings] = useState(() => {
        if (!currentUser?.email) return {};
        try {
            const key = `picsera_ratings_${currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    const handleRatePhoto = (photoId, rating) => {
        setUserRatings((prev) => {
            const next = { ...prev, [photoId]: rating };
            if (currentUser?.email) {
                try {
                    const key = `picsera_ratings_${currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
                    localStorage.setItem(key, JSON.stringify(next));
                } catch {
                    // Ignored
                }
            }
            return next;
        });
    };

    // Fetch photos from real backend API on mount or category change
    useEffect(() => {
        let isMounted = true;
        const fetchPhotos = async () => {
            setIsLoading(true);
            try {
                const data = await api.getPhotos(selectedCategory);
                if (isMounted && data.photos && data.photos.length > 0) {
                    setPhotos(data.photos);
                } else if (isMounted) {
                    const filtered =
                        selectedCategory === "All"
                            ? FALLBACK_PHOTOS
                            : FALLBACK_PHOTOS.filter((p) => p.category === selectedCategory);
                    setPhotos(filtered);
                }
            } catch (err) {
                console.warn("Backend API unavailable, using local photos dataset:", err.message);
                if (isMounted) {
                    const filtered =
                        selectedCategory === "All"
                            ? FALLBACK_PHOTOS
                            : FALLBACK_PHOTOS.filter((p) => p.category === selectedCategory);
                    setPhotos(filtered);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchPhotos();
        return () => {
            isMounted = false;
        };
    }, [selectedCategory]);

    function getFixedRating(index) {
        return 4.1 + (index % 9) / 10;
    }

    return (
        <main>
            <section id="portfolio" className="mx-auto max-w-7xl px-4 py-12">
                <div className="mb-8 text-center">
                    <p className="mb-2 font-bold uppercase tracking-widest text-orange-600">
                        Curated Portfolio
                    </p>
                    <h2 className="text-3xl font-bold md:text-4xl">
                        Featured Photographs
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Explore our collection of photography, powered by our live PostgreSQL database.
                    </p>
                </div>

                {/* Category filters */}
                <div className="mb-8 flex flex-wrap justify-center gap-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full px-4 py-2 cursor-pointer transition ${
                                selectedCategory === category
                                    ? "bg-orange-600 text-white font-semibold shadow-xs"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Photo grid */}
                {isLoading ? (
                    <div className="py-20 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
                        <p className="mt-3 text-sm text-gray-500">Loading photographs from database...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {photos.map((photo, index) => (
                            <PhotoCard
                                key={photo.id}
                                photo={photo}
                                fixedRating={getFixedRating(index)}
                                userRating={userRatings[photo.id] || 0}
                                onRate={(rating) => handleRatePhoto(photo.id, rating)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <About />

            <Contact />
        </main>
    );
}

export default MainContent;
