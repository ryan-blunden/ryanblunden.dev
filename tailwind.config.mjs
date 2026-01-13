import colors from 'tailwindcss/colors';
import flowbite from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/flowbite/**/*.js',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'Noto Sans',
					'sans-serif',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
					'Noto Color Emoji',
				],
			},
			colors: {
				// Your preferred accent color. Indigo is closest to Starlight’s defaults.
				accent: colors.indigo,
				primary: {
					50: '#faf6f5',
					100: '#f3ebe8',
					200: '#edd3c9',
					300: '#ffa98a',
					400: '#ff8052',
					500: '#ff571a',
					600: '#e63d00',
					700: '#bd3200',
					800: '#8f2600',
					900: '#661b00',
					950: '#3c1507',
				},
			},
		},
	},
	plugins: [flowbite],
};
