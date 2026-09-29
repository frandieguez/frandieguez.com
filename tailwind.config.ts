/**
 * Tailwind 3-style config, read by Tailwind 4 through the `@config` directive in
 * src/styles/global.css.
 *
 * It is deliberately untyped. `Config` and `tailwindcss/defaultTheme` are v3
 * exports that v4 no longer ships, so annotating this file produced sixteen
 * type errors for a file TypeScript never actually consumes — Tailwind reads it
 * at build time through its own loader.
 *
 * `theme()` callbacks are gone for the same reason: v4 resolves them, but its
 * types do not describe them, so every call was flagged as not callable. The
 * values they returned are written out literally below.
 */
import plugin from "tailwindcss/plugin";

export default {
	content: [
		"./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}",
		"!./src/pages/og-image/[slug].png.ts",
	],
	darkMode: ["class", '[data-theme="dark"]'],
	plugins: [
		require("@tailwindcss/typography"),
		plugin(({ addComponents }) => {
			addComponents({
				".citrus-link": {
					"&:hover": {
					},
				},
				".title": {
				},
				".data-footnote-backref": {
					"&:hover": {
					},
				},
			});
		}),
	],

	theme: {
		extend: {
			animation: {
				amoeba: "amoeba 8s ease-in-out infinite",
				noise: ".3s step-start infinite noise",
			},
			keyframes: {
				amoeba: {
					"0%": {
						"border-radius": "40% 60% 60% 40% / 50% 30% 70% 50%",
						transform: "scale(1)",
					},
					"50%": {
						"border-radius": "40% 60% 60% 40% / 50% 30% 70% 50%",
						transform: "scale(1.1)",
					},
					"80%": {
						"border-radius": "60% 40% 40% 60% / 30% 50% 50% 70%",
						transform: "scale(1)",
					},
					"100%": {
						"border-radius": "40% 60% 60% 40% / 50% 30% 70% 50%",
						transform: "scale(1)",
					},
				},
				noise: {
					"0% ": {
						filter: "url(#noise-frame-1)",
					},

					"33%": {
						filter: "url(#noise-frame-2)",
					},

					"66%": {
						filter: "url(#noise-frame-3)",
					},

					to: {
						filter: "url(#noise-frame-1)",
					},
				},
			},
			screens: {
				xs: "320px", // Add xs size
				// xl: '1200px',
			},
			maxWidth: {
				lg: "32rem", // default 32rem (512px)
				xl: "36rem", // default 36rem (576px)
				"2xl": "42rem", // default 42rem (672px)
				"3xl": "48rem", // default 48rem (768px)
				"4xl": "54rem", // !!! // default 56rem (896px)
				"5xl": "64rem", // default 64rem (1024px)
				"6xl": "76rem", // !!! // default 72rem (1152px)
			},
			colors: {
				color: {
					950: "var(--theme-color-950)",
					900: "var(--theme-color-900)",
					850: "var(--theme-color-850)",
					800: "var(--theme-color-800)",
					750: "var(--theme-color-750)",
					700: "var(--theme-color-700)",
					650: "var(--theme-color-650)",
					600: "var(--theme-color-600)",
					550: "var(--theme-color-550)",
					500: "var(--theme-color-500)",
					450: "var(--theme-color-450)",
					400: "var(--theme-color-400)",
					350: "var(--theme-color-350)",
					300: "var(--theme-color-300)",
					250: "var(--theme-color-250)",
					200: "var(--theme-color-200)",
					150: "var(--theme-color-150)",
					100: "var(--theme-color-100)",
					75: "var(--theme-color-75)",
					50: "var(--theme-color-50)",
				},
				bgColor: "hsl(var(--theme-bg) / <alpha-value>)",
				textColor: "var(--theme-text)",
				"accent-base": "hsl(var(--theme-accent-base) / <alpha-value>)",
				"accent-one": "hsl(var(--theme-accent-one) / <alpha-value>)",
				"accent-two": "hsl(var(--theme-accent-two) / <alpha-value>)",
				link: "hsl(var(--theme-link) / <alpha-value>)",
				accent: "var(--theme-accent)",
				quote: "hsl(var(--theme-quote) / <alpha-value>)",
				lightest: "var(--theme-lightest)",
				lighter: "var(--theme-lighter)",
				light: "var(--theme-light)",
				"special-lightest": "var(--theme-special-lightest)",
				"special-lighter": "var(--theme-special-lighter)",
				"special-light": "var(--theme-special-light)",
			},
			borderRadius: {
				// Static organic shapes. They replaced the animate-amoeba blob: same
				// warmth, no 8s infinite morph.
				pebble: "58% 42% 47% 53% / 48% 44% 56% 52%",
				leaf: "44% 56% 62% 38% / 54% 40% 60% 46%",
			},
			fontFamily: {
				// Only families that are actually loaded. "SFProRounded" and
				// "CascadiaCode" used to be listed here with no @font-face backing
				// them, so they silently resolved to the generic fallback.
				// The "Variable" suffix is the family name @fontsource-variable
				// declares in its @font-face rules; without it these resolve to
				// nothing. The non-variable names are kept as the next fallback so a
				// visitor who happens to have the font installed still gets it.
				sans: ["IBM Plex Sans Variable", "IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
				serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
				mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
				heading: ["Urbanist Variable", "Urbanist", "Space Grotesk", "Lexend", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
			},

			transitionProperty: {
				height: "height",
			},
			typography: {
				DEFAULT: {
					css: {
						a: {
						},
						blockquote: {
							// "@apply !px-4 md:!px-6 !py-2 !border-s-[0.625rem] rounded-lg border-color-100 bg-color-75": "",
							"p::before": {
							},
							"p::after": {
							},
						},

						// Code blocks
						pre: {
						},

						code: {
						},

						kbd: {
						},
						hr: {
						},
						strong: {
							fontWeight: "700",
						},
						sup: {
							"&:hover": {
							},
							a: {
								"&:hover": {
								},
							},
						},
						"h1, h2, h3, h4, h5, h6": {
							fontFamily:
								'"Urbanist Variable", Urbanist, "Space Grotesk", Lexend, ui-sans-serif, system-ui, sans-serif',
						},
						/*
            sup: {
              a: {
                "&:after": {
                  content: "']'",
                },
                "&:before": {
                  content: "'['",
                },
                "&:hover": {
                },
              },
            },
            */

						/* Table */
						table: {
						},
						"tbody tr": {
							borderBottomWidth: "none",
						},
						tfoot: {
							// borderTop: "1px dashed #666",
						},
						thead: {
							borderBottomWidth: "none",
						},
						"thead th": {
							// borderBottom: "1px #666",
							// fontWeight: "600",
						},
						"td, th": { // Padding for every table cell
						},
						'th[align="center"], td[align="center"]': {
							"text-align": "center",
						},
						'th[align="right"], td[align="right"]': {
							"text-align": "right",
						},
						'th[align="left"], td[align="left"]': {
							"text-align": "left",
						},
						// Alternating table row backgrounds
						"tbody tr:nth-child(odd)": { 
						},
						"tbody tr:nth-child(even)": { 
						},

						/* Admonitions/Aside */
						".aside": {
							"--admonition-color": "var(--tw-prose-quotes)",
							".aside-title": {
								"&:before": {
									"mask-size": "contain",
									"mask-position": "center",
									"mask-repeat": "no-repeat",
								},
							},
							".aside-content": {
								"> :last-child": {
								},
							},
						},
						".aside.aside-note": {
							"--admonition-color": "oklch(70.7% 0.165 254.624)",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath fill='var(--admonitions-color-tip)' d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
						".aside.aside-tip": {
							"--admonition-color": "oklch(76.8% 0.233 130.85)",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath d='M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
						".aside.aside-important": {
							"--admonition-color": "oklch(71.4% 0.203 305.504)",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath d='M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
						".aside.aside-warning": {
							"--admonition-color": "oklch(75% 0.183 55.934)",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath d='M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
						".aside.aside-caution": {
							"--admonition-color": "oklch(63.7% 0.237 25.331)",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath d='M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
					},
				},
				citrus: {
					css: {
						"--tw-prose-body": "var(--theme-text)",
						"--tw-prose-bold": "var(--theme-text)",
						"--tw-prose-bullets": "var(--theme-text)",
						"--tw-prose-code": "var(--theme-accent)",
						"--tw-prose-headings": "hsl(var(--theme-accent-base) / 1)",
						// "--tw-prose-hr": "0.5px dashed #666",
						"--tw-prose-links": "hsl(var(--theme-link) / 1)",
						"--tw-prose-quotes": "hsl(var(--theme-quote) / 1)",
						// "--tw-prose-th-borders": "#666",
						"code::before": { content: "none" },
						"code::after": { content: "none" },
					},
				},
				sm: {
					css: {
						code: {
							fontSize: "0.875rem",
							fontWeight: "400",
						},
					},
				},
				// Add these new styles for headings
				h1: {
				},
				h2: {
				},
				h3: {
				},
				h4: {
				},
				h5: {
				},
				h6: {
				},
			},
		},
	},
	safelist: [
		"bg-color-950",
		"bg-color-900",
		"bg-color-850",
		"bg-color-800",
		"bg-color-750",
		"bg-color-700",
		"bg-color-650",
		"bg-color-600",
		"bg-color-550",
		"bg-color-500",
		"bg-color-450",
		"bg-color-400",
		"bg-color-350",
		"bg-color-300",
		"bg-color-250",
		"bg-color-200",
		"bg-color-150",
		"bg-color-100",
		"bg-color-75",
		"bg-color-50",
		"text-color-950",
		"text-color-900",
		"text-color-850",
		"text-color-800",
		"text-color-750",
		"text-color-700",
		"text-color-650",
		"text-color-600",
		"text-color-550",
		"text-color-500",
		"text-color-450",
		"text-color-400",
		"text-color-350",
		"text-color-300",
		"text-color-250",
		"text-color-200",
		"text-color-150",
		"text-color-100",
		"text-color-75",
		"text-color-50",
	],
};
