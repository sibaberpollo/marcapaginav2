import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        marcapagina: {
          primary: "#faff00",
          "primary-content": "#000000",
          secondary: "#4b4b4b",
          "secondary-content": "#ffffff",
          accent: "#ffffff",
          neutral: "#000000",
          "base-100": "#f5f5f5",
          "base-200": "#e8e8e8",
          "base-300": "#d4d4d4",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
};
