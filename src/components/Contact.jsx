import React, { useState } from 'react';

export default function Contact({ totalPrintsSelected = 0, selectedPrintsSummary = [] }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'portrait',
        budget: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-surface">
            <div className="max-w-xl mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-xl shadow-sm border border-line p-6 sm:p-8 md:p-10">
                    <h2 className="font-heading text-2xl sm:text-3xl text-center text-ink font-normal mb-2">
                        Book a Shoot
                    </h2>
                    <p className="text-center text-xs sm:text-sm text-ink-soft mb-6 sm:mb-8">
                        Tell us about your project or print inquiry and we will get back to you within 24 hours.
                    </p>

                    {/* Dynamic badge if user has selected prints using the QuantityStepper */}
                    {totalPrintsSelected > 0 && (
                        <div className="mb-6 p-3.5 bg-orange-50 border border-orange-200 rounded-lg text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
                            <span className="text-ember text-base">✦</span>
                            <div>
                                <p className="font-semibold text-ember">
                                    {totalPrintsSelected} Archival Print{totalPrintsSelected > 1 ? 's' : ''} Selected
                                </p>
                                <p className="text-xs text-stone-600 mt-0.5">
                                    Your selected prints will be attached to your booking inquiry:
                                    {selectedPrintsSummary.map((item) => ` ${item.title} (${item.count}x)`).join(',')}
                                </p>
                            </div>
                        </div>
                    )}

                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                                ✓
                            </div>
                            <h3 className="text-lg font-bold text-ink">Thank you, {formData.name || 'there'}!</h3>
                            <p className="text-sm text-ink-soft mt-1">
                                Your shoot inquiry has been received. We will be in touch shortly via {formData.email}.
                            </p>
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="mt-6 px-4 py-2 text-xs font-semibold text-ember hover:text-clay underline"
                            >
                                Send another inquiry
                            </button>
                        </div>
                    ) : (
                        <form id="booking-form" onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="name" className="text-sm font-semibold text-ink">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-md border border-line bg-white text-ink text-sm placeholder:text-stone-400 focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember transition-colors"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-sm font-semibold text-ink">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-md border border-line bg-white text-ink text-sm placeholder:text-stone-400 focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember transition-colors"
                                />
                            </div>

                            {/* Photography Type */}
                            <div className="flex flex-col gap-2 pt-1">
                                <label className="text-sm font-semibold text-ink">
                                    Photography Type
                                </label>
                                <div className="flex flex-wrap gap-4 sm:gap-6 pt-0.5">
                                    <label className="inline-flex items-center gap-2 text-sm text-ink cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="portrait"
                                            checked={formData.type === 'portrait'}
                                            onChange={handleChange}
                                            className="accent-ember w-4 h-4"
                                        />
                                        <span>Portrait</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm text-ink cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="product"
                                            checked={formData.type === 'product'}
                                            onChange={handleChange}
                                            className="accent-ember w-4 h-4"
                                        />
                                        <span>Product</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm text-ink cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="event"
                                            checked={formData.type === 'event'}
                                            onChange={handleChange}
                                            className="accent-ember w-4 h-4"
                                        />
                                        <span>Event</span>
                                    </label>
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="budget" className="text-sm font-semibold text-ink">
                                    Budget
                                </label>
                                <select
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-md border border-line bg-white text-ink text-sm focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember transition-colors"
                                >
                                    <option value="" disabled>
                                        Select your budget range
                                    </option>
                                    <option value="under-100">Below $100</option>
                                    <option value="100-500">$100 - $500</option>
                                    <option value="500-1000">$500 - $1,000</option>
                                    <option value="over-1000">Above $1,000</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="message" className="text-sm font-semibold text-ink">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="3"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us more about your service needs..."
                                    className="w-full px-3.5 py-2.5 rounded-md border border-line bg-white text-ink text-sm placeholder:text-stone-400 focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember transition-colors resize-y"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full mt-4 py-3 px-4 rounded-md bg-ember text-white font-semibold text-sm sm:text-base hover:bg-clay active:scale-[0.99] transition-all shadow-sm"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}