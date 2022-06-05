//
// theme.tsx - custom theme applied to all components of the application
//

import { lighten, rgbToHex, createTheme, Theme, SxProps } from "@mui/material/styles"

// Theming
// https://bareynol.github.io/mui-theme-creator/
// https://mui.com/customization/theming/

declare module "@mui/material/styles" {
  // allow configuration using `createTheme`
  interface PaletteOptions {
    materialyou?: {
      primary?: {
        light?: string
        lighter?: string
        lightest?: string
      }
    }
  }
}

// coefficients used to make colors lighter
const LIGHT = 0.92
const LIGHTER = 0.95
const LIGHTEST = 0.97

export const PRIMARY_COLOR = "#0072e5" // blue
export const PRIMARY_LIGHT = rgbToHex(lighten(PRIMARY_COLOR, LIGHT))
export const PRIMARY_LIGHTER = rgbToHex(lighten(PRIMARY_COLOR, LIGHTER))
export const PRIMARY_LIGHTEST = rgbToHex(lighten(PRIMARY_COLOR, LIGHTEST))

export const BORDER_RADIUS_FANCY = "74% 26% 61% 39% / 35% 30% 70% 65%"

// Roboto Flex
export const LIGHT_WEIGHT = 300
export const REGULAR_WEIGHT = 400
export const MEDIUM_WEIGHT = 500
export const BOLD_WEIGHT = 700

// Styles applied to all components
export const customSx: SxProps<Theme> = {




}

export function customTheme() {
  const baseTheme = createTheme({
    palette: {
      primary: {
        main: PRIMARY_COLOR,
      },
      secondary: {
        main: "#7ab6a8",
      },
      background: {
        default: PRIMARY_LIGHTEST,
        /*   paper: "#fF00FF", */
      },
      text: {
        primary: "#3d4043",
        secondary: "#606367",
      },
      action: {
        active: "#001E3C",
      },
      success: {
        500: "#009688",
      },
      materialyou: {
        primary: {
          light: PRIMARY_LIGHT,
          lighter: PRIMARY_LIGHTER,
          lightest: PRIMARY_LIGHTEST,
        },
      },
      tonalOffset: 0.4,
    },

    typography: {
      // https://mui.com/customization/typography/#self-hosted-fonts
      fontFamily: "'Roboto Flex', Helvetica, Arial, sans-serif",
      fontWeightLight: LIGHT_WEIGHT,
      fontWeightRegular: REGULAR_WEIGHT,
      fontWeightMedium: MEDIUM_WEIGHT,
      fontWeightBold: BOLD_WEIGHT,
    },
  })

  const customTheme = createTheme(baseTheme, {
    typography: {
      h1: {
        fontWeight: REGULAR_WEIGHT,
      },
      h2: {
        fontWeight: REGULAR_WEIGHT,
      },
      h3: {
        fontWeight: REGULAR_WEIGHT,
      },
      h4: {
        fontWeight: REGULAR_WEIGHT,
      },
      h5: {
        fontWeight: REGULAR_WEIGHT,
      },
      h6: {
        fontWeight: REGULAR_WEIGHT,
      },
      body1: {
        fontWeight: MEDIUM_WEIGHT
      },
      body2: {
        fontWeight: MEDIUM_WEIGHT
      },
      subtitle1: {
        fontWeight: MEDIUM_WEIGHT
      },
      subtitle2: {
        fontWeight: MEDIUM_WEIGHT
      },
      button: {
        fontWeight: MEDIUM_WEIGHT
      },
      caption: {
        fontWeight: MEDIUM_WEIGHT
      },
      overline: {
        fontWeight: MEDIUM_WEIGHT
      },      
    },

    components: {
      MuiIcon: {
        defaultProps: {
          // Replace the `material-icons` default value.
          baseClassName: "material-icons-outlined",
        },
      },

      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: PRIMARY_LIGHTEST,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            color: baseTheme.palette.text.primary,
            backgroundColor: PRIMARY_LIGHTEST,
          },
        },
      },

      MuiBadge: {
        styleOverrides: {
          badge: {
            // add a bit of white border around the dot that makes it stand out
            // TODO could have animation from https://mui.com/components/avatars/#with-badge
            boxShadow: `0 0 0 2px ${baseTheme.palette.background.paper}`,

            // TODO dot is on top of bottom navigation, why? https://mui.com/customization/z-index/
            zIndex: baseTheme.zIndex.appBar - 1,
          },
        },
      },
    },
  })

  return customTheme
}
