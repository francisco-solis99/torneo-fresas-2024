/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			screens: {
        'xs': '448px',
      },
			fontFamily: {
				archivo: ["Archivo Variable", "sans-serif"],
				audioWide: ["Audiowide", "system-ui"]
			},
			colors: {
				'primary': 'var(--color-primary)',
				'secondary': 'var(--color-secondary)',
				'accent': 'var(--color-accent)',
				'background': 'var(--color-background)',
				'content': 'var(--color-content)'
			},
			dropShadow: {
        'custom': '0 5px 25px var(--color-content)',
      }
		},
	},
	plugins: [],
}
