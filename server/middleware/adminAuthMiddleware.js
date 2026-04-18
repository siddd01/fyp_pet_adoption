import jwt from "jsonwebtoken";

const adminAuth = (roles = []) => {
  return (req, res, next) => {
    console.log("Admin auth middleware hit");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No Bearer token found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token.substring(0, 20) + "...");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded);

      // Check if it's an admin token (has admin_id)
      if (!decoded.admin_id) {
        console.log("Not an admin token");
        return res.status(401).json({ message: "Invalid admin token" });
      }

      // role check
      if (roles.length && !roles.includes(decoded.role)) {
        console.log("Role check failed:", decoded.role, "required:", roles);
        return res.status(403).json({ message: "Access denied" });
      }

      req.admin = decoded;
      console.log("Admin authenticated successfully");
      next();
    } catch (error) {
      console.log("Token verification failed:", error.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default adminAuth;