import {
  authenticate,
  verifySuperAdmin,
  verifyAdmin,
} from "../backend/middleware/auth";
import jwt from "jsonwebtoken";

// Mock jwt module
jest.mock("jsonwebtoken");

describe("Authentication Middleware", () => {
  let req, res, next, mockToken;

  beforeEach(() => {
    // Setup common test fixtures
    req = {
      headers: {},
      user: null,
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };

    next = jest.fn();

    // Create a mock token
    mockToken = "mock.jwt.token";

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("authenticate middleware", () => {
    it("should return 401 if no authorization header is provided", () => {
      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized - No token provided",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header does not start with "Bearer "', () => {
      req.headers.authorization = "Basic sometoken";

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized - No token provided",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token verification fails", () => {
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized - Invalid token",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should set req.user and call next() if token is valid", () => {
      const decodedUser = { id: "123", role: "user" };
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(decodedUser);

      authenticate(req, res, next);

      expect(req.user).toEqual(decodedUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("verifySuperAdmin middleware", () => {
    it("should return 401 if req.user is not defined", () => {
      verifySuperAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized. Token missing or invalid.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 if user role is not super_admin", () => {
      req.user = { id: "123", role: "admin" };

      verifySuperAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Access denied. Super admin role required.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if user role is super_admin", () => {
      req.user = { id: "123", role: "super_admin" };

      verifySuperAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("verifyAdmin middleware", () => {
    it("should return 401 if req.user is not defined", () => {
      verifyAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized. Token missing or invalid.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 if user role is not admin or super_admin", () => {
      req.user = { id: "123", role: "user" };

      verifyAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Access denied. Admin or super admin role required.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if user role is admin", () => {
      req.user = { id: "123", role: "admin" };

      verifyAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should call next() if user role is super_admin", () => {
      req.user = { id: "123", role: "super_admin" };

      verifyAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
