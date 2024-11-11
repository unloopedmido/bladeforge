import { amber, bronze } from "@radix-ui/colors";

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ...bronze,
        ...amber,
      },
    },
  },
  plugins: [],
};
