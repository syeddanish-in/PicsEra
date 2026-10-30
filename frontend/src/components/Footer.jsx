import { useState } from "react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (newsletterEmail.trim() && newsletterEmail.includes("@")) {
            setNewsletterSubscribed(true);
            setNewsletterEmail("");
            setTimeout(() => setNewsletterSubscribed(false), 4000);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="border-t border-gray-200 bg-linear-to-b from-white to-gray-50 text-gray-700">
            {/* Top Interactive Banner: Back to Top & Quick CTA */}
            <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="font-medium">PostgreSQL (Neon) & Express API Connected</span>
                    </div>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="group flex items-center gap-1.5 font-semibold text-gray-600 transition hover:text-orange-600 cursor-pointer"
                        title="Scroll to top of page"
                    >
                        <span>Back to top</span>
                        <span className="transition-transform duration-200 group-hover:-translate-y-0.5">↑</span>
                    </button>
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Column (2 cols wide on desktop) */}
                    <div className="lg:col-span-2 space-y-4">
                        <a href="#home" className="inline-block text-2xl font-bold tracking-tight text-gray-900">
                            Pics<span className="text-orange-600">Era</span>
                        </a>

                        <p className="text-sm leading-6 text-gray-600 max-w-sm">
                            Every moment. Every story. Covered. PicsEra is a curated photography portfolio offering archival museum-grade fine art prints and bespoke studio shoots.
                        </p>

                        {/* Interactive Social Media Icons */}
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="PicsEra on Instagram"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-2xs transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 hover:scale-105"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>

                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="PicsEra on X Twitter"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-2xs transition hover:border-gray-400 hover:bg-gray-100 hover:text-black hover:scale-105"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            <a
                                href="https://github.com/syeddanish-in/PicsEra"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="PicsEra on GitHub"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-2xs transition hover:border-gray-400 hover:bg-gray-100 hover:text-black hover:scale-105"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </a>

                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="PicsEra on LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-2xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:scale-105"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Navigation Column */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                            Explore
                        </h4>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li>
                                <a href="#home" className="text-gray-600 transition hover:text-orange-600">Home</a>
                            </li>
                            <li>
                                <a href="#portfolio" className="text-gray-600 transition hover:text-orange-600">Curated Portfolio</a>
                            </li>
                            <li>
                                <a href="#about" className="text-gray-600 transition hover:text-orange-600">About the Artist</a>
                            </li>
                            <li>
                                <a href="#contact" className="text-gray-600 transition hover:text-orange-600">Book a Shoot</a>
                            </li>
                        </ul>
                    </div>

                    {/* Categories Column */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                            Collections
                        </h4>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            <li>
                                <a href="#portfolio" className="text-gray-600 transition hover:text-orange-600">Nature & Wildlife</a>
                            </li>
                            <li>
                                <a href="#portfolio" className="text-gray-600 transition hover:text-orange-600">Architecture</a>
                            </li>
                            <li>
                                <a href="#portfolio" className="text-gray-600 transition hover:text-orange-600">Portrait</a>
                            </li>
                            <li>
                                <a href="#portfolio" className="text-gray-600 transition hover:text-orange-600">Product Studio</a>
                            </li>
                        </ul>
                    </div>

                    {/* Interactive Newsletter Column */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                            Stay Inspired
                        </h4>
                        <p className="mt-4 text-xs text-gray-600 leading-relaxed">
                            Subscribe to receive early notifications on new archival print drops and photo exhibitions.
                        </p>

                        <form onSubmit={handleSubscribe} className="mt-3.5 space-y-2">
                            <input
                                type="email"
                                required
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-orange-700 active:scale-98 cursor-pointer"
                            >
                                Subscribe
                            </button>
                        </form>

                        {newsletterSubscribed && (
                            <p className="mt-2 text-xs font-medium text-emerald-600 animate-fade-in">
                                ✓ Thank you for subscribing!
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Legal & Tech Bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row text-xs text-gray-500">
                    <p>
                        &copy; {currentYear} Pics<span className="font-bold text-orange-600">Era</span>. All rights reserved. Archival prints certified museum-grade.
                    </p>

                    <div className="flex items-center gap-6">
                        <span className="text-gray-400">Built with React 19, Tailwind CSS & Neon Postgres</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
