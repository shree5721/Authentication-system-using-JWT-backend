const jwt = require("jsonwebtoken");
const empModel = require("../models/dbModel.js");

//Middleware for protected routes
const isAuthenticated = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      try {
        token = authorization.split(" ")[1];
        // Verify the token
        const { userId } = await jwt.verify(token, "SecretKey");
        // Check user existence in database
        req.user = await empModel.findById(userId).select("--password");
        if (!req.user) {
          throw new Error("User not found");
        }
        next();
      } catch (error) {
        console.error("Error in isAuthenticated middleware:", error);
        return res.status(401).json({ status: "error", message: "Authorization failed" });
      }
    } else {
      return res.status(401).json({ status: "error", message: "Authorization header missing or invalid" });
    }
  };
  
module.exports = isAuthenticated;
