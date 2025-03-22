import mongoose from "mongoose";
import {
  createShipping,
  getUserShippingAddresses,
  getShippingById,
  updateShipping,
  deleteShipping,
} from "../backend/controllers/shipping.controller";
import Shipping from "../backend/module/shipping.model";
import Order from "../backend/module/order.model";

// Mock dependencies
jest.mock("../backend/module/shipping.model", () => {
  return jest.fn().mockImplementation(function (data) {
    this.save = jest.fn().mockResolvedValue({
      _id: "mocked-shipping-id",
      ...data,
    });
    return this;
  });
});

jest.mock("../backend/module/order.model");
jest.mock("mongoose");

describe("Shipping Controller Tests", () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();

    // Setup request object
    req = {
      body: {
        name: "John Doe",
        phone: "1234567890",
        run: "12345678-9",
        address: "123 Main St",
        region: "Central",
        indications: "Near the park",
      },
      user: {
        _id: "user-123",
      },
      params: {
        id: "valid-shipping-id",
      },
    };

    // Setup response object with mock methods
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock console.error
    console.error = jest.fn();
  });

  test("should create a new shipping address successfully", async () => {
    // Execute the controller function
    await createShipping(req, res);

    // Check if Shipping constructor was called with correct data
    expect(Shipping).toHaveBeenCalledWith({
      user: "user-123",
      name: "John Doe",
      phone: "1234567890",
      run: "12345678-9",
      address: "123 Main St",
      region: "Central",
      indications: "Near the park",
    });

    // Check if save method was called on the instance
    const mockInstance = Shipping.mock.instances[0];
    expect(mockInstance.save).toHaveBeenCalled();

    // Check if proper response was sent
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "mocked-shipping-id",
        user: "user-123",
      })
    );
  });

  test("should handle empty indications", async () => {
    // Modify request to have empty indications
    req.body.indications = "";

    // Execute the controller function
    await createShipping(req, res);

    // Check if Shipping constructor was called with empty indications
    expect(Shipping).toHaveBeenCalledWith(
      expect.objectContaining({
        indications: "",
      })
    );

    // Check proper response
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should handle missing indications field", async () => {
    // Remove indications from request body
    delete req.body.indications;

    // Execute the controller function
    await createShipping(req, res);

    // Check if Shipping constructor was called with empty indications
    expect(Shipping).toHaveBeenCalledWith(
      expect.objectContaining({
        indications: "",
      })
    );

    // Check proper response
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should return shipping addresses for a user", async () => {
    // Create mock shipping addresses
    const mockShippingAddresses = [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        user: req.user._id,
        name: "John Doe",
        address: "123 Main St",
        city: "New York",
        postalCode: "10001",
        country: "USA",
        createdAt: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        user: req.user._id,
        name: "John Doe",
        address: "456 Oak Ave",
        city: "Los Angeles",
        postalCode: "90001",
        country: "USA",
        createdAt: new Date(),
      },
    ];

    // Setup the mock implementation of find() and sort()
    const sortMock = jest.fn().mockResolvedValue(mockShippingAddresses);
    const findMock = jest.fn().mockReturnValue({
      sort: sortMock,
    });

    Shipping.find = findMock;

    // Call the function
    await getUserShippingAddresses(req, res);

    // Assertions
    expect(findMock).toHaveBeenCalledWith({ user: req.user._id });
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockShippingAddresses);
  });

  test("should return empty array when user has no shipping addresses", async () => {
    // Setup the mock implementation to return an empty array
    const sortMock = jest.fn().mockResolvedValue([]);
    const findMock = jest.fn().mockReturnValue({
      sort: sortMock,
    });

    Shipping.find = findMock;

    // Call the function
    await getUserShippingAddresses(req, res);

    // Assertions
    expect(findMock).toHaveBeenCalledWith({ user: req.user._id });
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test("should handle errors in getUserShippingAddresses properly", async () => {
    // Setup the mock implementation to throw an error
    const error = new Error("Database connection failed");
    const findMock = jest.fn().mockImplementation(() => {
      throw error;
    });

    Shipping.find = findMock;

    // Call the function
    await getUserShippingAddresses(req, res);

    // Assertions
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching shipping addresses:",
      error
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching shipping addresses",
      error: error.message,
    });
  });

  // Tests for getShippingById
  describe("getShippingById Tests", () => {
    beforeEach(() => {
      // Additional setup for getShippingById tests
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
    });

    test("should return shipping address by ID successfully", async () => {
      // Mock shipping data
      const mockShipping = {
        _id: "valid-shipping-id",
        user: "user-123",
        name: "John Doe",
        address: "123 Main St",
        orders: [],
        toString: () => "user-123",
      };

      // Setup findById mock
      const populateMock = jest.fn().mockResolvedValue(mockShipping);
      const findByIdMock = jest.fn().mockReturnValue({
        populate: populateMock,
      });

      Shipping.findById = findByIdMock;

      // Execute
      await getShippingById(req, res);

      // Assert
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(
        "valid-shipping-id"
      );
      expect(findByIdMock).toHaveBeenCalledWith("valid-shipping-id");
      expect(populateMock).toHaveBeenCalledWith("orders");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockShipping);
    });

    test("should return 400 for invalid shipping ID format", async () => {
      // Setup
      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      // Execute
      await getShippingById(req, res);

      // Assert
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(
        "valid-shipping-id"
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid shipping ID format",
      });
    });

    test("should return 404 if shipping address not found", async () => {
      // Setup
      const populateMock = jest.fn().mockResolvedValue(null);
      const findByIdMock = jest.fn().mockReturnValue({
        populate: populateMock,
      });

      Shipping.findById = findByIdMock;

      // Execute
      await getShippingById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Shipping address not found",
      });
    });

    test("should return 403 if user not authorized for this shipping address", async () => {
      // Setup a shipping address owned by a different user
      const mockShipping = {
        _id: "valid-shipping-id",
        user: "different-user-id",
        name: "Jane Doe",
        address: "456 Oak Ave",
        toString: () => "different-user-id",
      };

      const populateMock = jest.fn().mockResolvedValue(mockShipping);
      const findByIdMock = jest.fn().mockReturnValue({
        populate: populateMock,
      });

      Shipping.findById = findByIdMock;

      // Execute
      await getShippingById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized to access this shipping address",
      });
    });

    test("should handle errors in getShippingById properly", async () => {
      // Setup
      const error = new Error("Database error");
      const populateMock = jest.fn().mockRejectedValue(error);
      const findByIdMock = jest.fn().mockReturnValue({
        populate: populateMock,
      });

      Shipping.findById = findByIdMock;

      // Execute
      await getShippingById(req, res);

      // Assert
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching shipping address:",
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching shipping address",
        error: error.message,
      });
    });
  });

  // Tests for updateShipping
  describe("updateShipping Tests", () => {
    beforeEach(() => {
      // Reset shipping-specific mocks for these tests
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

      // Setup request for update tests
      req = {
        params: { id: "valid-shipping-id" },
        user: { _id: "user-123" },
        body: {
          name: "Updated Name",
          phone: "9876543210",
          address: "456 New Street",
          region: "North",
          indications: "Beside the mall",
        },
      };
    });

    test("should update shipping address successfully", async () => {
      // Mock original shipping
      const originalShipping = {
        _id: "valid-shipping-id",
        user: "user-123",
        name: "John Doe",
        phone: "1234567890",
        address: "123 Main St",
        region: "Central",
        indications: "Near the park",
        toString: jest.fn().mockReturnValue("user-123"),
      };

      // Mock updated shipping
      const updatedShipping = {
        _id: "valid-shipping-id",
        user: "user-123",
        name: "Updated Name",
        phone: "9876543210",
        address: "456 New Street",
        region: "North",
        indications: "Beside the mall",
      };

      // Setup mocks
      Shipping.findById = jest.fn().mockResolvedValue(originalShipping);
      Shipping.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedShipping);

      // Execute
      await updateShipping(req, res);

      // Assert
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(
        "valid-shipping-id"
      );
      expect(Shipping.findById).toHaveBeenCalledWith("valid-shipping-id");
      expect(Shipping.findByIdAndUpdate).toHaveBeenCalledWith(
        "valid-shipping-id",
        { $set: req.body },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedShipping);
    });

    test("should return 400 for invalid shipping ID format", async () => {
      // Setup
      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      // Execute
      await updateShipping(req, res);

      // Assert
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(
        "valid-shipping-id"
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid shipping ID format",
      });
      expect(Shipping.findById).not.toHaveBeenCalled();
      expect(Shipping.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    test("should return 404 if shipping address not found", async () => {
      // Setup
      Shipping.findById = jest.fn().mockResolvedValue(null);

      // Execute
      await updateShipping(req, res);

      // Assert
      expect(Shipping.findById).toHaveBeenCalledWith("valid-shipping-id");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Shipping address not found",
      });
      expect(Shipping.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    test("should return 403 if user not authorized to update shipping address", async () => {
      // Setup shipping owned by different user
      const shipping = {
        _id: "valid-shipping-id",
        user: "different-user-id",
        name: "John Doe",
        toString: jest.fn().mockReturnValue("different-user-id"),
      };

      Shipping.findById = jest.fn().mockResolvedValue(shipping);

      // Execute
      await updateShipping(req, res);

      // Assert
      expect(Shipping.findById).toHaveBeenCalledWith("valid-shipping-id");
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized to update this shipping address",
      });
      expect(Shipping.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    test("should remove user and orders fields from updates", async () => {
      // Setup original shipping
      const originalShipping = {
        _id: "valid-shipping-id",
        user: "user-123",
        name: "John Doe",
        toString: jest.fn().mockReturnValue("user-123"),
      };

      // Setup updated shipping
      const updatedShipping = {
        _id: "valid-shipping-id",
        user: "user-123",
        name: "Updated Name",
      };

      // Add prohibited fields to request body
      req.body.user = "hacker-user-id";
      req.body.orders = ["fake-order-1", "fake-order-2"];

      // Setup mocks
      Shipping.findById = jest.fn().mockResolvedValue(originalShipping);
      Shipping.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedShipping);

      // Execute
      await updateShipping(req, res);

      // Assert
      // Check that user and orders fields were removed from the update
      expect(Shipping.findByIdAndUpdate).toHaveBeenCalledWith(
        "valid-shipping-id",
        {
          $set: expect.not.objectContaining({
            user: "hacker-user-id",
            orders: ["fake-order-1", "fake-order-2"],
          }),
        },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should handle validation errors", async () => {
      // Setup validation error
      const validationError = new Error("Validation failed");
      validationError.name = "ValidationError";

      // Original shipping for authorization check
      const originalShipping = {
        _id: "valid-shipping-id",
        user: "user-123",
        toString: jest.fn().mockReturnValue("user-123"),
      };

      // Setup mocks
      Shipping.findById = jest.fn().mockResolvedValue(originalShipping);
      Shipping.findByIdAndUpdate = jest.fn().mockRejectedValue(validationError);

      // Execute
      await updateShipping(req, res);

      // Assert
      expect(console.error).toHaveBeenCalledWith(
        "Error updating shipping address:",
        validationError
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error updating shipping address",
        error: validationError.message,
      });
    });

    test("should handle database errors", async () => {
      // Setup database error
      const dbError = new Error("Database connection failed");

      // Setup mocks
      Shipping.findById = jest.fn().mockRejectedValue(dbError);

      // Execute
      await updateShipping(req, res);

      // Assert
      expect(console.error).toHaveBeenCalledWith(
        "Error updating shipping address:",
        dbError
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error updating shipping address",
        error: dbError.message,
      });
    });
  });
  
});
