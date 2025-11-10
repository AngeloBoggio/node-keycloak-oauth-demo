const { jwtDecode } = require("jwt-decode");

const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "No token" });
  }

  const access_token = authHeader.split(" ")[1];

  const decodedToken = jwtDecode(access_token);

  req.user = decodedToken;

  next();
};

module.exports = { checkAuth };
