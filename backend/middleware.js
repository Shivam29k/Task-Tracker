const jwt = require("jsonwebtoken");
const { JWT_SECRET }  = require("./config");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({
      message: "Unauthorized"
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // console.log(payload);
    req.userId = payload.userId;
    return next();
  } catch (e) {
    return res.status(401).json({
      message: "Unauthorized",
      error: e
    });
  }
}

module.exports = { 
  authMiddleware
}