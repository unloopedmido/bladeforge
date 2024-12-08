import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { bronze, bronzeDark, sand } from "@radix-ui/colors";

export default {
	content: ["./src/**/*.tsx"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)", ...fontFamily.sans],
			},
			colors: {
				...bronze,
				...sand,
				bronzeDark,
			},
		},
	},
	plugins: [],
} satisfies Config;
