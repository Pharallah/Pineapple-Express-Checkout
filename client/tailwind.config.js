/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      transitionDuration: {
        '1500': '1500ms', // Add a custom duration of 1.5 seconds
      },
      width: {
        '18': '4.5rem',
        '22': '5.5rem',
        '42': '10.5rem',
      },
      translate: {
        '18': '4.5rem',
        '22': '5.5rem',
        '42': '10.5rem',
      },
      spacing: {
        '3.1': '0.775rem',   // ~12.4px
        '3.2': '0.8rem',     // ~12.8px
        '3.25': '0.8125rem', // ~13px
        '3.3': '0.825rem',   // ~13.2px
        '3.4': '0.85rem',    // ~13.6px
        '3.5': '0.875rem',   // 14px
        '3.6': '0.9rem',     // ~14.4px
        '3.7': '0.925rem',   // ~14.8px
        '3.75': '0.9375rem', // ~15px
        '3.8': '0.95rem',    // ~15.2px
        '3.9': '0.975rem',   // ~15.6px
        '3.95': '0.9875rem', // ~15.8px
        '4.1': '1.025rem',   // ~16.4px
        '4.2': '1.05rem',    // ~16.8px
        '4.25': '1.0625rem', // ~17px
        '4.3': '1.075rem',   // ~17.2px
        '4.4': '1.1rem',     // ~17.6px
        '4.5': '1.125rem',   // 18px
        '4.6': '1.15rem',    // ~18.4px
        '4.7': '1.175rem',   // ~18.8px
        '4.75': '1.1875rem', // ~19px
        '4.8': '1.2rem',     // ~19.2px
        '4.9': '1.225rem',   // ~19.6px
        ...Array.from({ length: (64 - 50) * 2 + 1 }, (_, i) => 50 + i * 0.5).reduce(
          (acc, value) => {
            acc[value] = `${value / 4}rem`; // Tailwind's spacing values are in multiples of 0.25rem
            return acc;
          },
          {}
        ),
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

