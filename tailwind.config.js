/* eslint-disable */
const colors = require("./constants/colors");

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      colors: {
        ...Object.fromEntries(
          Object.entries(colors).filter(
            ([name]) => name !== "palette" || name !== "mutedPalette"
          )
        ),
        ...colors.palette,
        ...colors.mutedPalette,
      },
    },
    fontFamily: {
      display: ["Montserrat"],
      sans: [
        "Montserrat",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
      ],
    },
    maxHeight: {
      0: "0",
      "1/3": "33vh",
    },
  },
  plugins: [],
};
