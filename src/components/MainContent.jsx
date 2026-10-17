import { useState } from "react";
import { PHOTOS, CATEGORIES } from "../data/photo.js";
import PhotoCard from "./PhotoCard.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";

function MainContent() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [quantities, setQuantities] = useState({});
    const [userRatings, setUserRatings] = useState({});

    const filteredPhotos =
        selectedCategory === "All"
            ? PHOTOS
            : PHOTOS.filter((photo) => photo.category === selectedCategory);

    function handleQuantityChange(id, newQty) {
        setQuantities((previous) => ({
            ...previous,
            [id]: newQty,
        }));
    }

    const totalPrints = Object.values(quantities).reduce(
        (total, quantity) => total + quantity,
        0
    );

    const selectedPrintsSummary = PHOTOS
        .filter((photo) => (quantities[photo.id] || 0) > 0)
        .map((photo) => ({
            id: photo.id,
            title: photo.title,
            count: quantities[photo.id],
        }));

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
                        Explore our collection of photography.
                    </p>
                </div>

                <div className="mb-8 flex flex-wrap justify-center gap-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full px-4 py-2 ${selectedCategory === category
                                ? "bg-orange-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Selected Prints */}
                {totalPrints > 0 && (
                    <div
                        className="mb-6 flex flex-col gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                        aria-live="polite"
                    >
                        <p className="text-sm font-medium text-gray-800 sm:text-base">
                            <span className="font-bold text-orange-600">
                                {totalPrints}
                            </span>{" "}
                            print{totalPrints !== 1 ? "s" : ""} selected
                        </p>

                        <button
                            type="button"
                            onClick={() => setQuantities({})}
                            className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-orange-700 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:w-auto"
                        >
                            Clear Selection
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredPhotos.map((photo) => {
                        const index = PHOTOS.findIndex(
                            (item) => item.id === photo.id
                        );

                        return (
                            <PhotoCard
                                key={photo.id}
                                photo={photo}
                                quantity={quantities[photo.id] || 0}
                                onQuantityChange={(newQty) =>
                                    handleQuantityChange(photo.id, newQty)
                                }
                                fixedRating={getFixedRating(index)}
                                userRating={userRatings[photo.id] || 0}
                                onRate={(rating) =>
                                    setUserRatings((previous) => ({
                                        ...previous,
                                        [photo.id]: rating,
                                    }))
                                }
                            />
                        );
                    })}
                </div>
            </section>

            <About />

            <Contact
                totalPrintsSelected={totalPrints}
                selectedPrintsSummary={selectedPrintsSummary}
            />
        </main>
    );
}

export default MainContent;