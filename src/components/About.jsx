import React from 'react';

export default function About() {
    return (
        <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white border-y border-line">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-lg shadow-md aspect-4/3 sm:aspect-16/10 lg:aspect-square">
                        <img
                            src="/images/collections/vitaly-gariev-VnhCfo8Fkes-unsplash.jpg"
                            alt="Photography studio showcase"
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="max-w-xl">
                        <p className="text-xs sm:text-sm font-bold tracking-[0.15em] text-ember uppercase mb-2">
                            About PicsEra
                        </p>
                        <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-normal text-ink leading-tight mb-4 sm:mb-6">
                            Stories told through photography.
                        </h2>
                        <p className="text-sm sm:text-base text-ink-soft leading-relaxed mb-6 sm:mb-8">
                            PicsEra is a photography portfolio dedicated to capturing emotions, people,
                            places, and the beauty of everyday moments. Each photograph is created to
                            preserve a story and turn memorable moments into lasting visual experiences.
                        </p>
                        <div>
                            <a
                                href="#contact"
                                className="inline-flex items-center text-sm sm:text-base font-bold text-ember border-b-2 border-ember pb-0.5 hover:text-clay hover:border-clay transition-colors group"
                            >
                                Let&apos;s Create Together{' '}
                                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                                    &rarr;
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}