import mongoose from "mongoose";
import {
  getProducts,
  getProductById,
  productSearch,
} from "../backend/controllers/product.user.controller.js";
import Product from "../backend/module/product.model.js";
import { sanitizeProduct } from "../backend/helpers/product.helpers.js";

// Mock dependencies
jest.mock("../backend/module/product.model.js", () => ({
  find: jest.fn(),
}));
jest.mock(
  "../backend/helpers/product.helpers.js",
  () => ({
    sanitizeProduct: jest.fn((product) => ({ ...product, _id: product._id })),
  }),
  { virtual: true }
);
jest.mock("mongoose");

describe("Product Controller", () => {
  describe("getProducts fn", () => {
    let req;
    let res;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jest.clearAllMocks();
    });

    it("should return sanitized products with status 200 on successful DB query", async () => {
      // Mock data with the total_cost field
      const mockProducts = [
        { _id: "1", name: "Product 1", price: 10, total_cost: 5 },
        { _id: "2", name: "Product 2", price: 20, total_cost: 10 },
      ];

      // What we expect after sanitization (this should match your actual implementation)
      const expectedSanitizedData = [
        { _id: "1", name: "Product 1", price: 10, total_cost: 5 },
        { _id: "2", name: "Product 2", price: 20, total_cost: 10 },
      ];

      // Set up Product.find mock to return our test data
      Product.find.mockResolvedValue(mockProducts);

      // Call the function
      await getProducts(req, res);

      // Assertions
      expect(Product.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expectedSanitizedData,
      });
    });

    it("should return error with status 500 when DB query fails", async () => {
      // Mock a database error
      const mockError = new Error("Database connection failed");
      Product.find.mockRejectedValue(mockError);

      // Spy on console.error
      jest.spyOn(console, "error").mockImplementation();

      // Call the function
      await getProducts(req, res);

      // Assertions
      expect(Product.find).toHaveBeenCalledWith({});
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching products: Database connection failed"
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });
});
