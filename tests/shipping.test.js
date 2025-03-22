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
jest.mock('../backend/module/shipping.model', () => {
    return jest.fn().mockImplementation(function(data) {
      this.save = jest.fn().mockResolvedValue({
        _id: 'mocked-shipping-id',
        ...data
      });
      return this;
    });
  });
  
jest.mock("../backend/module/order.model");
jest.mock("mongoose");

describe('Shipping Controller Tests', () => {
    let req;
    let res;
    
    beforeEach(() => {
      // Reset mocks between tests
      jest.clearAllMocks();
      
      // Setup request object
      req = {
        body: {
          name: 'John Doe',
          phone: '1234567890',
          run: '12345678-9',
          address: '123 Main St',
          region: 'Central',
          indications: 'Near the park'
        },
        user: {
          _id: 'user-123'
        }
      };
      
      // Setup response object with mock methods
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Mock console.error
      console.error = jest.fn();
    });
    
    test('should create a new shipping address successfully', async () => {
      // Execute the controller function
      await createShipping(req, res);
      
      // Check if Shipping constructor was called with correct data
      expect(Shipping).toHaveBeenCalledWith({
        user: 'user-123',
        name: 'John Doe',
        phone: '1234567890',
        run: '12345678-9',
        address: '123 Main St',
        region: 'Central',
        indications: 'Near the park'
      });
      
      // Check if save method was called on the instance
      const mockInstance = Shipping.mock.instances[0];
      expect(mockInstance.save).toHaveBeenCalled();
      
      // Check if proper response was sent
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'mocked-shipping-id',
        user: 'user-123'
      }));
    });
    
    test('should handle empty indications', async () => {
      // Modify request to have empty indications
      req.body.indications = '';
      
      // Execute the controller function
      await createShipping(req, res);
      
      // Check if Shipping constructor was called with empty indications
      expect(Shipping).toHaveBeenCalledWith(expect.objectContaining({
        indications: ''
      }));
      
      // Check proper response
      expect(res.status).toHaveBeenCalledWith(201);
    });
    
    test('should handle missing indications field', async () => {
      // Remove indications from request body
      delete req.body.indications;
      
      // Execute the controller function
      await createShipping(req, res);
      
      // Check if Shipping constructor was called with empty indications
      expect(Shipping).toHaveBeenCalledWith(expect.objectContaining({
        indications: ''
      }));
      
      // Check proper response
      expect(res.status).toHaveBeenCalledWith(201);
    });
    
   
  });