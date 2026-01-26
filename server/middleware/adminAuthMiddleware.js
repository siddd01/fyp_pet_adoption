import jwt from "jsonwebtoken";
const adminAuth = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    console.log("Auth header received:", authHeader); // Debug

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No auth header or wrong format"); // Debug
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token); // Debug

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully:", decoded); // Debug

      // role check
      if (roles.length && !roles.includes(decoded.role)) {
        console.log("Role check failed. Required:", roles, "Got:", decoded.role); // Debug
        return res.status(403).json({ message: "Access denied" });
      }

      req.admin = decoded;
      next();
    } catch (error) {
      console.error("Token verification error:", error.message); // Debug
      res.status(401).json({ message: "Invalid token" });
    }
  };
};



export default adminAuth;
