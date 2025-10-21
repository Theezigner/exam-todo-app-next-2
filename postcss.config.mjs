// postcss.config.mjs (or .js)

const config = {
  plugins: [
    // Use the explicit PostCSS plugin package name
    "@tailwindcss/postcss",
    // Include Autoprefixer for browser compatibility
    "autoprefixer",
  ],
};

export default config;
