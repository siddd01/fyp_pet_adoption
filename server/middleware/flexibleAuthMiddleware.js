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

    // Staff tokens use staff_id and/or STAFF role. Customer/user tokens use id.
    if (
      decoded.staff_id ||
      decoded.role === "STAFF" ||
      decoded.role === "staff" ||
      decoded.role_id === 2
    ) {
      req.staff = decoded; // Staff token
      console.log("STAFF TOKEN DETECTED:", decoded);
    } else {
      req.user = decoded; // User token
      console.log("USER TOKEN DETECTED:", decoded);
    }
    
    next();
  });
};
