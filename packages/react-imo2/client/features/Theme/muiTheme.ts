import { createMuiTheme } from "@material-ui/core/styles"

export default createMuiTheme({
	palette: {
		primary: {
			"50": "#e3f1ea",
			"100": "#baddcb",
			"200": "#8ec7aa",
			"300": "#60b28a",
			"400": "#3ba374",
			"500": "#00945c",
			"600": "#008652",
			"700": "#007546",
			"800": "#00653b",
			"900": "#004726",
			main: "#60b28a",
			contrastText: "#000"

			// light: "#BADDCB",
			// main: "#00945C",
			// dark: "#2e825d",
			// contrastText: "#303030"
		},
		secondary: {
			"50": "#e4f1f8",
			"100": "#bcdcf0",
			"200": "#94c7e6",
			"300": "#6fb1dc",
			"400": "#54a1d6",
			"500": "#3d93d0",
			"600": "#3485c4",
			"700": "#2a74b2",
			"800": "#2264a0",
			"900": "#154881",
			main: "#2a74b2",
			contrastText: "#000"
		},
		error: {
			main: "#c8373c"
		},
		text: {
			disabled: "#d1d1d2"
		}
	},
	typography: {
		fontFamily: "arial, sans-serif",
		h1: {
			fontFamily: "t-star, arial, sans-serif",
			fontWeight: 300
		},
		h2: {
			fontFamily: "t-star, arial, sans-serif",
			fontWeight: 300
		},
		h3: {
			fontFamily: "t-star, arial, sans-serif",
			fontWeight: 500
		},
		h4: {
			fontFamily: "t-star, arial, sans-serif",
			fontWeight: 500
		},
		h5: {
			fontFamily: "t-star, arial, sans-serif",
			fontWeight: 500
		},
		h6: {
			fontFamily: "t-star, arial, sans-serif",
			fontWeight: 500
		},
		subtitle2: {
			fontWeight: 700
		},
		button: {
			fontWeight: 700,
			textTransform: "none"
		},
		overline: {
			fontSize: "0.625rem"
		}
	},
	shape: {
		borderRadius: 0 // Default: 4
	},

	overrides: {
		MuiButton: {
			root: {
				borderRadius: 4
			}
		},
		MuiTabs: {
			indicator: {
				backgroundColor: "#000000"
			}
		}
	}
})
