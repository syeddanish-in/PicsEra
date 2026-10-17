
import React, { useState } from 'react';

export default function Contact({
    totalPrintsSelected = 0,
    selectedPrintsSummary = [],
}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'portrait',
        budget: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const inputStyle =
        'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100';

    return (
        <section id="contact" className="bg-surface px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
                        Let's work together
                    </p>
                    <h2 className="font-heading text-3xl text-ink sm:text-4xl">
                        Book a Shoot
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-ink-soft">
                        Tell us about your project. We'll get back to you
                        within 24 hours.
                    </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5 shadow-md sm:p-8">
                    {totalPrintsSelected > 0 && (
                        <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
                            <p className="font-semibold text-orange-800">
                                ✦ {totalPrintsSelected} print(s) selected
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                {selectedPrintsSummary
                                    .map((item) => `${item.title} (${item.count}x)`)
                                    .join(', ')}
                            </p>
                        </div>
                    )}

                    {submitted ? (
                        <div className="py-8 text-center" role="status">
                            <div className="text-4xl text-green-600">✓</div>
                            <h3 className="mt-3 text-xl font-semibold text-gray-900">
                                Thank you, {formData.name}!
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Your inquiry is ready. We will contact you at{' '}
                                {formData.email}.
                            </p>
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="mt-5 rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
                            >
                                Send Another Inquiry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-800">
                                        Full Name *
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        autoComplete="name"
                                        required
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-800">
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                        className={inputStyle}
                                    />
                                </div>
                            </div>

                            <fieldset>
                                <legend className="mb-3 text-sm font-semibold text-gray-800">
                                    Photography Type
                                </legend>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        ['portrait', '👤', 'Portrait'],
                                        ['product', '📷', 'Product'],
                                        ['event', '✨', 'Event'],
                                    ].map(([value, icon, label]) => (
                                        <label
                                            key={value}
                                            className={`cursor-pointer rounded-lg border p-3 text-center transition ${formData.type === value
                                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                    : 'border-gray-200 hover:border-orange-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={value}
                                                checked={formData.type === value}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className="block text-xl">{icon}</span>
                                            <span className="mt-1 block text-sm font-medium">
                                                {label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <div>
                                <label htmlFor="budget" className="mb-2 block text-sm font-semibold text-gray-800">
                                    Budget *
                                </label>
                                <select
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                    className={inputStyle}
                                >
                                    <option value="" disabled>Select your budget</option>
                                    <option value="under-100">Below $100</option>
                                    <option value="100-500">$100–$500</option>
                                    <option value="500-1000">$500–$1,000</option>
                                    <option value="over-1000">Above $1,000</option>
                                </select>
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between">
                                    <label htmlFor="message" className="text-sm font-semibold text-gray-800">
                                        Project Details
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        {formData.message.length}/500
                                    </span>
                                </div>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    maxLength={500}
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your project..."
                                    className={inputStyle}
                                />
                            </div>

                            <button
                                type="submit"
                                className="block w-full cursor-pointer rounded-lg bg-orange-600 px-5 py-4 text-center text-base font-bold text-white shadow-md transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 active:scale-[0.99]"
                            >
                                Send Inquiry →
                            </button>

                            <p className="text-center text-xs text-gray-500">
                                We aim to respond to your inquiry within 24 hours.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
