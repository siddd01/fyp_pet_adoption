import jwt from "jsonwebtoken";

const staffAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.staff = decoded; // Attach staff info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default staffAuth;
