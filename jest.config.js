export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Transform JavaScript/JSX files using Babel
  },
  testEnvironment: "node", // Specify the Node.js environment
  moduleFileExtensions: ["js", "jsx", "json", "node"], // File extensions to process
};
