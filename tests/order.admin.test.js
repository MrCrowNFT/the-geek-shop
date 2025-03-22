import mongoose from 'mongoose';
import { 
  getOrders, 
  getOrderById, 
  updateOrder, 
  orderSearch,
  getRecentOrders
} from '../backend/controllers/order.admin.controller.js';
import Order from '../backend/module/order.model.js';

// Mock the entire Order model
jest.mock('../backend/module/order.model.js', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  countDocuments: jest.fn()
}));

// Mock mongoose.Types.ObjectId.isValid
mongoose.Types.ObjectId = {
  isValid: jest.fn()
};

describe('Order Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  describe('getOrders', () => {
    it('should return all orders', async () => {
      // Setup
      const mockOrders = [{ id: '123', status: 'Pending' }];
      Order.find.mockResolvedValueOnce(mockOrders);
      
      // Execute
      await getOrders(req, res);
      
      // Assert
      expect(Order.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockOrders });
    });
    
    it('should handle errors', async () => {
      // Setup
      Order.find.mockImplementationOnce(() => {
        throw new Error();
      });
      
      // Execute
      await getOrders(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        message: 'Server error' 
      });
    });
  });
  
  describe('getOrderById', () => {
    it('should return an order when valid ID is provided', async () => {
      // Setup
      const mockOrder = { id: '123', status: 'Pending' };
      req.params.id = '123';
      Order.findById.mockResolvedValueOnce(mockOrder);
      
      // Execute
      await getOrderById(req, res);
      
      // Assert
      expect(Order.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockOrder });
    });
    
    it('should return 404 when order not found', async () => {
      // Setup
      req.params.id = '123';
      Order.findById.mockResolvedValueOnce(null);
      
      // Execute
      await getOrderById(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        message: 'Order not found' 
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      req.params.id = '123';
      Order.findById.mockImplementationOnce(() => {
        throw new Error();
      });
      
      // Execute
      await getOrderById(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        message: 'Server error' 
      });
    });
  });
  
  describe('updateOrder', () => {
    it('should return 400 for invalid order ID format', async () => {
      // Setup
      req.params.id = 'invalid';
      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(false);
      
      // Execute
      await updateOrder(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        message: 'Invalid order ID format' 
      });
    });
    
    it('should return 404 when order not found', async () => {
      // Setup
      req.params.id = '123';
      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);
      Order.findById.mockResolvedValueOnce(null);
      
      // Execute
      await updateOrder(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        message: 'Order not found' 
      });
    });
    
    it('should update order successfully', async () => {
      // Setup
      req.params.id = '123';
      req.body = { status: 'Delivered' };
      
      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);
      
      const mockOrder = {
        _id: '123',
        status: 'Pending',
        save: jest.fn().mockResolvedValueOnce({
          _id: '123',
          status: 'Delivered'
        })
      };
      
      Order.findById.mockResolvedValueOnce(mockOrder);
      
      // Execute
      await updateOrder(req, res);
      
      // Assert
      expect(mockOrder.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        success: true, 
        data: expect.objectContaining({ status: 'Delivered' }) 
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      req.params.id = '123';
      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(true);
      Order.findById.mockImplementationOnce(() => {
        throw new Error('Test error');
      });
      
      // Execute
      await updateOrder(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json.mock.calls[0][0].success).toBe(false);
    });
  });
  
  describe('orderSearch', () => {
    it('should search orders with pagination', async () => {
      // Setup
      req.query = { searchTerm: 'test', page: '1', limit: '10' };
      
      const mockOrders = [{ id: '123', status: 'Pending' }];
      const mockFind = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce(mockOrders)
      };
      
      Order.find.mockReturnValueOnce(mockFind);
      Order.countDocuments.mockResolvedValueOnce(20);
      
      // Execute
      await orderSearch(req, res);
      
      // Assert
      expect(Order.find).toHaveBeenCalledWith({ $text: { $search: 'test' } });
      expect(mockFind.skip).toHaveBeenCalledWith(0);
      expect(mockFind.limit).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockOrders,
        pagination: expect.objectContaining({
          totalOrders: 20,
          currentPage: 1
        })
      }));
    });
    
    it('should return 404 when no orders found', async () => {
      // Setup
      req.query = { searchTerm: 'test' };
      
      const mockFind = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce([])
      };
      
      Order.find.mockReturnValueOnce(mockFind);
      
      // Execute
      await orderSearch(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No orders found matching the search criteria.'
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      req.query = { searchTerm: 'test' };
      Order.find.mockImplementationOnce(() => {
        throw new Error();
      });
      
      // Execute
      await orderSearch(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        message: 'Server error' 
      });
    });
  });
  
  describe('getRecentOrders', () => {
    it('should get recent orders', async () => {
      // Setup
      const mockOrders = [{ id: '123', status: 'Pending' }];
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(mockOrders)
      };
      
      Order.find.mockReturnValueOnce(mockFind);
      
      // Execute
      await getRecentOrders(req, res);
      
      // Assert
      expect(Order.find).toHaveBeenCalled();
      expect(mockFind.populate).toHaveBeenCalledTimes(3); // Called for user, shipping, products.id
      expect(mockFind.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      Order.find.mockImplementationOnce(() => {
        throw new Error();
      });
      
      // Execute
      await getRecentOrders(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        message: 'Server error' 
      });
    });
  });
});