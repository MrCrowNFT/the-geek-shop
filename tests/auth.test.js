import { jest } from "@jest/globals";
import {
  login,
  refreshAccessToken,
  logout,
  signup,
} from "../backend/controllers/auth.controller";
import User from "../backend/module/user.model";
import RefreshToken from "../backend/module/refreshToken.model";
import jwt from "jsonwebtoken";
import * as authHelpers from "../backend/helpers/auth.helpers";

// Mock modules
jest.mock("../backend/module/user.model");
jest.mock("../backend/module/refreshToken.model");
jest.mock("jsonwebtoken");
jest.mock("../backend/helpers/auth.helpers");

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should successfully log in a user with valid credentials", async () => {
      // Setup
      req.body = { username: "testuser", password: "password123" };

      const mockUser = {
        _id: "123456",
        username: "testuser",
        email: "test@example.com",
        role: "user",
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const mockTokens = {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      };

      authHelpers.generateTokens.mockReturnValue(mockTokens);

      RefreshToken.create.mockResolvedValue({
        token: mockTokens.refreshToken,
        user: mockUser._id,
        expiresAt: new Date(),
      });

      // Execute
      await login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(mockUser.comparePassword).toHaveBeenCalledWith("password123");
      expect(authHelpers.generateTokens).toHaveBeenCalledWith(mockUser);
      expect(RefreshToken.create).toHaveBeenCalledWith({
        token: mockTokens.refreshToken,
        user: mockUser._id,
        expiresAt: expect.any(Date),
      });
      expect(res.cookie).toHaveBeenCalledWith(
        "refreshToken",
        mockTokens.refreshToken,
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Login successful",
        accessToken: mockTokens.accessToken,
      });
    });

    it("should return error if username is invalid", async () => {
      // Setup
      req.body = { username: "nonexistentuser", password: "password123" };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      // Execute
      await login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid username",
      });
    });

    it("should return error if password is invalid", async () => {
      // Setup
      req.body = { username: "testuser", password: "wrongpassword" };

      const mockUser = {
        _id: "123456",
        username: "testuser",
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      // Execute
      await login(req, res);

      // Assert
      expect(mockUser.comparePassword).toHaveBeenCalledWith("wrongpassword");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid password",
      });
    });

    it("should handle error if refresh token cannot be saved", async () => {
      // Setup
      req.body = { username: "testuser", password: "password123" };

      const mockUser = {
        _id: "123456",
        username: "testuser",
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const mockTokens = {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      };

      authHelpers.generateTokens.mockReturnValue(mockTokens);

      RefreshToken.create.mockResolvedValue(null);

      // Execute
      await login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to save refresh token on database",
      });
    });

    it("should handle server errors", async () => {
      // Setup
      req.body = { username: "testuser", password: "password123" };

      const errorMessage = "Database error";
      User.findOne.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      jest.spyOn(console, "error").mockImplementation();

      // Execute
      await login(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });

  describe("refreshAccessToken", () => {
    it("should successfully refresh the access token", async () => {
      // Setup
      req.cookies.refreshToken = "valid-refresh-token";

      const mockStoredToken = {
        _id: "token-id",
        token: "valid-refresh-token",
        user: "user-id",
        expiresAt: new Date(Date.now() + 1000000), // Future date
      };

      RefreshToken.findOne.mockResolvedValue(mockStoredToken);

      const decodedToken = { id: "user-id" };
      jwt.verify.mockReturnValue(decodedToken);

      const mockUser = {
        _id: "user-id",
        username: "testuser",
        email: "test@example.com",
        role: "user",
      };

      User.findById.mockResolvedValue(mockUser);

      const mockAccessToken = "new-access-token";
      authHelpers.generateAccessToken.mockReturnValue(mockAccessToken);

      // Execute
      await refreshAccessToken(req, res);

      // Assert
      expect(RefreshToken.findOne).toHaveBeenCalledWith({
        token: "valid-refresh-token",
      });
      expect(jwt.verify).toHaveBeenCalledWith(
        "valid-refresh-token",
        process.env.JWT_REFRESH_SECRET
      );
      expect(User.findById).toHaveBeenCalledWith("user-id");
      expect(authHelpers.generateAccessToken).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Refresh successful",
        accessToken: mockAccessToken,
      });
    });

    it("should return error if refresh token is missing", async () => {
      // Setup - no refresh token in cookies

      // Execute
      await refreshAccessToken(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Refresh token is required",
      });
    });

    it("should return error if refresh token is not found in database", async () => {
      // Setup
      req.cookies.refreshToken = "invalid-refresh-token";

      RefreshToken.findOne.mockResolvedValue(null);

      // Execute
      await refreshAccessToken(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid refresh token",
      });
    });

    it("should return error if refresh token is expired", async () => {
      // Setup
      req.cookies.refreshToken = "expired-refresh-token";

      const mockStoredToken = {
        _id: "token-id",
        token: "expired-refresh-token",
        user: "user-id",
        expiresAt: new Date(Date.now() - 1000000), // Past date
      };

      RefreshToken.findOne.mockResolvedValue(mockStoredToken);
      RefreshToken.deleteOne.mockResolvedValue({ deletedCount: 1 });

      // Execute
      await refreshAccessToken(req, res);

      // Assert
      expect(RefreshToken.deleteOne).toHaveBeenCalledWith({
        _id: mockStoredToken._id,
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Refresh token expired",
      });
    });

    it("should return error if token verification fails", async () => {
      // Setup
      req.cookies.refreshToken = "tampered-refresh-token";

      const mockStoredToken = {
        _id: "token-id",
        token: "tampered-refresh-token",
        user: "user-id",
        expiresAt: new Date(Date.now() + 1000000), // Future date
      };

      RefreshToken.findOne.mockResolvedValue(mockStoredToken);

      jwt.verify.mockImplementation(() => {
        throw new Error("Token verification failed");
      });

      RefreshToken.deleteOne.mockResolvedValue({ deletedCount: 1 });

      // Execute
      await refreshAccessToken(req, res);

      // Assert
      expect(RefreshToken.deleteOne).toHaveBeenCalledWith({
        _id: mockStoredToken._id,
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid refresh token",
      });
    });

    it("should return error if user is not found", async () => {
      // Setup
      req.cookies.refreshToken = "valid-refresh-token";

      const mockStoredToken = {
        _id: "token-id",
        token: "valid-refresh-token",
        user: "nonexistent-user-id",
        expiresAt: new Date(Date.now() + 1000000), // Future date
      };

      RefreshToken.findOne.mockResolvedValue(mockStoredToken);

      const decodedToken = { id: "nonexistent-user-id" };
      jwt.verify.mockReturnValue(decodedToken);

      User.findById.mockResolvedValue(null);

      // Execute
      await refreshAccessToken(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    it("should handle server errors", async () => {
      // Setup
      req.cookies.refreshToken = "valid-refresh-token";

      const errorMessage = "Database error";
      RefreshToken.findOne.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      jest.spyOn(console, "error").mockImplementation();

      // Execute
      await refreshAccessToken(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });

  describe("logout", () => {
    it("should successfully log out a user", async () => {
      // Setup
      req.cookies.refreshToken = "valid-refresh-token";

      RefreshToken.deleteOne.mockResolvedValue({ deletedCount: 1 });

      // Execute
      await logout(req, res);

      // Assert
      expect(RefreshToken.deleteOne).toHaveBeenCalledWith({
        token: "valid-refresh-token",
      });
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logout successful",
      });
    });

    it("should return error if refresh token is missing", async () => {
      // Setup - no refresh token in cookies

      // Execute
      await logout(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Refresh token is required",
      });
    });

    it("should return error if refresh token could not be deleted", async () => {
      // Setup
      req.cookies.refreshToken = "valid-refresh-token";

      RefreshToken.deleteOne.mockResolvedValue(null);

      // Execute
      await logout(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Refresh token could not be deleted",
      });
    });

    it("should handle server errors", async () => {
      // Setup
      req.cookies.refreshToken = "valid-refresh-token";

      const errorMessage = "Database error";
      RefreshToken.deleteOne.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      jest.spyOn(console, "error").mockImplementation();

      // Execute
      await logout(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });

  describe("signup", () => {
    it("should successfully create a new user", async () => {
      // Setup
      req.body = {
        username: "newuser",
        password: "password123",
        email: "new@example.com",
      };

      User.findOne.mockResolvedValueOnce(null); // Username check
      User.findOne.mockResolvedValueOnce(null); // Email check

      const mockNewUser = {
        _id: "new-user-id",
        username: "newuser",
        email: "new@example.com",
        save: jest.fn().mockResolvedValue(true),
      };

      User.mockImplementation(() => mockNewUser);

      // Execute
      await signup(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: "newuser" });
      expect(User.findOne).toHaveBeenCalledWith({ email: "new@example.com" });
      expect(mockNewUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User created successfully",
        data: {
          username: "newuser",
          email: "new@example.com",
        },
      });
    });

    it("should return error if required fields are missing", async () => {
      // Setup - missing email
      req.body = {
        username: "newuser",
        password: "password123",
      };

      // Execute
      await signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Username, password and email are required.",
      });
    });

    it("should return error if username already exists", async () => {
      // Setup
      req.body = {
        username: "existinguser",
        password: "password123",
        email: "new@example.com",
      };

      const existingUser = {
        _id: "existing-user-id",
        username: "existinguser",
        email: "existing@example.com",
      };

      User.findOne.mockResolvedValueOnce(existingUser); // Username check returns existing user

      // Execute
      await signup(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: "existinguser" });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Username already in use",
      });
    });

    it("should return error if email already exists", async () => {
      // Setup
      req.body = {
        username: "newuser",
        password: "password123",
        email: "existing@example.com",
      };

      User.findOne.mockResolvedValueOnce(null); // Username check

      const existingUser = {
        _id: "existing-user-id",
        username: "anotheruser",
        email: "existing@example.com",
      };

      User.findOne.mockResolvedValueOnce(existingUser); // Email check returns existing user

      // Execute
      await signup(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: "newuser" });
      expect(User.findOne).toHaveBeenCalledWith({
        email: "existing@example.com",
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Email already in use",
      });
    });

    it("should handle server errors", async () => {
      // Setup
      req.body = {
        username: "newuser",
        password: "password123",
        email: "new@example.com",
      };

      const errorMessage = "Database error";
      User.findOne.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      jest.spyOn(console, "error").mockImplementation();

      // Execute
      await signup(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Internal server error",
        details: errorMessage,
      });
    });
  });
});
