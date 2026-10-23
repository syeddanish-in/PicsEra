import React from 'react'

const links = [
    { name: "About", href: "#about" },
    { name: "Gallery", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
];

function Footer() {
    return (
        <footer className="bg-stone-900 text-white border-t border-stone-700">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-stone-300 text-center md:text-left">
                        Capturing emotions and timeless visual stories.
                    </p>

                    <nav className="flex flex-wrap justify-center gap-5 text-sm" aria-label="Footer navigation">
                        {links.map(({ name, href }) => (
                            <a key={name} href={href} className="text-stone-300 hover:text-orange-500 transition-colors">
                                {name}
                            </a>
                        ))}
                        <a href="#home" className="text-stone-300 hover:text-orange-500 transition-colors">
                            Back to Top ↑
                        </a>
                    </nav>
                </div>

                <div className="border-t border-stone-700 mt-8 pt-6 text-center">
                    <p className="text-xs text-stone-400">
                        © 2026 PicsEra. All rights reserved.
                    </p>

                    <p className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mt-8">
                        Pics<span className="text-orange-600">Era</span>
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-400 mt-2">
                        Every moment. Every story.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer
