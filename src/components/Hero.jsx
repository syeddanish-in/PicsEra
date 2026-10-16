import React from 'react'

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex h-112.5 items-center"
    >
      <img
        src="./images/mesut-kaya-eOcyhe5-9sQ-unsplash.jpg"
        alt="Photography portfolio"
        className="absolute h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative px-6 text-white">
        <p className="mb-3 font-bold tracking-widest text-orange-400">
          PICSERA PHOTOGRAPHY
        </p>

        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          Every moment.
          <br />
          Every guest.{" "}
          <span className="text-orange-400">Covered.</span>
        </h1>

        <p className="mb-6 text-lg">
          Capture the moment, preserve the memory.
        </p>

        <a
          href="#contact"
          className="rounded bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-500"
        >
          Book a Shoot
        </a>
      </div>
    </section>
  );
}

export default Hero;
