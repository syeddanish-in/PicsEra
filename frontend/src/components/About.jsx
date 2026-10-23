import React from 'react';

export default function About() {
    return (
        <section id="about" className="bg-orange-50 py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-8 rounded-2xl bg-white p-5 shadow-sm sm:gap-12 sm:p-8 lg:grid-cols-2 lg:gap-16 lg:p-12">

                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden rounded-xl shadow-md sm:aspect-[16/10] lg:aspect-square">
                        <img
                            src="/images/collections/vitaly-gariev-VnhCfo8Fkes-unsplash.jpg"
                            alt="Photography studio showcase"
                            loading="lazy"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="max-w-xl">
                        <p className="mb-2 text-xs text-orange-600 font-bold uppercase tracking-widest text-ember sm:text-sm">
                            About PicsEra
                        </p>

                        <h2 className="mb-4 font-heading text-2xl font-normal leading-tight text-ink sm:mb-6 sm:text-4xl lg:text-5xl">
                            Stories told through photography.
                        </h2>

                        <p className="mb-6 text-sm leading-relaxed text-ink-soft sm:mb-8 sm:text-base">
                            PicsEra is a photography portfolio dedicated to capturing emotions, people,
                            places, and the beauty of everyday moments. Each photograph is created to
                            preserve a story and turn memorable moments into lasting visual experiences.
                        </p>

                        <a
                            href="#contact"
                            className="group inline-flex items-center border-b-2 border-orange-600 pb-1 text-sm font-bold text-orange-600 transition-colors hover:border-clay hover:text-clay sm:text-base"
                        >
                            Let's Create Together
                            <span className="ml-1 transition-transform group-hover:translate-x-1">
                                &rarr;
                            </span>
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}