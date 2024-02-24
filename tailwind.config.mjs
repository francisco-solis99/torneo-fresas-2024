/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			screens: {
        'xs': '448px',
      },
			fontFamily: {
				archivo: ["Archivo Variable", "sans-serif"]
			}
		},
	},
	plugins: [],
}
