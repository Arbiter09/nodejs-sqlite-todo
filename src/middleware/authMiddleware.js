import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id; // Assuming the token contains the user ID
    next();
  });
}

export default authMiddleware;
// This middleware checks for the presence of a JWT token in the request headers.
