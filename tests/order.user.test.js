import {
  createOrder,
  getUserOrders,
  cancelOrder,
  addOrderToShipping,
} from "../backend/controllers/order.user.controller.js";
import Order from "../backend/module/order.model.js";
import Shipping from "../backend/module/shipping.model.js";
import Product from "../backend/module/product.model.js";
import mongoose from "mongoose";

// Mock dependencies
jest.mock("../backend/module/order.model.js");
jest.mock("../backend/module/shipping.model.js");
jest.mock("../backend/module/product.model.js");

describe('Order Controller', () => {
    let req;
    let res;
    
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
      
      // Mock request and response objects
      req = {
        body: {},
        params: {},
        user: { _id: new mongoose.Types.ObjectId() }
      };
      
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });
    
    describe('createOrder', () => {
      test('should create a new order successfully', async () => {
        // Setup test data
        const mockShippingId = new mongoose.Types.ObjectId();
        const mockProductId1 = new mongoose.Types.ObjectId();
        const mockProductId2 = new mongoose.Types.ObjectId();
        
        req.body = {
          shipping: mockShippingId,
          products: [
            { id: mockProductId1, quantity: 2 },
            { id: mockProductId2, quantity: 1 }
          ],
          paid_amount: 100
        };
        
        // Mock shipping address
        Shipping.findById.mockResolvedValue({
          _id: mockShippingId,
          user: req.user._id.toString(),
          address: '123 Test St'
        });
        
        // Mock products
        Product.find.mockResolvedValue([
          { _id: mockProductId1, name: 'Product 1', price: 30 },
          { _id: mockProductId2, name: 'Product 2', price: 40 }
        ]);
        
        // Mock save operation
        const mockSavedOrder = {
          _id: new mongoose.Types.ObjectId(),
          user: req.user._id,
          shipping: mockShippingId,
          products: req.body.products,
          paid_amount: req.body.paid_amount,
          status: 'Pending'
        };
        
        Order.prototype.save = jest.fn().mockResolvedValue(mockSavedOrder);
        
        // Mock populated order
        Order.findById.mockImplementation(() => ({
          populate: jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockImplementation(() => ({
              populate: jest.fn().mockResolvedValue({
                ...mockSavedOrder,
                user: { _id: req.user._id, name: 'Test User', email: 'test@example.com' },
                shipping: { _id: mockShippingId, address: '123 Test St' },
                products: [
                  { id: { _id: mockProductId1, name: 'Product 1', price: 30 }, quantity: 2 },
                  { id: { _id: mockProductId2, name: 'Product 2', price: 40 }, quantity: 1 }
                ]
              })
            }))
          }))
        }));
        
        // Call controller function
        await createOrder(req, res);
        
        // Assertions
        expect(Shipping.findById).toHaveBeenCalledWith(mockShippingId);
        expect(Product.find).toHaveBeenCalledWith({ _id: { $in: [mockProductId1, mockProductId2] } });
        expect(Order.prototype.save).toHaveBeenCalled();
        expect(Order.findById).toHaveBeenCalledWith(mockSavedOrder._id);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
      });
      
      test('should return 404 if shipping address not found', async () => {
        req.body = {
          shipping: new mongoose.Types.ObjectId(),
          products: [],
          paid_amount: 100
        };
        
        // Mock shipping address not found
        Shipping.findById.mockResolvedValue(null);
        
        await createOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Shipping address not found' });
      });
      
      test('should return 403 if shipping address belongs to another user', async () => {
        const mockShippingId = new mongoose.Types.ObjectId();
        
        req.body = {
          shipping: mockShippingId,
          products: [],
          paid_amount: 100
        };
        
        // Mock shipping address belonging to different user
        Shipping.findById.mockResolvedValue({
          _id: mockShippingId,
          user: new mongoose.Types.ObjectId().toString(), // Different user ID
          address: '123 Test St'
        });
        
        await createOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'Not authorized to use this shipping address' 
        });
      });
      
      test('should return 404 if products not found', async () => {
        const mockShippingId = new mongoose.Types.ObjectId();
        const mockProductId = new mongoose.Types.ObjectId();
        
        req.body = {
          shipping: mockShippingId,
          products: [{ id: mockProductId, quantity: 2 }],
          paid_amount: 100
        };
        
        // Mock shipping address
        Shipping.findById.mockResolvedValue({
          _id: mockShippingId,
          user: req.user._id.toString(),
          address: '123 Test St'
        });
        
        // Mock no products found (or fewer than requested)
        Product.find.mockResolvedValue([]);
        
        await createOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'One or more products not found' 
        });
      });
      
      test('should handle server error', async () => {
        req.body = {
          shipping: new mongoose.Types.ObjectId(),
          products: []
        };
        
        // Mock error
        const error = new Error('Database error');
        Shipping.findById.mockRejectedValue(error);
        
        await createOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'Error creating order', 
          error: error.message 
        });
      });
    });
    
    describe('getUserOrders', () => {
      test('should return all orders for a user', async () => {
        const mockOrders = [
          { _id: new mongoose.Types.ObjectId(), status: 'Pending' },
          { _id: new mongoose.Types.ObjectId(), status: 'Delivered' }
        ];
        
        // Mock Order.find chain
        Order.find.mockImplementation(() => ({
          populate: jest.fn().mockImplementation(() => ({
            populate: jest.fn().mockImplementation(() => ({
              sort: jest.fn().mockResolvedValue(mockOrders)
            }))
          }))
        }));
        
        await getUserOrders(req, res);
        
        expect(Order.find).toHaveBeenCalledWith({ user: req.user._id });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockOrders);
      });
      
      test('should handle server error', async () => {
        // Mock error
        const error = new Error('Database error');
        Order.find.mockImplementation(() => {
          throw error;
        });
        
        await getUserOrders(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'Error fetching orders', 
          error: error.message 
        });
      });
    });
    
    describe('cancelOrder', () => {
      test('should cancel an order successfully', async () => {
        const mockOrderId = new mongoose.Types.ObjectId();
        req.params.id = mockOrderId;
        
        const mockOrder = {
          _id: mockOrderId,
          user: req.user._id,
          status: 'Pending',
          save: jest.fn().mockResolvedValue(true)
        };
        
        // Mock to string method
        mockOrder.user.toString = jest.fn().mockReturnValue(req.user._id.toString());
        
        Order.findById.mockResolvedValue(mockOrder);
        
        await cancelOrder(req, res);
        
        expect(Order.findById).toHaveBeenCalledWith(mockOrderId);
        expect(mockOrder.status).toBe('Cancelled');
        expect(mockOrder.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Order cancelled successfully',
          order: mockOrder
        });
      });
      
      test('should return 404 if order not found', async () => {
        req.params.id = new mongoose.Types.ObjectId();
        
        Order.findById.mockResolvedValue(null);
        
        await cancelOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Order not found' });
      });
      
      test('should return 403 if user not authorized', async () => {
        const mockOrderId = new mongoose.Types.ObjectId();
        req.params.id = mockOrderId;
        
        const mockOrder = {
          _id: mockOrderId,
          user: new mongoose.Types.ObjectId(), // Different user ID
          status: 'Pending'
        };
        
        // Mock to string method
        mockOrder.user.toString = jest.fn().mockReturnValue(mockOrder.user.toString());
        
        Order.findById.mockResolvedValue(mockOrder);
        
        await cancelOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'Not authorized to cancel this order' 
        });
      });
      
      test('should return 400 if order is already cancelled', async () => {
        const mockOrderId = new mongoose.Types.ObjectId();
        req.params.id = mockOrderId;
        
        const mockOrder = {
          _id: mockOrderId,
          user: req.user._id,
          status: 'Cancelled'
        };
        
        // Mock to string method
        mockOrder.user.toString = jest.fn().mockReturnValue(req.user._id.toString());
        
        Order.findById.mockResolvedValue(mockOrder);
        
        await cancelOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'Order is already cancelled' 
        });
      });
      
      test('should return 400 if order is beyond cancellation period', async () => {
        const mockOrderId = new mongoose.Types.ObjectId();
        req.params.id = mockOrderId;
        
        const now = new Date();
        const thirteenHoursAgo = new Date(now.getTime() - (13 * 60 * 60 * 1000));
        
        const mockOrder = {
          _id: mockOrderId,
          user: req.user._id,
          status: 'Paid',
          updatedAt: thirteenHoursAgo
        };
        
        // Mock to string method
        mockOrder.user.toString = jest.fn().mockReturnValue(req.user._id.toString());
        
        Order.findById.mockResolvedValue(mockOrder);
        
        await cancelOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json.mock.calls[0][0].message).toBe(
          'Order cannot be cancelled after 12 hours of payment'
        );
        expect(res.json.mock.calls[0][0].hoursPassed).toBeGreaterThan(12);
      });
      
      test('should return 400 if order is OnRoute or Delivered', async () => {
        const mockOrderId = new mongoose.Types.ObjectId();
        req.params.id = mockOrderId;
        
        const mockOrder = {
          _id: mockOrderId,
          user: req.user._id,
          status: 'OnRoute'
        };
        
        // Mock to string method
        mockOrder.user.toString = jest.fn().mockReturnValue(req.user._id.toString());
        
        Order.findById.mockResolvedValue(mockOrder);
        
        await cancelOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
          message: "Cannot cancel order in 'OnRoute' status"
        });
      });
      
      test('should handle server error', async () => {
        req.params.id = new mongoose.Types.ObjectId();
        
        // Mock error
        const error = new Error('Database error');
        Order.findById.mockRejectedValue(error);
        
        await cancelOrder(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'Error cancelling order', 
          error: error.message 
        });
      });
    });
  });
