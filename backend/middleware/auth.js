import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid token" });
  }
};

export const verifySuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token missing or invalid.",
    });
  }
  if (req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super admin role required.",
    });
  }
  next();
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token missing or invalid.",
    });
  }
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin or super admin role required.",
    });
  }
  next();
};