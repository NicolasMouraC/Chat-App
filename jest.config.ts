require("dotenv").config();

export {};
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    // If you're using tsconfig.paths, there's no harm in telling Jest
    "@components/(.*)$": "<rootDir>/src/components/$1",
    "@/(.*)$": "<rootDir>/src/$1",

    // Mocking assets and styles
    "^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__tests__/mocks/fileMock.ts",
    "^.+\\.(css|less|scss|sass)$": "<rootDir>/src/__tests__/mocks/styleMock.ts",

    // Mock models and services folder
    "(assets|models|services)": "<rootDir>/src/__tests__/mocks/fileMock.ts",
  },
  // To obtain access to the matchers
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePaths: ["<rootDir>"],
  testEnvironment: "jsdom",
};
