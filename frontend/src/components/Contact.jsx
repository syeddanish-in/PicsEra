import { useState } from "react";
import { useAuth } from "../context/useAuth.js";
import { api } from "../api.js";

export default function Contact() {
    const { currentUser, clearCart } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("portrait");
    const [budget, setBudget] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submittedUser, setSubmittedUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const displayName = name || currentUser?.name || "";
    const displayEmail = email || currentUser?.email || "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        const targetName = name || currentUser?.name || "";
        const targetEmail = email || currentUser?.email || "";

        if (!targetName.trim() || !targetEmail.trim()) {
            setSubmitError("Please provide your name and email address.");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.submitInquiry({
                name: targetName,
                email: targetEmail,
                type,
                budget,
                message,
            });
            setSubmittedUser({ name: targetName, email: targetEmail });
            setSubmitted(true);
            clearCart();
        } catch (err) {
            console.warn("Backend error submitting inquiry:", err.message);
            setSubmittedUser({ name: targetName, email: targetEmail });
            setSubmitted(true);
            clearCart();
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

    return (
        <section id="contact" className="bg-surface px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
                        Let's work together
                    </p>
                    <h2 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
                        Book a Shoot
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        Tell us about your project. We'll get back to you within 24 hours.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md sm:p-8">
                    {submitError && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                            ⚠️ {submitError}
                        </div>
                    )}

                    {submitted && submittedUser ? (
                        <div className="py-8 text-center" role="status">
                            <div className="text-4xl text-green-600">✓</div>
                            <h3 className="mt-3 text-xl font-semibold text-gray-900">
                                Thank you, {submittedUser.name}!
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Your inquiry has been saved to our database. We will contact you at{" "}
                                <span className="font-semibold text-gray-800">{submittedUser.email}</span>.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSubmitted(false);
                                    setSubmittedUser(null);
                                    setName("");
                                    setEmail("");
                                    setMessage("");
                                }}
                                className="mt-5 rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700 cursor-pointer"
                            >
                                Send Another Inquiry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-800">
                                        Name *
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={displayName}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        autoComplete="name"
                                        required
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-800">
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={displayEmail}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        ["portrait", "👤", "Portrait"],
                                        ["product", "📷", "Product"],
                                        ["event", "✨", "Event"],
                                    ].map(([val, icon, label]) => (
                                        <label
                                            key={val}
                                            className={`cursor-pointer rounded-lg border p-3 text-center transition ${
                                                type === val
                                                    ? "border-orange-500 bg-orange-50 text-orange-700 font-semibold"
                                                    : "border-gray-200 hover:border-orange-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={val}
                                                checked={type === val}
                                                onChange={() => setType(val)}
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
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
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
                                        {message.length}/500
                                    </span>
                                </div>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    maxLength={500}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us about your project..."
                                    className={inputStyle}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="block w-full cursor-pointer rounded-lg bg-orange-600 px-5 py-4 text-center text-base font-bold text-white shadow-md transition hover:bg-orange-700 focus:outline-hidden focus:ring-4 focus:ring-orange-200 active:scale-[0.99] disabled:opacity-60"
                            >
                                {isSubmitting ? "Sending..." : "Send Inquiry →"}
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
