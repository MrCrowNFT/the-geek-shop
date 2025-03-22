import { jest } from "@jest/globals";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../backend/controllers/category.controller";
import Category from "../backend/module/category.model";

// Mock Category model
jest.mock("../backend/module/category.model");

describe("Category Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { role: "admin" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getAllCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [
        { _id: "1", name: "Electronics", description: "Electronic items" },
        { _id: "2", name: "Clothing", description: "Clothing items" },
      ];

      Category.find.mockResolvedValue(mockCategories);

      await getAllCategories(req, res);

      expect(Category.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategories,
      });
    });

    it("should handle errors", async () => {
      const errorMessage = "Database error";
      Category.find.mockRejectedValue(new Error(errorMessage));

      // Spy on console.error to verify it's called
      jest.spyOn(console, "error").mockImplementation();

      await getAllCategories(req, res);

      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });

  describe("addCategory", () => {
    it("should add a new category successfully", async () => {
      req.body = { name: "Books", description: "Book items" };

      const savedCategory = {
        _id: "3",
        name: "Books",
        description: "Book items",
      };

      Category.findOne.mockResolvedValue(null);

      const mockSave = jest.fn().mockResolvedValue(savedCategory);
      Category.mockImplementation(() => ({
        save: mockSave,
      }));

      await addCategory(req, res);

      expect(Category.findOne).toHaveBeenCalledWith({ name: "Books" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Object),
      });
    });

    it("should return error if category name is missing", async () => {
      req.body = { description: "Book items" };

      await addCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Category name is required",
      });
    });

    it("should return error if category already exists", async () => {
      req.body = { name: "Electronics", description: "Electronic items" };

      Category.findOne.mockResolvedValue({
        _id: "1",
        name: "Electronics",
        description: "Electronic items",
      });

      await addCategory(req, res);

      expect(Category.findOne).toHaveBeenCalledWith({ name: "Electronics" });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Category already exists",
      });
    });

    it("should handle server errors", async () => {
      req.body = { name: "Books", description: "Book items" };

      const errorMessage = "Database error";
      Category.findOne.mockRejectedValue(new Error(errorMessage));

      jest.spyOn(console, "error").mockImplementation();

      await addCategory(req, res);

      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });

  describe("updateCategory", () => {
    it("should update a category successfully", async () => {
      req.params = { id: "1" };
      req.body = {
        name: "Updated Electronics",
        description: "Updated description",
      };

      const updatedCategory = {
        _id: "1",
        name: "Updated Electronics",
        description: "Updated description",
      };

      Category.findByIdAndUpdate.mockResolvedValue(updatedCategory);

      await updateCategory(req, res);

      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { name: "Updated Electronics", description: "Updated description" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedCategory,
      });
    });

    it("should return error if category not found", async () => {
      req.params = { id: "nonexistent-id" };
      req.body = { name: "Updated Name", description: "Updated description" };

      Category.findByIdAndUpdate.mockResolvedValue(null);

      await updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Category not found",
      });
    });

    it("should handle server errors", async () => {
      req.params = { id: "1" };
      req.body = { name: "Updated Name", description: "Updated description" };

      const errorMessage = "Database error";
      Category.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      jest.spyOn(console, "error").mockImplementation();

      await updateCategory(req, res);

      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category successfully", async () => {
      req.params = { id: "1" };

      const deletedCategory = {
        _id: "1",
        name: "Electronics",
        description: "Electronic items",
      };

      Category.findByIdAndDelete.mockResolvedValue(deletedCategory);

      await deleteCategory(req, res);

      expect(Category.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Category deleted successfully",
      });
    });

    it("should return error if category not found", async () => {
      req.params = { id: "nonexistent-id" };

      Category.findByIdAndDelete.mockResolvedValue(null);

      await deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Category not found",
      });
    });

    it("should handle server errors", async () => {
      req.params = { id: "1" };

      const errorMessage = "Database error";
      Category.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

      jest.spyOn(console, "error").mockImplementation();

      await deleteCategory(req, res);

      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });
});
