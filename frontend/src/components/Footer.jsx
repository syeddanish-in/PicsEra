export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-gray-500">
                        &copy; {currentYear} Pics<span className="text-orange-600 font-bold">Era</span>. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#home" className="hover:text-orange-600">Home</a>
                        <a href="#portfolio" className="hover:text-orange-600">Portfolio</a>
                        <a href="#about" className="hover:text-orange-600">About</a>
                        <a href="#contact" className="hover:text-orange-600">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
