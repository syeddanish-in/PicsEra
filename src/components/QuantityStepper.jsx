import React from 'react';

/**
 * Controlled QuantityStepper component
 *
 * Controlled Component Pattern:
 * 1. Receives its current value from props (`value`).
 * 2. Emits changes upward via the `onChange` callback with the new value.
 * 3. Does NOT keep local state; the parent owns and synchronizes the single source of truth.
 */
export default function QuantityStepper({
    value = 0,
    onChange,
    min = 0,
    max = 10,
    label = 'Prints',
}) {
    const handleDecrement = (e) => {
        e.stopPropagation();
        if (value > min && onChange) {
            onChange(value - 1);
        }
    };

    const handleIncrement = (e) => {
        e.stopPropagation();
        if (value < max && onChange) {
            onChange(value + 1);
        }
    };

    return (
        <div className="flex items-center justify-between gap-2 bg-white/90 backdrop-blur-sm rounded-md px-2.5 py-1.5 shadow-sm border border-stone-200">
            <span className="text-xs font-medium text-ink-soft select-none">
                {label}:
            </span>
            <div className="inline-flex items-center rounded border border-line bg-surface">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    aria-label={`Decrease ${label.toLowerCase()} quantity`}
                    className="w-7 h-7 flex items-center justify-center text-sm font-bold text-ink hover:bg-white hover:text-ember active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all rounded-l"
                >
                    -
                </button>
                <span
                    className={`min-w-[1.75rem] text-center text-xs font-semibold tabular-nums ${value > 0 ? 'text-ember font-bold' : 'text-ink-soft'
                        }`}
                    aria-live="polite"
                >
                    {value}
                </span>
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={value >= max}
                    aria-label={`Increase ${label.toLowerCase()} quantity`}
                    className="w-7 h-7 flex items-center justify-center text-sm font-bold text-ink hover:bg-white hover:text-ember active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all rounded-r"
                >
                    +
                </button>
            </div>
        </div>
    );
}
