import { useState } from "react";
import { PHOTOS, CATEGORIES } from "../data/photo.js";
import PhotoCard from "./PhotoCard.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";

function MainContent() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [userRatings, setUserRatings] = useState({});

    const filteredPhotos =
        selectedCategory === "All"
            ? PHOTOS
            : PHOTOS.filter((photo) => photo.category === selectedCategory);

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

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredPhotos.map((photo) => {
                        const index = PHOTOS.findIndex(
                            (item) => item.id === photo.id
                        );

                        return (
                            <PhotoCard
                                key={photo.id}
                                photo={photo}
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

            <Contact />
        </main>
    );
}

export default MainContent;
