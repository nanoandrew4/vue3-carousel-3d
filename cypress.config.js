const { defineConfig } = require("cypress");

module.exports = defineConfig({
  fixturesFolder: "tests/e2e/fixtures",
  screenshotsFolder: "tests/e2e/screenshots",
  videosFolder: "tests/e2e/videos",

  e2e: {
    specPattern: "tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
