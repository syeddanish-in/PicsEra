export default function About() {
    return (
        <section id="about" className="bg-orange-50 py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                        About the Artist
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Capturing Life Through the Lens
                    </h2>
                </div>

                <div className="mt-8 text-center text-base leading-7 text-gray-600 sm:mt-10 sm:text-lg sm:leading-8">
                    <p>
                        Welcome to PicsEra. With over a decade behind the camera, I specialize in
                        portrait, architectural, landscape, and fine-art photography. Every image in
                        this gallery is available as a signed, archival-quality print crafted with
                        museum-grade paper and pigment inks designed to last generations.
                    </p>
                    <p className="mt-4">
                        Whether you are looking to acquire fine art prints for your home or office,
                        or wish to commission a bespoke photography shoot, I would love to hear from
                        you. Explore the portfolio above and select your favorite pieces.
                    </p>
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-8 text-center sm:gap-12">
                    <div>
                        <span className="block text-3xl font-extrabold text-orange-600">10+</span>
                        <span className="mt-1 text-sm text-gray-500">Years Experience</span>
                    </div>
                    <div>
                        <span className="block text-3xl font-extrabold text-orange-600">500+</span>
                        <span className="mt-1 text-sm text-gray-500">Shoots Completed</span>
                    </div>
                    <div>
                        <span className="block text-3xl font-extrabold text-orange-600">100%</span>
                        <span className="mt-1 text-sm text-gray-500">Archival Quality</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
