module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      colors: {
        dark: "#2C2C2C",
        unselected: "#A9AFB8",
        button: "#F5F7FA",
        placeholder: "#E0E4E9",
        bghover: "#F7F9FB",
        bluetitle: "004284",
      },
    },
    fontFamily: {
      display: ["Airbnb Cereal App"],
    },
  },
  variants: {
    margin: ["hover"],
    backgroundColor: ["hover"],
  },
  plugins: [],
};
