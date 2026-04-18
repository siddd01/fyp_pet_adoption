import jwt from "jsonwebtoken";

export const verifyFlexibleToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if it's a user token or staff token
    // Staff tokens have staff_id field, user tokens have id field
    // Also check for role field or role_id === 3
    if (decoded.staff_id || decoded.role === 'staff' || decoded.role_id === 3) {
      req.staff = decoded; // Staff token
      console.log("STAFF TOKEN DETECTED:", decoded);
    } else {
      req.user = decoded; // User token
      console.log("USER TOKEN DETECTED:", decoded);
    }
    
    next();
  });
};
