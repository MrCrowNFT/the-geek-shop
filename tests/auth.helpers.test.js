import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
} from "../backend/helpers/auth.helpers"; 

// Mock the jsonwebtoken module
jest.mock("jsonwebtoken");

describe("JWT Token Helpers", () => {
  // Setup
  const mockUser = {
    _id: "user123",
    username: "testuser",
  };

  // Store original environment variables
  const originalEnv = process.env;

  beforeEach(() => {
    // Set mock environment variables
    process.env = {
      ...originalEnv,
      JWT_ACCESS_SECRET: "test-access-secret",
      JWT_REFRESH_SECRET: "test-refresh-secret",
    };

    // Reset mocks before each test
    jest.clearAllMocks();

    // Default implementation for jwt.sign
    jwt.sign.mockImplementation((payload, secret, options) => {
      return `mock-token-for-${payload.username}-expires-in-${options.expiresIn}`;
    });
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe("generateAccessToken", () => {
    it("should generate an access token with correct parameters", () => {
      const token = generateAccessToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, username: mockUser.username },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "5m" }
      );
      expect(token).toBe("mock-token-for-testuser-expires-in-5m");
    });

    it("should throw an error if JWT_ACCESS_SECRET is not defined", () => {
      delete process.env.JWT_ACCESS_SECRET;

      expect(() => {
        generateAccessToken(mockUser);
      }).toThrow();
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a refresh token with correct parameters", () => {
      const token = generateRefreshToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, username: mockUser.username },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
      );
      expect(token).toBe("mock-token-for-testuser-expires-in-30d");
    });

    it("should throw an error if JWT_REFRESH_SECRET is not defined", () => {
      delete process.env.JWT_REFRESH_SECRET;

      expect(() => {
        generateRefreshToken(mockUser);
      }).toThrow();
    });
  });

  describe("generateTokens", () => {
    it("should generate both access and refresh tokens", () => {
      const tokens = generateTokens(mockUser);

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(tokens).toEqual({
        accessToken: "mock-token-for-testuser-expires-in-5m",
        refreshToken: "mock-token-for-testuser-expires-in-30d",
      });
    });

    it("should throw an error if any secret is not defined", () => {
      delete process.env.JWT_ACCESS_SECRET;

      expect(() => {
        generateTokens(mockUser);
      }).toThrow();
    });
  });
});
